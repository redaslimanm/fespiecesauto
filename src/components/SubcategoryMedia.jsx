import CategoryIcon from './CategoryIcon'
import { resolveMediaUrl } from '../utils/media'

export default function SubcategoryMedia({
  sub,
  category,
  variant = 'card',
  className = '',
}) {
  const isHero = variant === 'hero'

  return (
    <div
      className={`relative overflow-hidden bg-white ${
        isHero
          ? 'aspect-[4/3] w-full max-w-md lg:max-w-lg'
          : 'aspect-[4/3] w-full'
      } ${className}`}
    >
      {sub.image ? (
        <div className="flex h-full w-full items-center justify-center p-6 sm:p-8">
          <img
            src={resolveMediaUrl(sub.image)}
            alt={`${sub.name} — pièces auto Fès`}
            width={400}
            height={300}
            loading="lazy"
            decoding="async"
            className="max-h-full max-w-full object-contain object-center transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center p-6 sm:p-8">
          <CategoryIcon category={category} size={isHero ? '2xl' : 'xl'} />
        </div>
      )}
    </div>
  )
}
