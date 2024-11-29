import { ChangeEvent } from 'react'

import { SortOrderType } from '@/types'
import { isSortOrder } from '@/utils'

export const SortSelect = ({
  onSortChange,
  sortOrder,
}: {
  onSortChange: (order: SortOrderType) => void
  sortOrder: SortOrderType
}) => {
  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newSortOrder = event.target.value as SortOrderType

    if (isSortOrder(newSortOrder)) {
      onSortChange(newSortOrder)
    }
  }

  return (
    <select
      value={sortOrder}
      onChange={handleSortChange}
      className="py-2 px-4 pl-0 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white text-sm"
    >
      <option value="asc" className="text-sm bg-orange-100">
        Deadline Up
      </option>
      <option value="desc" className="text-sm bg-orange-100">
        Deadline Down
      </option>
    </select>
  )
}
