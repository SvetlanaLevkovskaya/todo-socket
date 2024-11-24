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
  const [isTaskEditorVisible, setTaskEditorVisible] = useState(false)

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
        setTaskEditorVisible(false)
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
        setTaskEditorVisible(false)
      })
      .catch((error) => console.error('Failed to update task:', error))
  }

  const handleAddTaskClick = () => {
    setEditingTask(null)
    setTaskEditorVisible(true)
  }

  const handleEditTaskClick = (task: Task) => {
    setEditingTask(task)
    setTaskEditorVisible(true)
  }

  const handleCancelTaskEditor = () => {
    setEditingTask(null)
    setTaskEditorVisible(false)
  }

  const handleSaveTask = (task: Omit<Task, 'id'> | Task) => {
    if ('id' in task) {
      editTask(task)
    } else {
      addTask(task)
    }
  }

  return (
    <div className="flex flex-col md:flex-row justify-center gap-4">
      <FilterSection />
      <div className="flex-grow px-4 max-w-[650px] w-full">
        <TaskList
          tasks={tasks}
          onEdit={handleEditTaskClick}
          onDelete={deleteTask}
          onAddTask={handleAddTaskClick}
        />
        {isTaskEditorVisible && (
          <div key={editingTask?.id || 'new'} className="my-4 pb-6">
            <TaskEditor
              onSave={handleSaveTask}
              initialTask={editingTask ? { ...editingTask } : undefined} // Приведение типа
              onCancel={handleCancelTaskEditor}
            />
          </div>
        )}

        <Canvas tasks={tasks} />
      </div>
    </div>
  )
}
