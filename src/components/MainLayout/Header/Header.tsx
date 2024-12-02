'use client'

import { Logo } from './Logo/Logo'
import { SearchBar } from './SearchBar/SearchBar'
import { useSearch } from '@/providers/searchProvider'

export const Header = () => {
  const { setSearchQuery } = useSearch()

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-slate-200 py-3">
      <div className="flex items-center justify-between gap-0 md:gap-12 max-w-[900px] px-4 mx-auto">
        <Logo />
        <SearchBar onSearch={handleSearch} />
      </div>
    </header>
  )
}
