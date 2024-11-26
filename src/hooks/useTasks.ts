import { useCallback, useEffect, useState } from 'react'

import {
  createTask,
  deleteTask,
  fetchTasks,
  toggleTaskCompletion,
  updateTask,
} from '@/app/api/apiService'
import { useSearch } from '@/providers/searchProvider'
import { getSocket } from '@/socket'
import { SortOrderType, Task } from '@/types'
import { readFromLocalStorage, saveToLocalStorage } from '@/utils'

export const useTasks = () => {
  const { searchQuery } = useSearch()
  const [tasks, setTasks] = useState<Task[]>([])
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isTaskEditorVisible, setTaskEditorVisible] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<string>(() =>
    readFromLocalStorage('selectedFilter', 'all')
  )
  const [sortOrder, setSortOrder] = useState<SortOrderType>(
    () => readFromLocalStorage('sortOrder', 'asc') as SortOrderType
  )
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])

  useEffect(() => {
    fetchTasks()
      .then(setTasks)
      .catch((error) => console.error('Error fetching tasks:', error))
  }, [])

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
    }
  }, [])

  useEffect(() => {
    const applyFilters = () => {
      let result = tasks.filter((task) =>
        task.name.toLowerCase().includes(searchQuery.toLowerCase())
      )

      if (selectedFilters === 'done') {
        result = result.filter((task) => task.completed)
      } else if (selectedFilters === 'in progress') {
        result = result.filter((task) => !task.completed)
      }

      result = result.sort((a, b) => {
        const dateA = new Date(a.deadline).getTime()
        const dateB = new Date(b.deadline).getTime()
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
      })

      setFilteredTasks(result)
    }

    applyFilters()
  }, [tasks, selectedFilters, searchQuery, sortOrder])

  useEffect(() => {
    saveToLocalStorage('selectedFilter', selectedFilters)
    saveToLocalStorage('sortOrder', sortOrder)
  }, [selectedFilters, sortOrder])

  const handleSaveTask = useCallback(async (task: Task | Omit<Task, 'id'>) => {
    try {
      if ('id' in task) {
        const updatedTask = await updateTask(task)
        const socket = getSocket()
        socket.emit('editTask', updatedTask)
      } else {
        const newTask = await createTask(task)
        const socket = getSocket()
        socket.emit('addTask', newTask)
      }
      setTaskEditorVisible(false)
    } catch (error) {
      console.error('Error saving task:', error)
    }
  }, [])

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id)
      const socket = getSocket()
      socket.emit('deleteTask', id)
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      const updatedTask = await toggleTaskCompletion(id, completed)
      const socket = getSocket()
      socket.emit('toggleComplete', { id, completed })
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? { ...task, completed: updatedTask.completed } : task
        )
      )
    } catch (error) {
      console.error('Error toggling task completion:', error)
    }
  }

  return {
    filteredTasks,
    selectedFilters,
    sortOrder,
    editingTask,
    isTaskEditorVisible,
    setSelectedFilters,
    setSortOrder,
    setTaskEditorVisible,
    setEditingTask,
    handleSaveTask,
    handleDeleteTask,
    handleToggleComplete,
  }
}
