'use client'

import { ReactNode } from 'react'

import { Footer, Header } from '@/components/MainLayout'

export const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      <main className="flex-grow flex flex-col w-full max-w-[932px] p-4 mx-auto">{children}</main>
      <Footer />
    </div>
  )
}
