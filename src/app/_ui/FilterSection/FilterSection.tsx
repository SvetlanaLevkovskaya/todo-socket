import { ChangeEvent } from 'react'

import { FILTERS } from '@/app/_ui/constants/filters'

export const FilterSection = ({
  selectedFilters,
  onFilterChange,
}: {
  selectedFilters: string
  onFilterChange: (filter: string) => void
}) => {
  const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    onFilterChange(value)
  }

  return (
    <aside className="w-full px-4">
      <h2 className="text-base font-medium mb-8">Filters</h2>
      {FILTERS.map((category) => {
        return (
          <div key={category} className="flex items-center mb-2 text-sm">
            <input
              type="radio"
              value={category}
              id={category}
              onChange={handleFilterChange}
              checked={selectedFilters === category}
              className="mr-2 h-3 w-3 accent-orange-300 focus:ring-2 focus:ring-offset-2 transition-all focus:ring-orange-300 hover:scale-110"
            />
            <label htmlFor={category} className="text-sm">
              {category}
            </label>
          </div>
        )
      })}
    </aside>
  )
}
