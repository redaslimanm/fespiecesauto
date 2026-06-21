import { getApiBase } from './media'

async function request(path, options = {}) {
  const response = await fetch(`${getApiBase()}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (response.status === 204) return null

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(data?.error || 'Une erreur est survenue.')
  }
  return data
}

export async function uploadImage(file) {
  const formData = new FormData()
  formData.append('image', file)

  const response = await fetch(`${getApiBase()}/api/upload.php`, {
    method: 'POST',
    body: formData,
  })
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(data?.error || "Échec de l'envoi de l'image.")
  }
  return data.url
}

function subcategoryImageEndpoint(categorySlug, subSlug) {
  const params = new URLSearchParams({
    slug: categorySlug,
    subSlug,
  })
  return `/api/subcategory-image.php?${params}`
}

export async function uploadSubcategoryImage(categorySlug, subSlug, file) {
  const formData = new FormData()
  formData.append('image', file)

  const response = await fetch(`${getApiBase()}${subcategoryImageEndpoint(categorySlug, subSlug)}`, {
    method: 'PUT',
    body: formData,
  })
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(data?.error || "Échec de l'envoi de l'image.")
  }
  return data.url
}

export async function deleteSubcategoryImage(categorySlug, subSlug) {
  const response = await fetch(`${getApiBase()}${subcategoryImageEndpoint(categorySlug, subSlug)}`, {
    method: 'DELETE',
  })
  if (!response.ok && response.status !== 204) {
    const data = await response.json().catch(() => null)
    throw new Error(data?.error || "Échec de la suppression de l'image.")
  }
}

export async function loginUser(credentials) {
  const data = await request('/api/auth/login.php', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
  return data.user
}

export async function registerUser(payload) {
  const data = await request('/api/auth/register.php', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return data.user
}

export function fetchCategories() {
  return request('/api/categories.php')
}

export function fetchCategory(slug) {
  return request(`/api/category.php?slug=${encodeURIComponent(slug)}`)
}

export function createCategory(payload) {
  return request('/api/categories.php', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateCategory(slug, payload) {
  return request(`/api/category.php?slug=${encodeURIComponent(slug)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deleteCategory(slug) {
  return request(`/api/category.php?slug=${encodeURIComponent(slug)}`, { method: 'DELETE' })
}

export function createSubcategory(categorySlug, payload) {
  return request(`/api/subcategories.php?slug=${encodeURIComponent(categorySlug)}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateSubcategory(categorySlug, subSlug, payload) {
  return request(
    `/api/subcategory.php?slug=${encodeURIComponent(categorySlug)}&subSlug=${encodeURIComponent(subSlug)}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    }
  )
}

export function deleteSubcategory(categorySlug, subSlug) {
  return request(
    `/api/subcategory.php?slug=${encodeURIComponent(categorySlug)}&subSlug=${encodeURIComponent(subSlug)}`,
    { method: 'DELETE' }
  )
}

export function fetchProducts() {
  return request('/api/products.php')
}

export function fetchProduct(slug) {
  return request(`/api/product.php?slug=${encodeURIComponent(slug)}`)
}

export function createProduct(payload) {
  return request('/api/products.php', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateProduct(slug, payload) {
  return request(`/api/product.php?slug=${encodeURIComponent(slug)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deleteProduct(slug) {
  return request(`/api/product.php?slug=${encodeURIComponent(slug)}`, { method: 'DELETE' })
}
