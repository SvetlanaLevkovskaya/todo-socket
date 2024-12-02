'use client'

import { ChangeEvent, memo, useEffect, useRef, useState } from 'react'

import Image from 'next/image'

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
    <div className="relative w-full sm:max-w-[618px]">
      <input
        ref={inputRef}
        className="w-full sm:w-[618px] border border-slate-200 focus:border-amber-500 p-4 pl-6 rounded-lg text-sm placeholder-gray-500 outline-none"
        placeholder="Search"
        onChange={handleChangeQuery}
        value={query}
      />
      <Image
        height={0}
        width={0}
        style={{ height: '16px', width: '16px' }}
        alt="search"
        src="/loop.svg"
        priority
        unoptimized
        className="absolute right-4 top-1/2 transform -translate-y-1/2"
      />
    </div>
  )
}

SearchBarComponent.displayName = 'SearchBar'

export const SearchBar = memo(SearchBarComponent)
