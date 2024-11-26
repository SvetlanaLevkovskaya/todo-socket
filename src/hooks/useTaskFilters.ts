import { useEffect, useMemo, useState } from 'react'

import { SortOrderType, Task } from '@/types'
import { readFromLocalStorage, saveToLocalStorage } from '@/utils'

export const useTaskFilters = (tasks: Task[], searchQuery: string) => {
  const [selectedFilters, setSelectedFilters] = useState<string>(() =>
    readFromLocalStorage('selectedFilter', 'all')
  )
  const [sortOrder, setSortOrder] = useState<SortOrderType>(
    () => readFromLocalStorage('sortOrder', 'asc') as SortOrderType
  )

  const filteredTasks = useMemo(() => {
    let result = tasks.filter((task) => task.name.toLowerCase().includes(searchQuery.toLowerCase()))
    if (selectedFilters === 'done') {
      result = result.filter((task) => task.completed)
    } else if (selectedFilters === 'in progress') {
      result = result.filter((task) => !task.completed)
    }
    result.sort((a, b) =>
      sortOrder === 'asc'
        ? new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        : new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
    )
    return result
  }, [tasks, searchQuery, selectedFilters, sortOrder])

  useEffect(() => {
    saveToLocalStorage('selectedFilter', selectedFilters)
    saveToLocalStorage('sortOrder', sortOrder)
  }, [selectedFilters, sortOrder])

  return { filteredTasks, selectedFilters, sortOrder, setSelectedFilters, setSortOrder }
}
