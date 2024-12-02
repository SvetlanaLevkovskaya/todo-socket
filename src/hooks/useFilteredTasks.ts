import { useEffect, useMemo, useState } from 'react'

import { useSearch } from '@/providers/searchProvider'
import { Task } from '@/types'
import { readFromLocalStorage, saveToLocalStorage } from '@/utils'

export const useFilteredTasks = (tasks: Task[]) => {
  const { searchQuery } = useSearch()
  const [selectedFilters, setSelectedFilters] = useState<string>(
    readFromLocalStorage('selectedFilter', 'all')
  )
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
    readFromLocalStorage('sortOrder', 'asc') as 'asc' | 'desc'
  )

  const filteredTasks = useMemo(() => {
    let filtered = tasks.filter((task) =>
      task.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (selectedFilters === 'done') {
      filtered = filtered.filter((task) => task.completed)
    } else if (selectedFilters === 'in progress') {
      filtered = filtered.filter((task) => !task.completed)
    }

    return filtered.sort((a, b) =>
      sortOrder === 'asc'
        ? new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        : new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
    )
  }, [tasks, searchQuery, selectedFilters, sortOrder])

  useEffect(() => {
    saveToLocalStorage('selectedFilter', selectedFilters)
    saveToLocalStorage('sortOrder', sortOrder)
  }, [selectedFilters, sortOrder])

  return {
    filteredTasks,
    searchQuery,
    selectedFilters,
    setSelectedFilters,
    sortOrder,
    setSortOrder,
  }
}
