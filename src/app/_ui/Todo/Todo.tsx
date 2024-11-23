'use client'

import { useEffect, useState } from 'react'

import { FilterSection } from '@/app/_ui/FilterSection/FilterSection'
import { Canvas } from '@/app/_ui/Todo/Canvas'
import { TaskEditor } from '@/app/_ui/Todo/TaskEditor'
import { TaskList } from '@/app/_ui/Todo/TaskList'
import { getSocket } from '@/socket'
import { Task } from '@/types'

export const Todo = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  useEffect(() => {
    fetch('/api/tasks')
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error('Failed to fetch tasks:', error))

    const socket = getSocket()

    socket.on('connect', () => {
      console.log('Socket.IO connected')
    })

    socket.on('change', (change) => {
      console.log('Data changed:', change)
      if (change.action === 'added') {
        setTasks((prev) => [...prev, change.task])
      } else if (change.action === 'deleted') {
        setTasks((prev) => prev.filter((task) => task.id !== change.taskId))
      } else if (change.action === 'edited') {
        setTasks((prev) => prev.map((task) => (task.id === change.task.id ? change.task : task)))
      }
    })

    socket.on('disconnect', () => {
      console.log('Socket.IO disconnected')
    })

    return () => {
      socket.off('change')
    }
  }, [])

  const addTask = (task: Omit<Task, 'id'>) => {
    fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    })
      .then((res) => res.json())
      .then((newTask: Task) => {
        const socket = getSocket()
        socket.emit('addTask', newTask)
      })
  }

  const deleteTask = (id: string) => {
    fetch(`/api/tasks/${id}`, { method: 'DELETE' }).then(() => {
      const socket = getSocket()
      socket.emit('deleteTask', id)
    })
  }

  const editTask = (updatedTask: Task) => {
    fetch(`/api/tasks/${updatedTask.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask),
    })
      .then((res) => res.json())
      .then((newTask) => {
        const socket = getSocket()
        socket.emit('editTask', newTask)
        setEditingTask(null)
      })
      .catch((error) => console.error('Failed to update task:', error))
  }

  return (
    <div className="flex justify-center gap-2">
      <FilterSection />
      <div className="max-w-4xl mx-auto p-4">
        <TaskEditor onSave={editingTask ? editTask : addTask} initialTask={editingTask} />
        <TaskList tasks={tasks} onEdit={setEditingTask} onDelete={deleteTask} />
        <Canvas tasks={tasks} />
      </div>
    </div>
  )
}
