import { useState } from 'react'

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
      {/*      <input
       type="text"
       value={task.deadline}
       onChange={(e) => setTask({ ...task, deadline: e.target.value })}
       placeholder="Deadline"
       onFocus={(e) => (e.target.type = 'date')}
       onBlur={(e) => (e.target.type = 'text')}
       className="w-full p-2 border rounded-lg mb-2 text-sm focus:border-amber-500 transition-all placeholder-slate-500 outline-none"
       />*/}

      <input
        type="datetime-local"
        value={task.deadline}
        onChange={(e) => setTask({ ...task, deadline: e.target.value })}
        placeholder="Deadline"
        className="w-full p-2 border rounded-lg mb-2 text-sm focus:border-amber-500 transition-all placeholder-slate-500 outline-none"
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
