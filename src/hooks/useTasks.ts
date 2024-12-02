import { useCallback, useEffect, useState } from 'react'

import { fetchTasks } from '@/services/apiService'
import { getSocket } from '@/services/socket'

import { Task } from '@/types'

export const useTasks = (initialTasks: Task[]) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (tasks.length === 0) {
      fetchTasks()
        .then((fetchedTasks) => setTasks(fetchedTasks))
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [tasks.length])

  const handleSocketChange = useCallback((change: { action: string; task?: Task }) => {
    setTasks((prev) => {
      switch (change.action) {
        case 'added':
          return [...prev, change.task!]
        case 'deleted':
          return prev.filter((task) => task.id !== change.task?.id)
        case 'edited':
          return prev.map((task) => (task.id === change.task!.id ? change.task! : task))
        case 'toggledComplete':
          return prev.map((task) =>
            task.id === change.task?.id ? { ...task, completed: change.task.completed } : task
          )
        default:
          return prev
      }
    })
  }, [])

  useEffect(() => {
    const socket = getSocket()
    socket.on('change', handleSocketChange)
    socket.on('change', (data) => {
      console.log('Received change:', data)
    })
    return () => {
      socket.off('change', handleSocketChange)
      socket.disconnect()
    }
  }, [handleSocketChange])

  return { tasks, setTasks, isLoading }
}
