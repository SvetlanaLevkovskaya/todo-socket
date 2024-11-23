'use client'

import { ReactElement, useEffect, useState } from 'react'

import Image, { ImageProps } from 'next/image'

import notAvailable from '@/public/no-image.png'

interface Props extends Omit<ImageProps, 'src'> {
  fallback?: string
  src?: ImageProps['src']
}

export const ImageWithFallback = (props: Props): ReactElement => {
  const { fallback = notAvailable, src, alt, ...rest } = props
  const [{ url }, setImageState] = useState({
    url: src ?? fallback,
    isLoaded: false,
    hasError: false,
  })

  useEffect(() => {
    setImageState({
      url: src ?? fallback,
      isLoaded: false,
      hasError: false,
    })
  }, [src, fallback])

  const handleLoad = () => {
    setImageState((prev) => ({ ...prev, isLoaded: true }))
  }

  const handleError = () => {
    setImageState((prev) => {
      if (!prev.hasError) {
        return {
          url: notAvailable?.src,
          isLoaded: false,
          hasError: true,
        }
      }
      return prev
    })
  }

  return <Image alt={alt} onLoad={handleLoad} onError={handleError} src={url} {...rest} />
}
