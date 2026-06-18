import categories from '../data/categories.json'
import products from '../data/products.json'

export function getCategories() {
  return categories
}

export function getCategoryBySlug(slug) {
  return categories.find((c) => c.slug === slug)
}

export function getSubcategory(categorySlug, subcategorySlug) {
  const category = getCategoryBySlug(categorySlug)
  if (!category) return null
  const subcategory = category.subcategories.find((s) => s.slug === subcategorySlug)
  if (!subcategory) return null
  return { category, subcategory }
}

export function getAllSubcategories(categoryList) {
  return categoryList.flatMap((category) =>
    (category.subcategories ?? []).map((sub) => ({
      ...sub,
      categorySlug: category.slug,
      categoryName: category.name,
      category,
    }))
  )
}

export function searchSubcategories(query, categoryList) {
  const q = query.trim().toLowerCase()
  if (!q) return []

  return getAllSubcategories(categoryList).filter(
    (sub) =>
      sub.name.toLowerCase().includes(q) ||
      sub.description?.toLowerCase().includes(q) ||
      sub.categoryName.toLowerCase().includes(q) ||
      sub.slug.toLowerCase().includes(q) ||
      sub.categorySlug.toLowerCase().includes(q)
  )
}

export function getProductsBySubcategory(categorySlug, subcategorySlug, productList = products) {
  return productList.filter(
    (p) => p.categorySlug === categorySlug && p.subcategorySlug === subcategorySlug
  )
}

export function getProductBySlug(slug) {
  return products.find((p) => p.slug === slug)
}

export function getFeaturedProducts(productList = products) {
  return productList.filter((p) => p.featured)
}

export function searchProducts(query, productList = products) {
  const q = query.trim().toLowerCase()
  if (!q) return []

  return productList.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.reference.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.categorySlug.toLowerCase().includes(q) ||
      p.subcategorySlug.toLowerCase().includes(q)
  )
}

export function getProductCountByCategory(categorySlug, productList = products) {
  return productList.filter((p) => p.categorySlug === categorySlug).length
}

export function getTotalProductCount(productList = products) {
  return productList.length
}
