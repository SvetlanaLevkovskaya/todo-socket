import { useCallback } from 'react'

import {
  createTask,
  deleteTask,
  fetchTasks,
  toggleTaskCompletion,
  updateTask,
} from '@/services/apiService'
import { getSocket } from '@/services/socket'

import { customToastError, customToastSuccess } from '@/components'
import { Task } from '@/types'

export const useTaskApi = () => {
  const fetchAllTasks = useCallback(async () => {
    try {
      return await fetchTasks()
    } catch (error) {
      customToastError('Failed to fetch tasks')
      console.error(error)
      throw error
    }
  }, [])

  const saveTask = async (task: Task | Omit<Task, 'id'>) => {
    console.log('saveTask')
    const socket = getSocket()
    try {
      if ('id' in task) {
        const updatedTask = await updateTask(task)
        socket.emit('editTask', updatedTask)
        customToastSuccess('Task updated successfully')
        return updatedTask
      } else {
        const newTask = await createTask(task)
        socket.emit('addTask', newTask)
        customToastSuccess(`Task ${task.name} created successfully`)
        return newTask
      }
    } catch (error) {
      customToastError('Failed to save task')
      console.error(error)
      throw error
    }
  }

  const deleteTaskById = async (id: string) => {
    console.log('deleteTaskById')
    try {
      await deleteTask(id)
      const socket = getSocket()
      socket.emit('deleteTask', id)
      customToastSuccess(`Task ${id} deleted successfully`)
    } catch (error) {
      customToastError('Failed to delete task')
      console.error(error)
      throw error
    }
  }

  const toggleComplete = async (id: string, completed: boolean) => {
    console.log('toggleComplete')
    try {
      const updatedTask = await toggleTaskCompletion(id, completed)
      const socket = getSocket()
      socket.emit('toggleComplete', { id, completed })
      customToastSuccess(`Task ${id} status updated successfully`)
      return updatedTask
    } catch (error) {
      customToastError('Failed to toggle task completion')
      console.error(error)
      throw error
    }
  }

  return { fetchAllTasks, saveTask, deleteTaskById, toggleComplete }
}
