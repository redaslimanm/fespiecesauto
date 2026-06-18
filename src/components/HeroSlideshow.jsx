import { useEffect, useState } from 'react'

const SLIDES = [
  { src: '/STORE(1).png', alt: 'Magasin Fes Pièces Auto' },
  { src: '/WhatsApp Image 2026-06-04 at 17.36.29.jpeg', alt: 'Boutique pièces auto' },
  { src: '/PICTURE8.png', alt: 'Pièces automobiles' },
  { src: '/PICTURE26.png', alt: 'Pièces automobiles' },
  { src: '/PICTURE25.png', alt: 'Pièces automobiles' },
  { src: '/PICTURE16.png', alt: 'Pièces automobiles' },
  { src: '/PICTURE15.png', alt: 'Pièces automobiles' },
  { src: '/PICTURE4.png', alt: 'Pièces automobiles' },
  { src: '/PICTURE3.png', alt: 'Pièces automobiles' },
  { src: '/PICTURE2.png', alt: 'Pièces automobiles' },
]

const INTERVAL_MS = 2000

export default function HeroSlideshow() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return undefined

    const id = setInterval(() => {
      setActive((index) => (index + 1) % SLIDES.length)
    }, INTERVAL_MS)

    return () => clearInterval(id)
  }, [])

  return (
    <div className="absolute inset-0" aria-hidden="true">
      {SLIDES.map((slide, index) => (
        <img
          key={slide.src}
          src={encodeURI(slide.src)}
          alt={index === active ? slide.alt : ''}
          className={`absolute inset-0 h-full w-full scale-[1.4] object-contain object-center transition-opacity duration-700 sm:scale-100 sm:object-cover ${
            index === active ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  )
}
