'use client'

import { ChangeEvent, memo } from 'react'

import { setSortOrder, useAppDispatch, useAppSelector } from '@/store'
import { isSortOrder } from '@/utils'

const SortSelectComponent = () => {
  const dispatch = useAppDispatch()
  const sortOrder = useAppSelector((state) => state.products.sortOrder)

  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newSortOrder = event.target.value
    if (isSortOrder(newSortOrder)) {
      dispatch(setSortOrder(newSortOrder))
    }
  }

  return (
    <select
      value={sortOrder}
      onChange={handleSortChange}
      className="py-2 px-4 pl-0 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white text-sm"
    >
      <option value="asc" className="text-sm bg-amber-100">
        Price Up
      </option>
      <option value="desc" className="text-sm bg-amber-100">
        Price Down
      </option>
    </select>
  )
}

SortSelectComponent.displayName = 'SortSelect'

export const SortSelect = memo(SortSelectComponent)
