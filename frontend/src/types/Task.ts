type Task = {
  id: number
  title: string
  created_ts: string
}

export default Task

export type CreateTaskDTO = {
  title: string
}
