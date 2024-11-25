export interface Task {
  id: string
  name: string
  description: string
  deadline: string
  completed: boolean
}

export type SortOrder = 'asc' | 'desc'
