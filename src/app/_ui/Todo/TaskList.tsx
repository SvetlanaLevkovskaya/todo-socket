import React from 'react'

import { Task } from '@/types'

interface Props {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

export const TaskList = ({ tasks, onEdit, onDelete }: Props) => {
  const handleEdit = (task: Task): void => {
    console.log('task', task)
    onEdit(task)
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Tasks</h2>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="flex justify-between items-center p-2 bg-gray-200 rounded">
            <span>{task.name}</span>
            <div>
              <button
                onClick={() => handleEdit(task)}
                className="px-2 py-1 bg-blue-500 text-white rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="px-2 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
