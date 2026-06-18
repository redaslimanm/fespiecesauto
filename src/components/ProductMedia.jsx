import { resolveMediaUrl } from '../utils/media'

export default function ProductMedia({ product, variant = 'card', className = '' }) {
  const isHero = variant === 'hero'
  const image = resolveMediaUrl(product.images?.[0])

  return (
    <div
      className={`relative overflow-hidden bg-white ${
        isHero ? 'aspect-[4/3] w-full max-w-md lg:max-w-lg' : 'aspect-[4/3] w-full'
      } ${className}`}
    >
      {image ? (
        <div className="flex h-full w-full items-center justify-center p-6 sm:p-8">
          <img
            src={image}
            alt={product.name}
            width={400}
            height={300}
            loading="lazy"
            decoding="async"
            className="max-h-full max-w-full object-contain object-center transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center p-6 text-sm text-text-light">
          Pas d&apos;image
        </div>
      )}
    </div>
  )
}
