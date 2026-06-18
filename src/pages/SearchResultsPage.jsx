import { useSearchParams, Link } from 'react-router-dom'

import { Loader2 } from 'lucide-react'

import Breadcrumb from '../components/Breadcrumb'

import SearchBar from '../components/SearchBar'

import SubcategoryCard from '../components/SubcategoryCard'

import { useCategories } from '../hooks/useCategories'

import { searchSubcategories } from '../utils/data'



export default function SearchResultsPage() {

  const [searchParams] = useSearchParams()

  const query = searchParams.get('q') || ''

  const { categories, loading } = useCategories()

  const results = searchSubcategories(query, categories)



  return (

    <>

      <div className="page-header">

        <div className="section-container">

          <Breadcrumb items={[{ label: 'Recherche' }]} />

          <h1 className="section-title">Rechercher une pièce</h1>

          <div className="mt-8 max-w-2xl">

            <SearchBar />

          </div>

        </div>

      </div>



      <div className="section-container py-16">

        {loading ? (

          <div className="flex items-center justify-center gap-2 py-20 text-text-muted">

            <Loader2 className="h-5 w-5 animate-spin" />

            Chargement…

          </div>

        ) : query ? (

          <>

            <p className="mb-10 text-text-muted">

              <span className="font-semibold text-text">{results.length}</span> sous-catégorie

              {results.length !== 1 ? 's' : ''} pour{' '}

              <strong className="text-text">« {query} »</strong>

            </p>



            {results.length > 0 ? (

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

                {results.map((sub) => (

                  <SubcategoryCard key={sub.id} category={sub.category} sub={sub} />

                ))}

              </div>

            ) : (

              <div className="rounded-2xl bg-surface py-20 text-center shadow-[0_2px_20px_rgba(0,0,0,0.05)]">

                <p className="mb-6 text-text-muted">Aucune sous-catégorie trouvée pour cette recherche.</p>

                <Link to="/sous-categories" className="btn-dark">

                  Voir toutes les sous-catégories

                </Link>

              </div>

            )}

          </>

        ) : (

          <p className="text-text-muted">Entrez un terme de recherche pour trouver une sous-catégorie.</p>

        )}

      </div>

    </>

  )

}


