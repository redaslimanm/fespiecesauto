import { useEffect, useState } from 'react'

import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'

import CategoryIcon from '../../components/CategoryIcon'

import AdminModal from '../../components/admin/AdminModal'

import ImageField from '../../components/admin/ImageField'

import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../../utils/api'



export default function AdminCategories() {

  const [categories, setCategories] = useState([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState('')

  const [modalMode, setModalMode] = useState(null)

  const [editingCategory, setEditingCategory] = useState(null)



  const load = async () => {

    setLoading(true)

    setError('')

    try {

      setCategories(await fetchCategories())

    } catch (err) {

      setError(err.message)

    } finally {

      setLoading(false)

    }

  }



  useEffect(() => {

    load()

  }, [])



  const openCreate = () => {

    setEditingCategory(null)

    setModalMode('create')

  }



  const openEdit = (category) => {

    setEditingCategory(category)

    setModalMode('edit')

  }



  const closeModal = () => {

    setModalMode(null)

    setEditingCategory(null)

  }



  const handleDelete = async (slug) => {

    if (!window.confirm('Supprimer cette catégorie ?')) return

    try {

      await deleteCategory(slug)

      await load()

    } catch (err) {

      setError(err.message)

    }

  }



  return (

    <div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <h2 className="font-display text-2xl font-bold text-text">Catégorie</h2>

          <p className="mt-1 text-sm text-text-muted">Gestion des catégories.</p>

        </div>

        <div className="flex items-center gap-4">

          <span className="text-sm text-text-muted">

            {categories.length} catégorie{categories.length !== 1 ? 's' : ''}

          </span>

          <button

            type="button"

            onClick={openCreate}

            className="inline-flex items-center gap-2 rounded-lg bg-[#e85d04] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#d45403]"

          >

            <Plus className="h-4 w-4" strokeWidth={2.25} />

            Ajouter une catégorie

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

                <th className="px-4 py-3 font-semibold">Catégorie</th>

                <th className="px-4 py-3 font-semibold">Sous-catégories</th>

                <th className="px-4 py-3 font-semibold">Slug</th>

                <th className="px-4 py-3 font-semibold text-right">Actions</th>

              </tr>

            </thead>

            <tbody>

              {categories.map((category) => (

                <tr key={category.id} className="border-b border-border-light last:border-0">

                  <td className="px-4 py-3">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-warm p-1.5">

                        <CategoryIcon category={category} size="sm" className="!h-full !w-full" />

                      </div>

                      <div>

                        <span className="font-medium text-text">{category.name}</span>

                        {category.description && (

                          <p className="mt-0.5 max-w-md text-xs text-text-muted">{category.description}</p>

                        )}

                      </div>

                    </div>

                  </td>

                  <td className="px-4 py-3 text-text-muted">{category.subcategories.length}</td>

                  <td className="px-4 py-3 text-text-muted">{category.slug}</td>

                  <td className="px-4 py-3 text-right">

                    <div className="inline-flex items-center gap-1">

                      <button

                        type="button"

                        onClick={() => openEdit(category)}

                        aria-label="Modifier"

                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-warm hover:text-[#e85d04]"

                      >

                        <Pencil className="h-4 w-4" />

                      </button>

                      <button

                        type="button"

                        onClick={() => handleDelete(category.slug)}

                        aria-label="Supprimer"

                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-red-50 hover:text-red-600"

                      >

                        <Trash2 className="h-4 w-4" />

                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>



      {modalMode && (

        <CategoryFormModal

          mode={modalMode}

          category={editingCategory}

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



function CategoryFormModal({ mode, category, onClose, onSaved }) {

  const isEdit = mode === 'edit'

  const [name, setName] = useState(category?.name ?? '')

  const [description, setDescription] = useState(category?.description ?? '')

  const [image, setImage] = useState(category?.image ?? '')

  const [submitting, setSubmitting] = useState(false)

  const [error, setError] = useState('')



  const handleSubmit = async (e) => {

    e.preventDefault()

    if (!name.trim()) {

      setError('Le nom est requis.')

      return

    }

    setSubmitting(true)

    setError('')

    try {

      if (isEdit) {

        await updateCategory(category.slug, { name, description, image })

      } else {

        await createCategory({ name, description, image })

      }

      onSaved()

    } catch (err) {

      setError(err.message)

      setSubmitting(false)

    }

  }



  return (

    <AdminModal title={isEdit ? 'Modifier la catégorie' : 'Ajouter une catégorie'} onClose={onClose}>

      <form onSubmit={handleSubmit} className="space-y-4">

        {isEdit && (

          <div>

            <label className="mb-1.5 block text-sm font-medium text-text">Slug</label>

            <input

              type="text"

              value={category.slug}

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

            placeholder="Ex. Freinage"

          />

        </div>

        <div>

          <label className="mb-1.5 block text-sm font-medium text-text">Description</label>

          <textarea

            value={description}

            onChange={(e) => setDescription(e.target.value)}

            rows={3}

            className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text outline-none transition-colors focus:border-[#e85d04]"

            placeholder="Description de la catégorie"

          />

        </div>

        <ImageField label="Image" value={image} onChange={setImage} />



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


