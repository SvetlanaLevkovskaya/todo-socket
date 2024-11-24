'use client'

import { Logo } from './Logo/Logo'
import { SearchBar } from './SearchBar/SearchBar'

export const Header = () => {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-slate-200 py-3">
      <div className="flex items-center justify-between gap-3 max-w-[900px] px-4 mx-auto">
        <Logo />
        <SearchBar />
      </div>
    </header>
  )
}
