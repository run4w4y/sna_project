import React, { useEffect, useState } from 'react'
import { getTasks, deleteTask, createTask } from '@/requests/tasks'
import TaskCard from '@/components/TaskCard'
import PaginationT from '@/types/Pagination'
import Pagination from '@/components/Pagination'
import Task, { CreateTaskDTO } from '@/types/Task'
import CreateTaskForm from '@/components/CreateTaskForm'

const TasksPage: React.FC = () => {
  const [items, setItems] = useState<PaginationT<Task> | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const fetchItems = async () => {
    setLoading(true)
    const res = await getTasks({ page: currentPage, pageSize: 10 })
    setLoading(false)
    setItems(res)
  }

  const deleteItem = async (taskId: number) => {
    setLoading(true)
    await deleteTask({ taskId })
    await fetchItems()
  }

  const addItem = async (dto: CreateTaskDTO) => {
    setLoading(true)
    await createTask({ dto })
    await fetchItems()
  }

  useEffect(() => {
    fetchItems()
  }, [currentPage])

  return (
    <div className='flex justify-center w-full'>
      <div className='pt-20 max-w-screen-lg w-full space-y-8'>
        <div className='text-3xl text-slate-900 font-semibold'>
          Your tasks
        </div>

        <div className='w-full space-y-4'>
          <CreateTaskForm 
            onSubmit={addItem}
          />

          {items?.items.map((item) => (
            <TaskCard title={item.title} onDelete={() => deleteItem(item.id)} key={item.id} />
          ))}
        </div>

        {items ? <Pagination onChange={setCurrentPage} pagination={items} /> : null}
      </div>
    </div>
  )
}

export default TasksPage
