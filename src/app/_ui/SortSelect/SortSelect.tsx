'use client'

import { ChangeEvent, memo } from 'react'

const SortSelectComponent = ({
  onSortChange,
  sortOrder,
}: {
  onSortChange: (order: 'asc' | 'desc') => void
  sortOrder: 'asc' | 'desc'
}) => {
  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newSortOrder = event.target.value as 'asc' | 'desc'
    onSortChange(newSortOrder)
  }

  return (
    <select
      value={sortOrder}
      onChange={handleSortChange}
      className="py-2 px-4 pl-0 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white text-sm"
    >
      <option value="asc" className="text-sm bg-amber-100">
        Deadline Up
      </option>
      <option value="desc" className="text-sm bg-amber-100">
        Deadline Down
      </option>
    </select>
  )
}

SortSelectComponent.displayName = 'SortSelect'

export const SortSelect = memo(SortSelectComponent)
