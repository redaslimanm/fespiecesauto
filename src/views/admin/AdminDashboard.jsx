import { useEffect, useState } from 'react'
import { Layers, FolderTree, Package, Loader2 } from 'lucide-react'
import { fetchCategories, fetchProducts } from '../../utils/api'

export default function AdminDashboard() {
  const [categories, setCategories] = useState([])
  const [productCount, setProductCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    fetchCategories()
      .then((data) => {
        if (active) setCategories(data)
      })
      .catch((err) => {
        if (active) setError(err.message)
      })

    fetchProducts()
      .then((data) => {
        if (active) setProductCount(data.length)
      })
      .catch(() => {
        if (active) setProductCount(0)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const subcategoryCount = categories.reduce(
    (total, category) => total + category.subcategories.length,
    0
  )

  const stats = [
    { label: 'Catégories', value: categories.length, icon: Layers },
    { label: 'Sous-catégories', value: subcategoryCount, icon: FolderTree },
    { label: 'Produits', value: productCount, icon: Package },
  ]

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-text">Tableau de bord</h2>
      <p className="mt-1 text-sm text-text-muted">
        Vue d&apos;ensemble du catalogue.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      {loading ? (
        <div className="mt-6 flex items-center justify-center gap-2 py-16 text-text-muted">
          <Loader2 className="h-5 w-5 animate-spin" />
          Chargement…
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center gap-4 rounded-2xl border border-border-light bg-surface p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e85d04]/10 text-[#e85d04]">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-2xl font-bold text-text">{value}</p>
                <p className="text-sm text-text-muted">{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
