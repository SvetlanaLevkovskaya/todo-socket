'use client'

import { useEffect, useState } from 'react'

import { FilterSection } from '@/app/_ui/FilterSection/FilterSection'
import { Canvas } from '@/app/_ui/Todo/Canvas'
import { TaskEditor } from '@/app/_ui/Todo/TaskEditor'
import { TaskList } from '@/app/_ui/Todo/TaskList'
import { useSearch } from '@/providers/searchProvider'
import { getSocket } from '@/socket'
import { Task } from '@/types'

export const Todo = () => {
  const { searchQuery } = useSearch()
  const [tasks, setTasks] = useState<Task[]>([])
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isTaskEditorVisible, setTaskEditorVisible] = useState(false)
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [selectedFilters, setSelectedFilters] = useState<string>(
    typeof window !== 'undefined' ? localStorage.getItem('selectedFilter') || 'all' : 'all'
  )

  useEffect(() => {
    fetch('/api/tasks')
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error('Failed to fetch tasks:', error))

    const socket = getSocket()

    socket.on('connect', () => {
      console.log('Socket.IO connected')
    })

    const handleSocketChange = (change: any) => {
      if (change.action === 'added') {
        setTasks((prev) => [...prev, change.task])
      } else if (change.action === 'deleted') {
        setTasks((prev) => prev.filter((task) => task.id !== change.taskId))
      } else if (change.action === 'edited') {
        setTasks((prev) => prev.map((task) => (task.id === change.task.id ? change.task : task)))
      } else if (change.action === 'completed') {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === change.id ? { ...task, completed: change.completed } : task
          )
        )
      }
    }

    socket.on('change', handleSocketChange)

    return () => {
      socket.off('connect')
      socket.off('change', handleSocketChange)
    }
  }, [])

  useEffect(() => {
    const applyFilters = () => {
      let filtered = tasks

      filtered = filtered.filter((task) =>
        task.name.toLowerCase().includes(searchQuery.toLowerCase())
      )

      if (selectedFilters === 'done') {
        filtered = filtered.filter((task) => task.completed)
      }

      if (selectedFilters === 'in progress') {
        filtered = filtered.filter((task) => !task.completed)
      }

      setFilteredTasks(filtered)
    }

    applyFilters()
  }, [selectedFilters, tasks, searchQuery])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedFilter', selectedFilters)
    }
  }, [selectedFilters])

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

      const savedOrder: string[] = JSON.parse(localStorage.getItem('taskOrder') || '[]')

      const updatedOrder = savedOrder.filter((taskId) => taskId !== id)

      localStorage.setItem('taskOrder', JSON.stringify(updatedOrder))
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

  const handleSaveTask = (task: Omit<Task, 'id' | 'completed'> | Task) => {
    if ('id' in task) {
      editTask(task as Task)
    } else {
      const newTask = { ...task, completed: false }
      addTask(newTask as Omit<Task, 'id'>)
    }
  }

  const handleToggleComplete = (id: string, completed: boolean) => {
    fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to toggle task completion')
        return res.json()
      })
      .then((updatedTask: Task) => {
        const socket = getSocket()
        socket.emit('toggleComplete', { id, completed })
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === updatedTask.id ? { ...task, completed: updatedTask.completed } : task
          )
        )
      })
      .catch((error) => console.error('Error toggling task completion:', error))
  }

  const handleFilterChange = (filter: string) => {
    setSelectedFilters(filter)
  }

  return (
    <div className="flex flex-col md:flex-row justify-center gap-4">
      <FilterSection selectedFilters={selectedFilters} onFilterChange={handleFilterChange} />
      <div className="flex-grow px-4 max-w-[650px] min-w-[330px] w-full">
        <TaskList
          tasks={filteredTasks}
          onEdit={handleEditTaskClick}
          onDelete={deleteTask}
          onAddTask={handleAddTaskClick}
          onToggleComplete={handleToggleComplete}
        />
        {isTaskEditorVisible && (
          <div key={editingTask?.id || 'new'} className="my-4 pb-6">
            <TaskEditor
              onSave={handleSaveTask}
              initialTask={editingTask ? { ...editingTask } : undefined}
              onCancel={handleCancelTaskEditor}
            />
          </div>
        )}

        <Canvas tasks={filteredTasks} />
      </div>
    </div>
  )
}
