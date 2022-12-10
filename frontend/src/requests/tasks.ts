import { appRequest } from './util'
import Task, { CreateTaskDTO } from '@/types/Task'
import Pagination, { convertFromServer } from '@/types/Pagination'

export type CreateTaskArgs = {
  dto: CreateTaskDTO
}

export const createTask = appRequest<CreateTaskArgs, Task>()(
  async (client, { dto }) => await client.put('/tasks', dto)
)

export type GetTasksArgs = {
  page: number
  pageSize: number
}

export const getTasks = appRequest<GetTasksArgs, Pagination<Task>>({
  dataMapper: (value) => convertFromServer(value, (x) => x),
})(
  async (client, { page, pageSize }) =>
    await client.get('/tasks', { params: { page, page_size: pageSize } })
)

export type SingleTaskActionArgs = {
  taskId: number
}

export const deleteTask = appRequest<SingleTaskActionArgs, never>()(
  async (client, { taskId }) => await client.delete(`/tasks/${taskId}`)
)
