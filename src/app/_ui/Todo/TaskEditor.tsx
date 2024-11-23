import React, { useState } from 'react'

export const TaskEditor = ({ onSave, initialTask }: any) => {
  const [task, setTask] = useState(initialTask || { name: '', description: '', deadline: '' })

  const handleSave = () => {
    if (!task.name || !task.description || !task.deadline) {
      alert('Please fill in all fields!')
      return
    }
    onSave(task)
    setTask({ name: '', description: '', deadline: '' })
  }

  return (
    <div className="p-4">
      <input
        type="text"
        value={task.name}
        onChange={(e) => setTask({ ...task, name: e.target.value })}
        placeholder="Task name"
        className="w-full p-2 border rounded mb-2"
      />
      <textarea
        value={task.description}
        onChange={(e) => setTask({ ...task, description: e.target.value })}
        placeholder="Task description"
        className="w-full p-2 border rounded mb-2"
      />
      <input
        type="date"
        value={task.deadline}
        onChange={(e) => setTask({ ...task, deadline: e.target.value })}
        placeholder="Deadline"
        className="w-full p-2 border rounded mb-2"
      />
      <button onClick={handleSave} className="w-full bg-green-500 text-white py-2 rounded">
        Save Task
      </button>
    </div>
  )
}
