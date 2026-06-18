import { Heart } from 'lucide-react'
import { useFavorites } from '../context/FavoritesContext'

export default function FavoriteButton({ item, className = '' }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const active = isFavorite(item.key)

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(item)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={active ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      aria-pressed={active}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 shadow-[0_2px_8px_rgba(0,0,0,0.12)] backdrop-blur transition-colors hover:bg-surface ${className}`}
    >
      <Heart
        className={`h-5 w-5 transition-colors ${
          active ? 'fill-[#e85d04] text-[#e85d04]' : 'text-text-muted'
        }`}
      />
    </button>
  )
}
