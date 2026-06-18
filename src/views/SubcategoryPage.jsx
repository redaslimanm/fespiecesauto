import { useEffect, useState } from 'react'

import { Link, useParams } from 'react-router-dom'

import { Loader2 } from 'lucide-react'

import Breadcrumb from '../components/Breadcrumb'

import CategoryIcon from '../components/CategoryIcon'

import SubcategoryCard from '../components/SubcategoryCard'

import WhatsAppIcon from '../components/WhatsAppIcon'

import SubcategoryMedia from '../components/SubcategoryMedia'

import Seo from '../components/Seo'

import { fetchCategory } from '../utils/api'

import { buildInquiryWhatsAppUrl } from '../utils/whatsapp'

import { useCategories } from '../hooks/useCategories'

import RelatedCategories from '../components/RelatedCategories'

import { getRelatedCategories, getRelatedSubcategories } from '../utils/data'

import {
  buildBreadcrumbJsonLd,
  buildCategoryJsonLd,
  buildLocalBusinessJsonLd,
  buildSubcategoryJsonLd,
  categorySeoDescription,
  mergeJsonLd,
} from '../utils/seo'

import { categoriesIndexPath, categoryPath, subcategoryPath } from '../utils/routes'



export default function SubcategoryPage() {

  const { categorySlug, subcategorySlug } = useParams()

  const [category, setCategory] = useState(null)

  const [loading, setLoading] = useState(true)



  useEffect(() => {

    let active = true

    setLoading(true)

    fetchCategory(categorySlug)

      .then((data) => {

        if (active) setCategory(data)

      })

      .catch(() => {

        if (active) setCategory(null)

      })

      .finally(() => {

        if (active) setLoading(false)

      })

    return () => {

      active = false

    }

  }, [categorySlug])



  const subcategory = category?.subcategories.find((s) => s.slug === subcategorySlug)

  const relatedSubcategories = getRelatedSubcategories(category, 4, subcategorySlug)



  if (loading) {

    return (

      <div className="section-container flex items-center justify-center gap-2 py-32 text-text-muted">

        <Loader2 className="h-5 w-5 animate-spin" />

        Chargement…

      </div>

    )

  }



  if (!category || !subcategory) {

    return (

      <div className="section-container py-32 text-center">

        <h1 className="section-title">Sous-catégorie introuvable</h1>

        <Link to={categoriesIndexPath} className="btn-dark mt-8">

          Retour aux catégories

        </Link>

      </div>

    )

  }



  return (

    <>

      <Seo
        title={subcategory.name}
        titleTemplate="category"
        description={
          subcategory.description ||
          `${subcategory.name} — ${category.name} à Fès. Disponibilité, prix et conseil chez FesPiecesAuto. Contact WhatsApp.`
        }
        image={subcategory.image || category.iconPng}
        jsonLd={mergeJsonLd([
          buildSubcategoryJsonLd({ category, subcategory }),
          buildBreadcrumbJsonLd([
            { label: 'Catégories', path: categoriesIndexPath },
            { label: category.name, path: categoryPath(category.slug) },
            { label: subcategory.name },
          ]),
          buildLocalBusinessJsonLd(),
        ])}
      />

      <div className="page-header">

        <div className="section-container">

          <Breadcrumb

            items={[

              { label: 'Catégories', to: categoriesIndexPath },

              { label: category.name, to: categoryPath(category.slug) },

              { label: subcategory.name },

            ]}

          />



          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <h1 className="section-title">{subcategory.name}</h1>

              {subcategory.description && (

                <p className="section-subtitle">{subcategory.description}</p>

              )}

              <p className="mt-2 text-sm font-medium text-text-muted">{category.name}</p>

            </div>

            {subcategory.image && (

              <div className="category-3d w-full lg:w-auto">

                <div className="category-3d-inner overflow-hidden rounded-2xl">

                  <SubcategoryMedia sub={subcategory} category={category} variant="hero" />

                </div>

              </div>

            )}

          </div>

        </div>

      </div>



      <div className="section-container py-16">

        <div className="mx-auto max-w-xl rounded-2xl bg-surface py-16 text-center shadow-[0_2px_20px_rgba(0,0,0,0.05)]">

          <p className="mb-2 font-display text-xl font-bold text-text">

            Intéressé par {subcategory.name} ?

          </p>

          <p className="mb-8 text-text-muted">

            Contactez-nous sur WhatsApp pour disponibilité, prix et conseils.

          </p>

          <a

            href={buildInquiryWhatsAppUrl(`${subcategory.name} — ${category.name}`)}

            target="_blank"

            rel="noopener noreferrer"

            className="btn-whatsapp inline-flex"

          >

            <WhatsAppIcon />

            Demander sur WhatsApp

          </a>

        </div>

      </div>

      <div className="section-container pb-16">
        <RelatedCategories
          subcategories={relatedSubcategories}
          title={`Autres sous-catégories — ${category.name}`}
        />
      </div>

    </>

  )

}



export function CategoryDetailPage() {

  const { categorySlug } = useParams()

  const { categories: allCategories } = useCategories()

  const [category, setCategory] = useState(null)

  const [loading, setLoading] = useState(true)



  useEffect(() => {

    let active = true

    setLoading(true)

    fetchCategory(categorySlug)

      .then((data) => {

        if (active) setCategory(data)

      })

      .catch(() => {

        if (active) setCategory(null)

      })

      .finally(() => {

        if (active) setLoading(false)

      })

    return () => {

      active = false

    }

  }, [categorySlug])



  if (loading) {

    return (

      <div className="section-container flex items-center justify-center gap-2 py-32 text-text-muted">

        <Loader2 className="h-5 w-5 animate-spin" />

        Chargement…

      </div>

    )

  }



  if (!category) {

    return (

      <div className="section-container py-32 text-center">

        <h1 className="section-title">Catégorie introuvable</h1>

        <Link to={categoriesIndexPath} className="btn-dark mt-8">

          Retour aux catégories

        </Link>

      </div>

    )

  }



  const relatedCategories = getRelatedCategories(allCategories, categorySlug)



  return (

    <>

      <Seo
        title={category.name}
        titleTemplate="category"
        description={categorySeoDescription(category)}
        image={category.iconPng}
        jsonLd={mergeJsonLd([
          buildCategoryJsonLd({ category }),
          buildBreadcrumbJsonLd([
            { label: 'Catégories', path: categoriesIndexPath },
            { label: category.name },
          ]),
          buildLocalBusinessJsonLd(),
        ])}
      />

      <div className="page-header">

        <div className="section-container">

          <Breadcrumb

            items={[

              { label: 'Catégories', to: categoriesIndexPath },

              { label: category.name },

            ]}

          />



          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <h1 className="section-title">{category.name}</h1>

              <p className="section-subtitle">{category.description}</p>

            </div>

            <div className="category-3d flex h-64 w-full items-center justify-center rounded-2xl bg-gradient-to-br from-warm to-[#e6edf7] p-8 lg:h-80 lg:w-[28rem]">

              <div className="category-3d-inner flex items-center justify-center">

                <CategoryIcon category={category} size="2xl" />

              </div>

            </div>

          </div>

        </div>

      </div>



      <div className="section-container py-16">

        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">

          <h2 className="font-display text-2xl font-bold text-text">Sous-catégories</h2>

          <Link

            to="/sous-categories"

            className="text-sm font-semibold text-text transition-colors hover:text-text-muted"

          >

            Voir toutes les sous-catégories

          </Link>

        </div>

        {category.subcategories.length > 0 ? (

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

            {category.subcategories.map((sub) => (

              <SubcategoryCard key={sub.id} category={category} sub={sub} />

            ))}

          </div>

        ) : (

          <p className="rounded-2xl border border-dashed border-border-light bg-surface px-6 py-12 text-center text-text-muted">

            Aucune sous-catégorie pour cette catégorie.

          </p>

        )}

      </div>

      <div className="section-container pb-16">
        <RelatedCategories
          categories={relatedCategories}
          title="Autres catégories de pièces auto"
        />
      </div>

    </>

  )

}


