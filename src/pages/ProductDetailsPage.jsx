import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Loader2, MessageCircle, Car } from 'lucide-react'
import Breadcrumb from '../components/Breadcrumb'
import ProductGallery from '../components/ProductGallery'
import Seo from '../components/Seo'
import { fetchCategory, fetchProduct } from '../utils/api'
import { buildWhatsAppUrl } from '../utils/whatsapp'

export default function ProductDetailsPage() {
  const { productSlug } = useParams()
  const [product, setProduct] = useState(null)
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)

    fetchProduct(productSlug)
      .then(async (data) => {
        if (!active) return
        setProduct(data)
        const categoryData = await fetchCategory(data.categorySlug)
        if (active) setCategory(categoryData)
      })
      .catch(() => {
        if (active) {
          setProduct(null)
          setCategory(null)
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [productSlug])

  if (loading) {
    return (
      <div className="section-container flex items-center justify-center gap-2 py-32 text-text-muted">
        <Loader2 className="h-5 w-5 animate-spin" />
        Chargement…
      </div>
    )
  }

  if (!product) {
    return (
      <div className="section-container py-32 text-center">
        <h1 className="section-title">Produit introuvable</h1>
        <Link to="/categories" className="btn-dark mt-8">
          Retour au catalogue
        </Link>
      </div>
    )
  }

  const subcategory = category?.subcategories.find((s) => s.slug === product.subcategorySlug)
  const whatsappUrl = buildWhatsAppUrl(product.name, product.reference)

  return (
    <>
      <Seo
        title={product.name}
        description={
          product.description ||
          `${product.name} — réf. ${product.reference}. Pièce auto à Fès chez Fes Pièces Auto.`
        }
        image={product.images?.[0]}
      />
    <div className="section-container py-10 sm:py-14">
      <Breadcrumb
        items={[
          { label: 'Catégories', to: '/categories' },
          { label: category?.name, to: `/categories/${product.categorySlug}` },
          {
            label: subcategory?.name,
            to: `/categories/${product.categorySlug}/${product.subcategorySlug}`,
          },
          { label: product.name },
        ]}
      />

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images} alt={product.name} />

        <div>
          <p className="badge-label">Réf. {product.reference}</p>
          <h1 className="section-title mt-3">{product.name}</h1>
          <p className="mt-6 leading-relaxed text-text-muted">{product.description}</p>

          <div className="mt-10 rounded-2xl border border-border-light bg-warm p-8">
            <h2 className="mb-6 flex items-center gap-2 font-semibold text-text">
              <Car className="h-5 w-5" strokeWidth={1.5} />
              Compatibilité véhicules
            </h2>
            <div className="space-y-4">
              {product.compatibility.map((item) => (
                <div
                  key={item.brand}
                  className="border-b border-border-light pb-4 last:border-0 last:pb-0"
                >
                  <span className="font-semibold text-text">{item.brand}</span>
                  <p className="mt-1 text-sm text-text-muted">{item.models.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp mt-10 w-full !py-4 !text-base sm:w-auto"
          >
            <MessageCircle className="h-5 w-5" />
            Chat on WhatsApp
          </a>
          <p className="mt-4 text-sm text-text-light">
            Un message pré-rempli avec le nom et la référence sera envoyé.
          </p>
        </div>
      </div>
    </div>
    </>
  )
}
