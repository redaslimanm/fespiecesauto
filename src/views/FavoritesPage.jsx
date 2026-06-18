import { Link } from 'react-router-dom'
import { Heart, ArrowRight, Trash2 } from 'lucide-react'
import Breadcrumb from '../components/Breadcrumb'
import { useFavorites } from '../context/FavoritesContext'
import { resolveMediaUrl } from '../utils/media'

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites()

  return (
    <>
      <div className="page-header">
        <div className="section-container">
          <Breadcrumb items={[{ label: 'Favoris' }]} />
          <h1 className="section-title">Mes favoris</h1>
          <p className="section-subtitle">
            {favorites.length} élément{favorites.length !== 1 ? 's' : ''} enregistré
            {favorites.length !== 1 ? 's' : ''}.
          </p>
        </div>
      </div>

      <div className="section-container py-16">
        {favorites.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border-light bg-surface px-6 py-20 text-center">
            <Heart className="mx-auto h-10 w-10 text-text-light" />
            <p className="mt-4 text-text-muted">
              Vous n'avez encore aucun favori. Cliquez sur le cœur d'une catégorie ou d'une
              sous-catégorie pour l'ajouter ici.
            </p>
            <Link to="/categories" className="btn-dark mt-8">
              Parcourir les catégories
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((item) => (
              <div
                key={item.key}
                className="group flex flex-col overflow-hidden rounded-2xl bg-surface shadow-[0_2px_20px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)]"
              >
                <Link
                  to={item.to}
                  className="flex h-44 items-center justify-center bg-gradient-to-br from-warm to-[#e6edf7] p-6"
                >
                  <img
                    src={resolveMediaUrl(item.image)}
                    alt={item.name}
                    className="h-full w-auto max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </Link>
                <div className="flex items-start justify-between gap-3 p-5">
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-text-light">
                      {item.type === 'category' ? 'Catégorie' : item.parentName || 'Sous-catégorie'}
                    </span>
                    <Link
                      to={item.to}
                      className="block truncate font-display text-lg font-bold text-text transition-colors hover:text-[#e85d04]"
                    >
                      {item.name}
                    </Link>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => removeFavorite(item.key)}
                      aria-label="Retirer des favoris"
                      className="flex h-9 w-9 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <Link
                      to={item.to}
                      aria-label={`Voir ${item.name}`}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-warm text-text-muted transition-colors hover:bg-dark hover:text-white"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
