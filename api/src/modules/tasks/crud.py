from sqlalchemy import select, delete
from ...base_classes import ApplicationCRUD
from .models import Task
from . import schema


class TasksCRUD(ApplicationCRUD):
    async def create(self, dto: schema.CreateTask):
        async with self.session_factory() as session:
            item = dto.to_model()
            session.add(
                item,
            )
            await session.flush()
            new_partner = await session.get(Task, item.id, populate_existing=True)
            return schema.TaskDTO.from_orm(new_partner) if new_partner is not None else None
    
    async def delete(self, id: int):
        stmt = delete(Task).where(Task.id == id)
        return (await self.execute(stmt)).rowcount 
    
    async def get_by_id(self, id: int):
        async with self.session_factory() as session:
            partner = await session.get(Task, id, populate_existing=True)

            return schema.TaskDTO.from_orm(partner) if partner is not None else None

    async def get_pagination(self, page: int, page_size: int):
        stmt = select(Task).order_by(Task.created_ts)
        return await self.create_orm_pagination(stmt, page, page_size, schema.TaskDTO, Task)
