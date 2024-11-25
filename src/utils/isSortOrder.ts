import { SortOrderType } from '@/types'

export const isSortOrder = (value: string | null): value is SortOrderType => {
  return value === 'asc' || value === 'desc'
}
