export interface Task {
  id: string
  name: string
  description: string
  deadline: string
  completed: boolean
}

export type SortOrderType = 'asc' | 'desc'
