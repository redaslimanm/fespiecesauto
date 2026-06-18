import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'
import AdminModal from '../../components/admin/AdminModal'
import ImageField from '../../components/admin/ImageField'
import { resolveMediaUrl } from '../../utils/media'
import {
  fetchCategories,
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../utils/api'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalMode, setModalMode] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const [productsData, categoriesData] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
      ])
      setProducts(productsData)
      setCategories(categoriesData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const getCategoryName = (slug) =>
    categories.find((c) => c.slug === slug)?.name ?? slug

  const getSubcategoryName = (categorySlug, subSlug) => {
    const category = categories.find((c) => c.slug === categorySlug)
    return category?.subcategories.find((s) => s.slug === subSlug)?.name ?? subSlug
  }

  const openCreate = () => {
    setEditingProduct(null)
    setModalMode('create')
  }

  const openEdit = (product) => {
    setEditingProduct(product)
    setModalMode('edit')
  }

  const closeModal = () => {
    setModalMode(null)
    setEditingProduct(null)
  }

  const handleDelete = async (slug) => {
    if (!window.confirm('Supprimer ce produit ?')) return
    try {
      await deleteProduct(slug)
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-text">Produits</h2>
          <p className="mt-1 text-sm text-text-muted">Gestion des produits du catalogue.</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-text-muted">
            {products.length} produit{products.length !== 1 ? 's' : ''}
          </span>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-[#e85d04] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#d45403]"
          >
            <Plus className="h-4 w-4" strokeWidth={2.25} />
            Ajouter un produit
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl border border-border-light bg-surface">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-text-muted">
            <Loader2 className="h-5 w-5 animate-spin" />
            Chargement…
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border-light bg-warm text-xs uppercase tracking-wide text-text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Produit</th>
                <th className="px-4 py-3 font-semibold">Référence</th>
                <th className="px-4 py-3 font-semibold">Catégorie</th>
                <th className="px-4 py-3 font-semibold">Slug</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-text-muted">
                    Aucun produit pour le moment.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                <tr key={product.id} className="border-b border-border-light last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border-light bg-warm">
                        {product.images?.[0] ? (
                          <img
                            src={resolveMediaUrl(product.images[0])}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-[10px] font-medium text-text-light">N/A</span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-text">{product.name}</span>
                          {product.featured && (
                            <span className="rounded-full bg-[#e85d04]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#e85d04]">
                              Vedette
                            </span>
                          )}
                        </div>
                        {product.description && (
                          <p className="mt-0.5 max-w-md text-xs text-text-muted line-clamp-2">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-muted">{product.reference || '—'}</td>
                  <td className="px-4 py-3 text-text-muted">
                    <span className="block">{getCategoryName(product.categorySlug)}</span>
                    <span className="text-xs text-text-light">
                      {getSubcategoryName(product.categorySlug, product.subcategorySlug)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-muted">{product.slug}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(product)}
                        aria-label="Modifier"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-warm hover:text-[#e85d04]"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product.slug)}
                        aria-label="Supprimer"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {modalMode && (
        <ProductFormModal
          mode={modalMode}
          product={editingProduct}
          categories={categories}
          onClose={closeModal}
          onSaved={() => {
            closeModal()
            load()
          }}
        />
      )}
    </div>
  )
}

function ProductFormModal({ mode, product, categories, onClose, onSaved }) {
  const isEdit = mode === 'edit'
  const [name, setName] = useState(product?.name ?? '')
  const [reference, setReference] = useState(product?.reference ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [categorySlug, setCategorySlug] = useState(
    product?.categorySlug ?? categories[0]?.slug ?? ''
  )
  const [subcategorySlug, setSubcategorySlug] = useState(
    product?.subcategorySlug ??
      categories.find((c) => c.slug === categorySlug)?.subcategories[0]?.slug ??
      ''
  )
  const [image, setImage] = useState(product?.images?.[0] ?? '')
  const [featured, setFeatured] = useState(product?.featured ?? false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const selectedCategory = categories.find((c) => c.slug === categorySlug)
  const subcategories = selectedCategory?.subcategories ?? []

  const handleCategoryChange = (slug) => {
    setCategorySlug(slug)
    const category = categories.find((c) => c.slug === slug)
    setSubcategorySlug(category?.subcategories[0]?.slug ?? '')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Le nom est requis.')
      return
    }
    if (!categorySlug || !subcategorySlug) {
      setError('La catégorie et la sous-catégorie sont requises.')
      return
    }

    setSubmitting(true)
    setError('')

    const payload = {
      name,
      reference,
      description,
      categorySlug,
      subcategorySlug,
      image,
      featured,
    }

    try {
      if (isEdit) {
        await updateProduct(product.slug, payload)
      } else {
        await createProduct(payload)
      }
      onSaved()
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <AdminModal title={isEdit ? 'Modifier le produit' : 'Ajouter un produit'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {isEdit && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">Slug</label>
            <input
              type="text"
              value={product.slug}
              readOnly
              className="w-full rounded-lg border border-border bg-warm px-3 py-2.5 text-sm text-text-muted outline-none"
            />
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-text">Nom *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text outline-none transition-colors focus:border-[#e85d04]"
            placeholder="Ex. Plaquettes de frein avant"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-text">Référence</label>
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text outline-none transition-colors focus:border-[#e85d04]"
            placeholder="Ex. BP-0986494-123"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-text">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text outline-none transition-colors focus:border-[#e85d04]"
            placeholder="Description du produit"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">Catégorie *</label>
            <select
              value={categorySlug}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text outline-none transition-colors focus:border-[#e85d04]"
            >
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">Sous-catégorie *</label>
            <select
              value={subcategorySlug}
              onChange={(e) => setSubcategorySlug(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text outline-none transition-colors focus:border-[#e85d04]"
            >
              {subcategories.map((sub) => (
                <option key={sub.slug} value={sub.slug}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <ImageField label="Image principale" value={image} onChange={setImage} />

        <label className="flex items-center gap-2 text-sm text-text">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="h-4 w-4 rounded border-border text-[#e85d04] focus:ring-[#e85d04]"
          />
          Produit en vedette
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text transition-colors hover:bg-warm"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-lg bg-[#e85d04] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#d45403] disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEdit ? 'Enregistrer les modifications' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </AdminModal>
  )
}
