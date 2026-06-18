import { Navigate, useParams } from 'react-router-dom'
import { categoryPath, subcategoryPath } from '../utils/routes'

export function LegacyCategoryRedirect() {
  const { categorySlug } = useParams()
  return <Navigate to={categoryPath(categorySlug)} replace />
}

export function LegacySubcategoryRedirect() {
  const { categorySlug, subcategorySlug } = useParams()
  return <Navigate to={subcategoryPath(categorySlug, subcategorySlug)} replace />
}
