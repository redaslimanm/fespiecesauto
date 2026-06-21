import { useEffect, useState } from 'react'

import { ChevronRight, Plus, Pencil, Trash2, Loader2 } from 'lucide-react'

import CategoryIcon from '../../components/CategoryIcon'

import AdminModal from '../../components/admin/AdminModal'

import ImageField from '../../components/admin/ImageField'

import { isApiSubcategoryImage, resolveMediaUrl } from '../../utils/media'

import {

  fetchCategories,

  createSubcategory,

  updateSubcategory,

  deleteSubcategory,

  uploadSubcategoryImage,

} from '../../utils/api'



export default function AdminSubcategories() {

  const [categories, setCategories] = useState([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState('')

  const [openSlugs, setOpenSlugs] = useState([])

  const [modalMode, setModalMode] = useState(null)

  const [editingSub, setEditingSub] = useState(null)



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



  const toggle = (slug) => {

    setOpenSlugs((current) =>

      current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug]

    )

  }



  const openCreate = () => {

    setEditingSub(null)

    setModalMode('create')

  }



  const openEdit = (categorySlug, sub) => {

    setEditingSub({ categorySlug, sub })

    setModalMode('edit')

  }



  const closeModal = () => {

    setModalMode(null)

    setEditingSub(null)

  }



  const handleDelete = async (categorySlug, subSlug) => {

    if (!window.confirm('Supprimer cette sous-catégorie ?')) return

    try {

      await deleteSubcategory(categorySlug, subSlug)

      await load()

    } catch (err) {

      setError(err.message)

    }

  }



  const subcategoryCount = categories.reduce(

    (total, category) => total + category.subcategories.length,

    0

  )



  return (

    <div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <h2 className="font-display text-2xl font-bold text-text">Sous-catégorie</h2>

          <p className="mt-1 text-sm text-text-muted">Gestion des sous-catégories.</p>

        </div>

        <div className="flex items-center gap-4">

          <span className="text-sm text-text-muted">

            {subcategoryCount} sous-catégorie{subcategoryCount !== 1 ? 's' : ''}

          </span>

          <button

            type="button"

            onClick={openCreate}

            className="inline-flex items-center gap-2 rounded-lg bg-[#e85d04] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#d45403]"

          >

            <Plus className="h-4 w-4" strokeWidth={2.25} />

            Ajouter une sous-catégorie

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

                <th className="px-4 py-3 font-semibold text-right">Actions</th>

              </tr>

            </thead>

            <tbody>

              {categories.map((category) => (

                <CategoryRows

                  key={category.id}

                  category={category}

                  isOpen={openSlugs.includes(category.slug)}

                  onToggle={() => toggle(category.slug)}

                  onEditSub={openEdit}

                  onDeleteSub={handleDelete}

                />

              ))}

            </tbody>

          </table>

        )}

      </div>



      {modalMode && (

        <SubcategoryFormModal

          mode={modalMode}

          categories={categories}

          editing={editingSub}

          onClose={closeModal}

          onSaved={(categorySlug) => {

            closeModal()

            setOpenSlugs((current) =>

              current.includes(categorySlug) ? current : [...current, categorySlug]

            )

            load()

          }}

        />

      )}

    </div>

  )

}



function CategoryRows({ category, isOpen, onToggle, onEditSub, onDeleteSub }) {

  const hasSubcategories = category.subcategories.length > 0



  return (

    <>

      <tr

        className={`border-b border-border-light last:border-0 ${

          hasSubcategories ? 'cursor-pointer hover:bg-warm/60' : ''

        }`}

        onClick={hasSubcategories ? onToggle : undefined}

      >

        <td className="px-4 py-3">

          <div className="flex items-center gap-3">

            {hasSubcategories ? (

              <ChevronRight

                className={`h-4 w-4 shrink-0 text-text-light transition-transform duration-200 ${

                  isOpen ? 'rotate-90' : ''

                }`}

              />

            ) : (

              <span className="inline-block h-4 w-4 shrink-0" />

            )}

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-warm p-1.5">

              <CategoryIcon category={category} size="sm" className="!h-full !w-full" />

            </div>

            <span className="font-medium text-text">{category.name}</span>

          </div>

        </td>

        <td className="px-4 py-3 text-text-muted">{category.subcategories.length}</td>

        <td className="px-4 py-3" />

      </tr>



      {hasSubcategories &&

        isOpen &&

        category.subcategories.map((sub) => (

          <tr key={sub.id} className="border-b border-border-light bg-warm/40 last:border-0">

            <td className="px-4 py-2.5 pl-12 text-text">

              <div className="flex items-center gap-3">

                {sub.image ? (

                  <img

                    src={resolveMediaUrl(sub.image)}

                    alt=""

                    className="h-8 w-8 shrink-0 rounded-md border border-border-light object-cover"

                  />

                ) : (

                  <span className="h-8 w-8 shrink-0 rounded-md border border-dashed border-border-light bg-surface" />

                )}

                <div>

                  <p className="font-medium">{sub.name}</p>

                  {sub.description && (

                    <p className="mt-0.5 max-w-md text-xs text-text-muted">{sub.description}</p>

                  )}

                </div>

              </div>

            </td>

            <td className="px-4 py-2.5 text-text-muted">{sub.slug}</td>

            <td className="px-4 py-2.5 text-right">

              <div className="inline-flex items-center gap-1">

                <button

                  type="button"

                  onClick={(e) => {

                    e.stopPropagation()

                    onEditSub(category.slug, sub)

                  }}

                  aria-label="Modifier"

                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-surface hover:text-[#e85d04]"

                >

                  <Pencil className="h-4 w-4" />

                </button>

                <button

                  type="button"

                  onClick={(e) => {

                    e.stopPropagation()

                    onDeleteSub(category.slug, sub.slug)

                  }}

                  aria-label="Supprimer"

                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-red-50 hover:text-red-600"

                >

                  <Trash2 className="h-4 w-4" />

                </button>

              </div>

            </td>

          </tr>

        ))}

    </>

  )

}



function SubcategoryFormModal({ mode, categories, editing, onClose, onSaved }) {

  const isEdit = mode === 'edit'

  const [categorySlug, setCategorySlug] = useState(

    editing?.categorySlug ?? categories[0]?.slug ?? ''

  )

  const [name, setName] = useState(editing?.sub?.name ?? '')

  const [description, setDescription] = useState(editing?.sub?.description ?? '')

  const [image, setImage] = useState(editing?.sub?.image ?? '')

  const [imageFile, setImageFile] = useState(null)

  const [submitting, setSubmitting] = useState(false)

  const [error, setError] = useState('')



  const handleSubmit = async (e) => {

    e.preventDefault()

    if (!isEdit && !categorySlug) {

      setError('Choisissez une catégorie.')

      return

    }

    if (!name.trim()) {

      setError('Le nom est requis.')

      return

    }

    setSubmitting(true)

    setError('')

    try {

      const externalImage =
        image && !image.startsWith('blob:') && !isApiSubcategoryImage(image)
          ? image.trim()
          : ''

      if (isEdit) {

        const payload = { name, description }

        if (imageFile) {

          await updateSubcategory(editing.categorySlug, editing.sub.slug, payload)

          await uploadSubcategoryImage(editing.categorySlug, editing.sub.slug, imageFile)

        } else if (!image) {

          await updateSubcategory(editing.categorySlug, editing.sub.slug, { ...payload, image: '' })

        } else if (externalImage) {

          await updateSubcategory(editing.categorySlug, editing.sub.slug, { ...payload, image: externalImage })

        } else {

          await updateSubcategory(editing.categorySlug, editing.sub.slug, payload)

        }

        onSaved(editing.categorySlug)

      } else {

        const created = await createSubcategory(categorySlug, {
          name,
          description,
          image: externalImage,
        })

        if (imageFile) {

          await uploadSubcategoryImage(categorySlug, created.slug, imageFile)

        }

        onSaved(categorySlug)

      }

    } catch (err) {

      setError(err.message)

      setSubmitting(false)

    }

  }



  return (

    <AdminModal

      title={isEdit ? 'Modifier la sous-catégorie' : 'Ajouter une sous-catégorie'}

      onClose={onClose}

    >

      <form onSubmit={handleSubmit} className="space-y-4">

        {isEdit ? (

          <div>

            <label className="mb-1.5 block text-sm font-medium text-text">Catégorie</label>

            <input

              type="text"

              value={categories.find((c) => c.slug === editing.categorySlug)?.name ?? editing.categorySlug}

              readOnly

              className="w-full rounded-lg border border-border bg-warm px-3 py-2.5 text-sm text-text-muted outline-none"

            />

          </div>

        ) : (

          <div>

            <label className="mb-1.5 block text-sm font-medium text-text">Catégorie *</label>

            <select

              value={categorySlug}

              onChange={(e) => setCategorySlug(e.target.value)}

              className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text outline-none transition-colors focus:border-[#e85d04]"

            >

              {categories.map((category) => (

                <option key={category.id} value={category.slug}>

                  {category.name}

                </option>

              ))}

            </select>

          </div>

        )}

        {isEdit && (

          <div>

            <label className="mb-1.5 block text-sm font-medium text-text">Slug</label>

            <input

              type="text"

              value={editing.sub.slug}

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

            placeholder="Ex. Plaquettes de frein"

          />

        </div>

        <div>

          <label className="mb-1.5 block text-sm font-medium text-text">Description</label>

          <textarea

            value={description}

            onChange={(e) => setDescription(e.target.value)}

            rows={3}

            className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text outline-none transition-colors focus:border-[#e85d04]"

            placeholder="Description courte de la sous-catégorie (facultatif)"

          />

        </div>

        <ImageField
          label="Image"
          value={image}
          onChange={setImage}
          onFileSelect={setImageFile}
        />



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


