import { ToastContainer } from 'react-toastify'

import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'

import './globals.css'

import { MainLayout } from '@/components'

const manrope = Manrope({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ToDo',
  description: 'ToDo App',
  twitter: {
    title: 'ToDo',
    description: 'ToDo App',
    images: 'https://og-examples.vercel.sh/api/static',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        <ToastContainer limit={5} />
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  )
}
