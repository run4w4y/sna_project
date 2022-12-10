import React from 'react'
import { TrashIcon } from '@heroicons/react/solid'

interface TaskCardProps {
  title: string
  onDelete: () => void
}

const TaskCard: React.FC<TaskCardProps> = ({ title, onDelete }) => {
  return (
    <div className="group flex w-full rounded bg-white px-6 py-4 shadow items-center h-20">
      <div className="flex-grow text-xl text-slate-800">{title}</div>
      <button
        className="pointer hidden rounded-full p-2 text-red-600 hover:bg-red-200 hover:text-red-800 group-hover:block"
        onClick={onDelete}
      >
        <TrashIcon className="h-6 w-6" />
      </button>
    </div>
  )
}

export default TaskCard
