import { useCallback } from 'react'

import {
  createTask,
  deleteTask,
  fetchTasks,
  toggleTaskCompletion,
  updateTask,
} from '@/app/api/apiService'
import { getSocket } from '@/socket'
import { Task } from '@/types'

export const useTaskApi = () => {
  const fetchAllTasks = useCallback(() => fetchTasks(), [])

  const saveTask = useCallback(async (task: Task | Omit<Task, 'id'>) => {
    const socket = getSocket()
    if ('id' in task) {
      const updatedTask = await updateTask(task)
      socket.emit('editTask', updatedTask)
      return updatedTask
    } else {
      const newTask = await createTask(task)
      socket.emit('addTask', newTask)
      return newTask
    }
  }, [])

  const deleteTaskById = useCallback(async (id: string) => {
    await deleteTask(id)
    const socket = getSocket()
    socket.emit('deleteTask', id)
  }, [])

  const toggleComplete = useCallback(async (id: string, completed: boolean) => {
    const updatedTask = await toggleTaskCompletion(id, completed)
    const socket = getSocket()
    socket.emit('toggleComplete', { id, completed })
    return updatedTask
  }, [])

  return { fetchAllTasks, saveTask, deleteTaskById, toggleComplete }
}
