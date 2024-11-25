import { Task } from '@/types'

const API_BASE_URL = '/api/tasks'

export const fetchTasks = async (): Promise<Task[]> => {
  const response = await fetch(API_BASE_URL)
  if (!response.ok) throw new Error('Failed to fetch tasks')
  return response.json()
}

export const createTask = async (task: Omit<Task, 'id'>): Promise<Task> => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  })
  if (!response.ok) throw new Error('Failed to create task')
  return response.json()
}

export const updateTask = async (task: Task): Promise<Task> => {
  const response = await fetch(`${API_BASE_URL}/${task.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  })
  if (!response.ok) throw new Error('Failed to update task')
  return response.json()
}

export const deleteTask = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' })
  if (!response.ok) throw new Error('Failed to delete task')
}

export const toggleTaskCompletion = async (id: string, completed: boolean): Promise<Task> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  })
  if (!response.ok) throw new Error('Failed to toggle task completion')
  return response.json()
}
