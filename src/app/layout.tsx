import { Suspense } from 'react'
import { ToastContainer } from 'react-toastify'

import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'

import './globals.css'

import { MainLayout, Spinner } from '@/components'

const manrope = Manrope({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'E-comm',
  description: 'E-commerce App',
  twitter: {
    title: 'E-comm',
    description: 'E-commerce App',
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
        <Suspense fallback={<Spinner />}>
          <ToastContainer limit={1} />
          <MainLayout>{children}</MainLayout>
        </Suspense>
      </body>
    </html>
  )
}
