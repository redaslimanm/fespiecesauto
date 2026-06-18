import { Link } from 'react-router-dom'
import { categoryPath } from '../utils/routes'
import CategoryIcon from './CategoryIcon'
import FavoriteButton from './FavoriteButton'
import { categoryFavorite } from '../context/FavoritesContext'

export default function CategoryCard({ category, variant = 'grid' }) {
  if (variant === 'counter') {
    return (
      <Link
        to={categoryPath(category.slug)}
        className="group flex flex-col items-center rounded-2xl bg-surface p-8 text-center shadow-[0_2px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)]"
      >
        <span className="font-display text-5xl font-bold text-text transition-colors group-hover:text-dark sm:text-6xl">
          {category.subcategories.length}
        </span>
        <h3 className="mt-3 text-base font-semibold text-text">{category.name}</h3>
      </Link>
    )
  }

  return (
    <Link
      to={categoryPath(category.slug)}
      className="card-light group relative"
    >
      <FavoriteButton item={categoryFavorite(category)} className="absolute right-4 top-4 z-10" />
      <div className="relative flex h-56 items-center justify-center bg-warm p-8">
        <CategoryIcon category={category} size="xl" />
      </div>      <div className="p-6">
        <h3 className="font-display text-xl font-bold text-text">{category.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-text-muted">
          {category.description}
        </p>
        <p className="mt-4 text-xs font-medium uppercase tracking-wider text-text-light">
          {category.subcategories.length} sous-catégories
        </p>
      </div>
    </Link>
  )
}
