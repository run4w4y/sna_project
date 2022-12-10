import asyncio
from contextlib import AbstractAsyncContextManager, asynccontextmanager
from copy import deepcopy
from typing import Awaitable, Callable, Iterable, Optional, Any, Generic, Type, TypeVar, List, Dict, MutableSet, get_args
from pydantic import BaseModel
from pydantic.generics import GenericModel
from pydantic.utils import sequence_like
from sqlalchemy import distinct, cast
from sqlalchemy.sql.selectable import Select, GenerativeSelect
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql.functions import func
from sqlalchemy.dialects.postgresql import TSVECTOR
from sqlalchemy.types import TypeDecorator, UserDefinedType
import math

from .db import ModelBase

import config

GenericORMModel = TypeVar('GenericORMModel', bound=ModelBase)


class OrderConfig(BaseModel):
    ordered: bool
    use_secondary: bool
    secondary_table: Optional[Type[ModelBase]]
    column_name: Optional[str]


class ORMModel(Generic[GenericORMModel], GenericModel):
    __with_id__: Dict[str, OrderConfig] = dict()
    __exclude__: MutableSet[str] = set()
    __orm_model__: Optional[type[GenericORMModel]] = None

    # some generic shananigans
    def _get_type(self):
        return get_args(self.__orig_bases__[0])[0]

    def _to_model(self, value, **kwargs):
        if isinstance(value, ORMModel):
            return value.to_model(**kwargs)
        elif isinstance(value, BaseModel):
            raise ValueError(f"Can't create model from `BaseModel` of {value}")
        elif sequence_like(value):
            return [self._to_model(v, **kwargs) for v in value]
        elif isinstance(value, dict):
            return {k: self._to_model(v, **kwargs) for k, v in value.items()}
        else:
            return value

    def to_model(self, **kwargs) -> GenericORMModel:
        if self.__orm_model__ is None:
            type(self).__orm_model__ = self._get_type()

        d = deepcopy(self.__dict__)

        values: dict[str, Any] = {}

        for item_name in self.__with_id__:
            conf = self.__with_id__[item_name]
            seq = d.pop(item_name)
            values[item_name] = []
            values[f'{item_name}_associations'] = []
            values[f'{item_name}_association_ids'] = []
            for index, item in enumerate(seq):
                if isinstance(item, int):
                    if not conf.ordered:
                        values[f'{item_name}_association_ids'].append(item)
                    else:
                        assert conf.column_name and conf.secondary_table
                        params = {conf.column_name: item, 'position': index}
                        values[f'{item_name}_associations'].append(conf.secondary_table(**params))
                elif isinstance(item, ORMModel):
                    if not conf.ordered and not conf.use_secondary:
                        res = item.to_model(**kwargs)
                        values[item_name].append(res)
                    else:
                        assert conf.secondary_table
                        params = {f'{item_name}_association': item.to_model(**kwargs), 'position': index}
                        values[f'{item_name}_associations'].append(conf.secondary_table(**params))
                else:
                    raise TypeError(f'Invalid create model configuration. Type of {item_name} is not `int` or `CreateModel` it is {type(item)}')

            if not values[f'{item_name}_associations']:
                values.pop(f'{item_name}_associations')
            if not values[f'{item_name}_association_ids']:
                values.pop(f'{item_name}_association_ids')

        values.update({name: self._to_model(value, **kwargs) for name, value in d.items() if name not in self.__exclude__})
        assert self.__orm_model__, 'Need to specify __orm_model__ to use method `to_model`'
        return self.__orm_model__(**values)


    class Config:
        orm_mode = True


class TSVector(TypeDecorator):
    impl = TSVECTOR


class RegConfig(UserDefinedType):
    def get_col_spec(self, **kw):
        return "regconfig"

    @classmethod
    def create(cls, value: str):
        return cast(value, cls)


SchemaT = TypeVar('SchemaT', bound=ORMModel)
SchemaK = TypeVar('SchemaK', bound=ORMModel)
T = TypeVar('T')


class Pagination(GenericModel, Generic[T]):
    page: int
    page_size: int
    pages_count: int
    count: int
    items: List[T]

    def __iter__(self):
        return iter(self.items)


def cast_pagination(pagination: Pagination[SchemaT], schema: Type[SchemaK]):
    return Pagination[schema](
        **pagination.dict(exclude={'items'}),
        items=[schema(**item.dict()) for item in pagination]
    )

def _generate_count_stmt(stmt, distinct_on=None):
    if distinct_on:
        cnt_f = func.count(distinct(distinct_on))
    else:
        cnt_f = func.count()
    return stmt.order_by(None).with_only_columns(cnt_f, maintain_column_froms=True)


class ApplicationCRUD:
    def __init__(self, session_factory: Callable[..., AbstractAsyncContextManager[AsyncSession]]):
        self.session_factory = session_factory

    async def execute(self, stmt):
        async with self.session_factory() as db:
            res = await db.execute(stmt)

        return res

    async def _count(self, session, stmt, distnict_on=None) -> int:
        return (await session.execute(_generate_count_stmt(stmt, distnict_on))).scalars().one()

    async def count(self, stmt, distnict_on=None) -> int:
        async with self.session_factory() as session:
            return await self._count(session, stmt, distnict_on)

    async def create_pagination(
        self,
        stmt: GenerativeSelect,
        page: int,
        page_size: int,
        schema: Type[T],
        mapper: Callable[[Any], T] = lambda x: x
    ):
        count = await self.count(stmt)

        result = (await self.execute(stmt.limit(page_size).offset((page - 1) * (page_size)))).fetchall()
        result = list(map(mapper, result))
        return Pagination[schema](
            items=result,
            page_size=page_size,
            page=page,
            pages_count=math.ceil(count / page_size),
            count=count
        )

    # can't work with distinct properly and with only one distinct_on argument
    async def create_orm_pagination(
        self,
        stmt: Select,
        page: int,
        page_size: int,
        schema: Type[SchemaT],
        model: Optional[Type[ModelBase]] = None,
        distinct_on=None,
        mapper: Optional[Callable[[Any], SchemaT]] = None
    ):
        async with self.session_factory() as session:
            count = await self._count(session, stmt, distinct_on)

            if distinct_on:
                stmt = stmt.distinct(distinct_on)

            items = (await session.execute(stmt.limit(page_size).offset((page - 1) * page_size))).all()

            result = list(map(schema.from_orm if mapper is None else mapper, map(lambda x: x[model.__name__] if model else x[0], items)))

        return Pagination[schema](
            items=result,
            page_size=page_size,
            page=page,
            pages_count=math.ceil(count / page_size),
            count=count
        )


class ApplicationService:
    @asynccontextmanager
    async def __call__(self, *args, **kwargs):
        await self._mount(*args, **kwargs)
        closed = False
        try:
            yield self
        except Exception as exc:
            if not closed:
                await self._unmount(exc)
                closed = True
            raise exc
        finally:
            if not closed:
                await self._unmount(None)
                closed = True

    async def _mount(self, *args: Any, **kwargs: Any) -> None:
        pass

    async def _unmount(self, exc: Optional[Exception]) -> None:
        pass
