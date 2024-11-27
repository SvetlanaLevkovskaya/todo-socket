import { useCallback } from 'react'

import {
  createTask,
  deleteTask,
  fetchTasks,
  toggleTaskCompletion,
  updateTask,
} from '@/app/api/apiService'
import { customToastError, customToastSuccess } from '@/components'
import { getSocket } from '@/socket'
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

  const saveTask = useCallback(async (task: Task | Omit<Task, 'id'>) => {
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
        customToastSuccess('Task created successfully')
        return newTask
      }
    } catch (error) {
      customToastError('Failed to save task')
      console.error(error)
      throw error
    }
  }, [])

  const deleteTaskById = useCallback(async (id: string) => {
    try {
      await deleteTask(id)
      const socket = getSocket()
      socket.emit('deleteTask', id)
      customToastSuccess('Task deleted successfully')
    } catch (error) {
      customToastError('Failed to delete task')
      console.error(error)
      throw error
    }
  }, [])

  const toggleComplete = useCallback(async (id: string, completed: boolean) => {
    try {
      const updatedTask = await toggleTaskCompletion(id, completed)
      const socket = getSocket()
      socket.emit('toggleComplete', { id, completed })
      customToastSuccess('Task status updated successfully')
      return updatedTask
    } catch (error) {
      customToastError('Failed to toggle task completion')
      console.error(error)
      throw error
    }
  }, [])
  return { fetchAllTasks, saveTask, deleteTaskById, toggleComplete }
}
