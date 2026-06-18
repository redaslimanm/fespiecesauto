import { useState } from 'react'
import { resolveMediaUrl } from '../utils/media'

export default function ProductGallery({ images, alt }) {
  const [active, setActive] = useState(0)
  const resolved = images.map(resolveMediaUrl)

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl bg-warm">
        <img
          src={resolved[active]}
          alt={alt}
          className="aspect-square w-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {resolved.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                active === i
                  ? 'border-dark'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`${alt} - vue ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
