import { Loader2 } from 'lucide-react'
import Breadcrumb from '../components/Breadcrumb'
import SubcategoryCard from '../components/SubcategoryCard'
import { useCategories } from '../hooks/useCategories'
import { getAllSubcategories } from '../utils/data'

export default function SubcategoriesPage() {
  const { categories, loading } = useCategories()
  const subcategories = getAllSubcategories(categories)

  return (
    <>
      <div className="page-header">
        <div className="section-container">
          <Breadcrumb items={[{ label: 'Sous-catégories' }]} />
          <h1 className="section-title">Toutes les sous-catégories</h1>
          <p className="section-subtitle">
            Parcourez l&apos;ensemble de nos sous-catégories de pièces automobiles.
          </p>
        </div>
      </div>

      <div className="section-container py-16">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-text-muted">
            <Loader2 className="h-5 w-5 animate-spin" />
            Chargement…
          </div>
        ) : subcategories.length > 0 ? (
          <>
            <p className="mb-10 text-text-muted">
              <span className="font-semibold text-text">{subcategories.length}</span> sous-catégorie
              {subcategories.length !== 1 ? 's' : ''} disponible
              {subcategories.length !== 1 ? 's' : ''}.
            </p>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {subcategories.map((sub) => (
                <SubcategoryCard key={sub.id} category={sub.category} sub={sub} />
              ))}
            </div>
          </>
        ) : (
          <p className="rounded-2xl border border-dashed border-border-light bg-surface px-6 py-12 text-center text-text-muted">
            Aucune sous-catégorie disponible pour le moment.
          </p>
        )}
      </div>
    </>
  )
}
