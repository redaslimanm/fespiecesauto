/** SEO-friendly public URL paths (French slugs). */

export const categoriesIndexPath = '/categories'

export function categoryPath(categorySlug) {
  return `/categorie/${categorySlug}`
}

export function subcategoryPath(categorySlug, subcategorySlug) {
  return `/categorie/${categorySlug}/${subcategorySlug}`
}

export function productPath(productSlug) {
  return `/produit/${productSlug}`
}
