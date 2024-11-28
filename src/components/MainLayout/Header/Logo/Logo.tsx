import { memo } from 'react'

import Image from 'next/image'
import Link from 'next/link'

const LogoComponent = () => {
  console.log('LogoComponent')
  return (
    <Link href={'/'}>
      <Image
        src={'/logo.gif'}
        alt={'logo'}
        width={34}
        height={34}
        className="hidden md:block w-[64px] h-[64px]"
        priority
        unoptimized
      />
    </Link>
  )
}

LogoComponent.displayName = 'Logo'

export const Logo = memo(LogoComponent)
