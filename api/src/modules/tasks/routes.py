from ...util import handled_result_async
from ...base_classes import Pagination
from ...containers import Container
from .schema import TaskDTO, CreateTask
from .service import TasksService
from fastapi import APIRouter, Depends
from dependency_injector.wiring import inject, Provide

router = APIRouter(prefix='/tasks')

@router.get('/', response_model=Pagination[TaskDTO])
@handled_result_async
@inject
async def get_tasks(
    page: int = 1,
    page_size: int = 10,
    service: TasksService = Depends(Provide[Container.tasks_service])
):
    async with service() as s:
        res = await s.get_all(page, page_size)

    return res

@router.get('/{task_id}', response_model=TaskDTO)
@handled_result_async
@inject
async def get_task(
    task_id: int,
    service: TasksService = Depends(Provide[Container.tasks_service])
):
    async with service() as s:
        res = await s.get_by_id(task_id)

    return res

@router.put('/', response_model=TaskDTO)
@handled_result_async
@inject
async def create_task(
    task: CreateTask,
    service: TasksService = Depends(Provide[Container.tasks_service])
):
    async with service() as s:
        res = await s.create(task)

    return res

@router.delete('/{task_id}')
@handled_result_async
@inject
async def delete_task(
    task_id: int,
    service: TasksService = Depends(Provide[Container.tasks_service])
):
    async with service() as s:
        res = await s.delete(task_id)

    return res
