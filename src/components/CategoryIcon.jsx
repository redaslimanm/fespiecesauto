import { useState } from 'react'

const sizes = {
  sm: 'h-14 w-14 sm:h-16 sm:w-16',
  lg: 'h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28',
  xl: 'h-32 w-32 sm:h-40 sm:w-40',
  '2xl': 'h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64',
}
export default function CategoryIcon({ category, size = 'sm', className = '' }) {
  const [hasError, setHasError] = useState(false)
  const src = category.iconPng || `/categories/icons/${category.slug}.png`

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-1 text-text-light ${sizes[size]} ${className}`}
      >
        <span className="text-[9px] font-bold uppercase tracking-wider">PNG</span>
        <span className="px-1 text-center text-[8px] leading-tight">{category.slug}.png</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={category.name}
      className={`object-contain ${sizes[size]} ${className}`}
      loading="lazy"
      onError={() => setHasError(true)}
    />
  )
}
