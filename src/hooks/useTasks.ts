import { useEffect, useState } from 'react'

import { useTaskApi } from '@/hooks/useTaskApi'
import { useTaskFilters } from '@/hooks/useTaskFilters'

import { useSearch } from '@/providers/searchProvider'
import { getSocket } from '@/socket'
import { Task } from '@/types'

export const useTasks = () => {
  const { searchQuery } = useSearch()
  const { fetchAllTasks, saveTask, deleteTaskById, toggleComplete } = useTaskApi()
  const [tasks, setTasks] = useState<Task[]>([])
  const { filteredTasks, selectedFilters, sortOrder, setSelectedFilters, setSortOrder } =
    useTaskFilters(tasks, searchQuery)

  useEffect(() => {
    fetchAllTasks().then(setTasks).catch(console.error)
  }, [fetchAllTasks])

  useEffect(() => {
    const socket = getSocket()
    const handleSocketChange = (change: {
      action: string
      task?: Task
      taskId?: string
      id?: string
      completed?: boolean
    }) => {
      setTasks((prev) => {
        switch (change.action) {
          case 'added':
            return [...prev, change.task!]
          case 'deleted':
            return prev.filter((task) => task.id !== change.taskId)
          case 'edited':
            return prev.map((task) => (task.id === change.task!.id ? change.task! : task))
          case 'toggledComplete':
            return prev.map((task) =>
              task.id === change.id ? { ...task, completed: change.completed! } : task
            )
          default:
            return prev
        }
      })
    }
    socket.on('change', handleSocketChange)

    return () => {
      socket.off('change', handleSocketChange)
      socket.disconnect()
    }
  }, [])

  return {
    tasks,
    filteredTasks,
    saveTask,
    deleteTaskById,
    toggleComplete,
    selectedFilters,
    sortOrder,
    setSelectedFilters,
    setSortOrder,
  }
}
