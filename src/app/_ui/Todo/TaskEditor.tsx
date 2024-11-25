import { useState } from 'react'

import { customToastError } from '@/components'
import { Task } from '@/types'

export const TaskEditor = ({
  onSave,
  initialTask,
  onCancel,
}: {
  onSave: (updatedTask: { name: string; description: string; deadline: string }) => void
  initialTask?: Task | Omit<Task, 'id'>
  onCancel: () => void
}) => {
  const [task, setTask] = useState(initialTask || { name: '', description: '', deadline: '' })

  const handleSave = () => {
    if (!task.name || !task.description || !task.deadline) {
      customToastError('Please fill in all fields!')
      return
    }
    onSave(task)
    setTask({ name: '', description: '', deadline: '' })
  }

  return (
    <>
      <input
        type="text"
        value={task.name}
        onChange={(e) => setTask({ ...task, name: e.target.value })}
        placeholder="Task name"
        className="w-full p-2 border rounded-lg mb-2 text-sm focus:border-amber-500 transition-all placeholder-gray-500 outline-none"
      />
      <textarea
        value={task.description}
        onChange={(e) => setTask({ ...task, description: e.target.value })}
        placeholder="Task description"
        className="w-full p-2 border rounded-lg mb-2 text-sm focus:border-amber-500 transition-all placeholder-gray-500 outline-none"
      />
      <input
        type="date"
        value={task.deadline}
        onChange={(e) => setTask({ ...task, deadline: e.target.value })}
        placeholder="Deadline"
        className="w-full p-2 border rounded-lg mb-2 text-sm focus:border-amber-500 transition-all placeholder-gray-500 outline-none"
      />
      <div className="flex justify-center gap-2">
        <button onClick={handleSave} className="w-full bg-teal-400 text-white py-2 rounded-lg">
          Save
        </button>
        <button onClick={onCancel} className="w-full bg-cyan-400 text-white py-2 rounded-lg">
          Cancel
        </button>
      </div>
    </>
  )
}
