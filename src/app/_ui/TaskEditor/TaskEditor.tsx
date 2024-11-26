import { useState } from 'react'
import Flatpickr from 'react-flatpickr'

import 'flatpickr/dist/themes/material_green.css'

import { customToastError } from '@/components'
import { Task } from '@/types'

export const TaskEditor = ({
  onSave,
  initialTask,
  onCancel,
}: {
  onSave: (updatedTask: Task | Omit<Task, 'id'>) => void
  initialTask?: Task | Omit<Task, 'id'> | null
  onCancel: () => void
}) => {
  const [task, setTask] = useState<Omit<Task, 'id'>>({
    name: initialTask?.name || '',
    description: initialTask?.description || '',
    deadline: initialTask?.deadline || '',
    completed: initialTask?.completed || false,
  })

  const handleSave = () => {
    if (!task.name || !task.description || !task.deadline) {
      customToastError('Please fill in all fields!')
      return
    }
    const fullTask = initialTask && 'id' in initialTask ? { ...initialTask, ...task } : task
    onSave(fullTask)
    setTask({ name: '', description: '', deadline: '', completed: false })
  }

  return (
    <>
      <input
        type="text"
        value={task.name}
        onChange={(e) => setTask({ ...task, name: e.target.value })}
        placeholder="Task name"
        className="w-full p-2 border rounded-lg mb-2 text-sm focus:border-orange-500 transition-all2 placeholder-slate-500 outline-none"
      />
      <textarea
        value={task.description}
        onChange={(e) => setTask({ ...task, description: e.target.value })}
        placeholder="Task description"
        className="w-full p-2 border rounded-lg mb-2 text-sm focus:border-orange-500 transition-all2 placeholder-slate-500 outline-none"
      />
      <Flatpickr
        data-enable-time
        value={task.deadline}
        placeholder="Deadline"
        onChange={([date]) => setTask({ ...task, deadline: date.toISOString() })}
        options={{
          enableTime: true,
          dateFormat: 'd.m.Y H:i',
        }}
        className="w-full p-2 border rounded-lg mb-2 text-sm focus:border-orange-500 transition-all2 placeholder-slate-500 outline-none"
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
