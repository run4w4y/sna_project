import { CreateTaskDTO } from '@/types/Task'
import React, { useState } from 'react'
import { PlusIcon } from '@heroicons/react/solid'

interface CreateTaskFormProps {
  onSubmit: (dto: CreateTaskDTO) => void
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('')

  return (
    <div className="flex w-full rounded bg-white px-6 py-4 shadow items-center h-20 gap-x-4">
      <input 
        className='flex-grow bg-slate-100 rounded h-12 text-lg outline-none ring-none focus:ring-2 focus:ring-indigo-500 px-2'
        placeholder='Enter your new task title here'
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        className="pointer rounded-full p-2 text-indigo-600 hover:bg-indigo-600 hover:text-white border-2 border-indigo-600"
        onClick={() => onSubmit({ title })}
      >
        <PlusIcon className="h-6 w-6" />
      </button>
    </div>
  )
}

export default CreateTaskForm
