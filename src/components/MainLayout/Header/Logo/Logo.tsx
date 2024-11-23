import { memo } from 'react'

import Link from 'next/link'

import LogoIcon from '@/components/Icons/LogoIcon'

const LogoComponent = () => {
  return (
    <Link href={'/'}>
      <LogoIcon height={55} width={116} className="hidden md:block w-auto h-auto" />
    </Link>
  )
}

LogoComponent.displayName = 'Logo'

export const Logo = memo(LogoComponent)
