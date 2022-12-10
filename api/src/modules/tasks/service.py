from result import Ok, Err
from ...base_classes import ApplicationService
from ...exceptions import NotFoundException
from .crud import TasksCRUD
from . import schema


class TasksService(ApplicationService):
    def __init__(self, tasks_crud: TasksCRUD):
        self._tasks_crud = tasks_crud

    async def create(self, task: schema.TaskDTO):
        res = await self._tasks_crud.create(task)

        return Ok(res)

    async def get_by_id(self, id: int):
        res = await self._tasks_crud.get_by_id(id)

        if res is None:
            return Err(NotFoundException())

        return Ok(res)

    async def get_all(self, page: int, page_size: int):
        return Ok(await self._tasks_crud.get_pagination(page, page_size))

    async def delete(self, id: int):
        return Ok(await self._tasks_crud.delete(id))
