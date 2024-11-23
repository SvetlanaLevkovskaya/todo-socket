import { SortOrder } from '@/types'

export const isSortOrder = (value: string | null): value is SortOrder => {
  return value === 'asc' || value === 'desc'
}
