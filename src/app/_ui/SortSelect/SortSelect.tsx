import { useState } from 'react'

import { ArrowIcon } from '@/components/Icons/ArrowIcon'

import { SortOrderType } from '@/types'

export const SortSelect = ({
  onSortChange,
  sortOrder,
}: {
  onSortChange: (order: SortOrderType) => void
  sortOrder: SortOrderType
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const options: { value: SortOrderType; label: string }[] = [
    { value: 'asc', label: 'Deadline Up' },
    { value: 'desc', label: 'Deadline Down' },
  ]

  const handleSelect = (value: SortOrderType) => {
    onSortChange(value)
    setIsOpen(false)
  }

  return (
    <div className="relative w-[150px] text-sm">
      <div
        className="py-2 px-4 flex items-center justify-between cursor-pointer bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{options.find((o) => o.value === sortOrder)?.label}</span>

        <ArrowIcon
          className={`w-4 h-4 transition-all ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          color="orange"
        />
      </div>
      {isOpen && (
        <ul className="absolute top-full left-0 w-full rounded-lg shadow-md z-10">
          {options.map((option, index) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`py-2 px-4 cursor-pointer hover:bg-orange-100 ${
                sortOrder === option.value ? 'bg-teal-50' : ''
              } ${
                index === 0 ? 'rounded-t-lg' : index === options.length - 1 ? 'rounded-b-lg' : ''
              }`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
