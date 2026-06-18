import { Loader2 } from 'lucide-react'

import Breadcrumb from '../components/Breadcrumb'

import CategoryCard from '../components/CategoryCard'

import { useCategories } from '../hooks/useCategories'



export default function CategoriesPage() {

  const { categories, loading } = useCategories()



  return (

    <>

      <div className="page-header">

        <div className="section-container">

          <Breadcrumb items={[{ label: 'Catégories' }]} />

          <h1 className="section-title">Toutes les catégories</h1>

          <p className="section-subtitle">

            Parcourez notre catalogue organisé par familles de pièces automobiles.

          </p>

        </div>

      </div>



      <div className="section-container py-16">

        {loading ? (

          <div className="flex items-center justify-center gap-2 py-20 text-text-muted">

            <Loader2 className="h-5 w-5 animate-spin" />

            Chargement…

          </div>

        ) : (

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

            {categories.map((category) => (

              <CategoryCard key={category.id} category={category} variant="grid" />

            ))}

          </div>

        )}

      </div>

    </>

  )

}


