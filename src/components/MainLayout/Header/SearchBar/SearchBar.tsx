'use client'

import { ChangeEvent, memo, useEffect, useRef, useState } from 'react'

import { SearchIcon } from '@/components/Icons/SearchIcon'

import { useDebounce } from '@/hooks'
import { readFromLocalStorage, saveToLocalStorage } from '@/utils'

const SearchBarComponent = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const [query, setQuery] = useState<string>(() => readFromLocalStorage('searchQuery', ''))

  const debouncedQuery = useDebounce(query)

  useEffect(() => {
    saveToLocalStorage('searchQuery', query)
  }, [query])

  useEffect(() => {
    onSearch(debouncedQuery)
  }, [debouncedQuery, onSearch])

  const handleChangeQuery = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value.trim())
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
      inputRef.current.setSelectionRange(query.length, query.length)
    }
  }, [query.length])

  return (
    <div className="relative flex w-full md:max-w-[75%] min-w-80">
      <input
        ref={inputRef}
        className="w-full border border-slate-200 focus:border-amber-500 py-4 pl-6 pr-10 rounded-lg text-sm placeholder-slate-400 outline-none"
        placeholder="Search"
        onChange={handleChangeQuery}
        value={query}
      />
      <SearchIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none w-3.5 h-3.5 sm:w-4 sm:h-4" />
    </div>
  )
}

SearchBarComponent.displayName = 'SearchBar'

export const SearchBar = memo(SearchBarComponent)
