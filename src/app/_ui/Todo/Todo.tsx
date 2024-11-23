'use client'

import { useEffect, useState } from 'react'

import { io } from 'socket.io-client'

import { FilterSection } from '@/app/_ui/FilterSection/FilterSection'
import { Canvas } from '@/app/_ui/Todo/Canvas'
import { TaskEditor } from '@/app/_ui/Todo/TaskEditor'
import { TaskList } from '@/app/_ui/Todo/TaskList'
import { Task } from '@/types'

export const Todo = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  useEffect(() => {
    if (tasks.length === 0) {
      fetch('/api/tasks')
        .then((res) => res.json())
        .then((data) => setTasks(data))
    }

    const socket = io('http://localhost:3003')
    socket.on('connect', () => {
      console.log('Socket.IO connected')
    })

    socket.on('change', (change) => {
      console.log('Data changed:', change)
      if (change.action === 'added') {
        setTasks((prev) => [...prev, change.task])
      } else if (change.action === 'deleted') {
        setTasks((prev) => prev.filter((task) => task.id !== change.taskId))
      }
    })

    socket.on('disconnect', () => {
      console.log('Socket.IO disconnected')
    })

    return () => {
      socket.disconnect()
    }
  }, [tasks.length])

  const addTask = (task: Omit<Task, 'id'>) => {
    fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    })
      .then((res) => res.json())
      .then((newTask: Task) => {
        const socket = io('http://localhost:3003')
        socket.emit('addTask', newTask)
      })
  }

  const deleteTask = (id: string) => {
    fetch(`/api/tasks/${id}`, { method: 'DELETE' }).then(() => {
      const socket = io('http://localhost:3003')
      socket.emit('deleteTask', id)
    })
  }

  return (
    <div className="flex justify-center gap-2">
      <FilterSection />
      <div className="max-w-4xl mx-auto p-4">
        <TaskEditor onSave={addTask} initialTask={editingTask} />
        <TaskList tasks={tasks} onEdit={setEditingTask} onDelete={deleteTask} />
        <Canvas tasks={tasks} />
      </div>
    </div>
  )
}
