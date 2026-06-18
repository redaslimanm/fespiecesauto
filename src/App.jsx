import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './views/HomePage'
import CategoriesPage from './views/CategoriesPage'
import SubcategoryPage, { CategoryDetailPage } from './views/SubcategoryPage'
import ProductDetailsPage from './views/ProductDetailsPage'
import SearchResultsPage from './views/SearchResultsPage'
import SubcategoriesPage from './views/SubcategoriesPage'
import AboutPage from './views/AboutPage'
import NotFoundPage from './views/NotFoundPage'
import LoginPage from './views/LoginPage'
import SignupPage from './views/SignupPage'
import FavoritesPage from './views/FavoritesPage'
import AdminLayout from './views/admin/AdminLayout'
import AdminDashboard from './views/admin/AdminDashboard'
import AdminCategories from './views/admin/AdminCategories'
import AdminSubcategories from './views/admin/AdminSubcategories'
import AdminProducts from './views/admin/AdminProducts'
import RequireAdmin from './components/RequireAdmin'
import {
  LegacyCategoryRedirect,
  LegacySubcategoryRedirect,
} from './components/LegacyCategoryRedirect'
import { AuthProvider } from './context/AuthContext'
import { FavoritesProvider } from './context/FavoritesContext'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FavoritesProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="categorie/:categorySlug" element={<CategoryDetailPage />} />
              <Route path="categorie/:categorySlug/:subcategorySlug" element={<SubcategoryPage />} />
              <Route path="categories/:categorySlug" element={<LegacyCategoryRedirect />} />
              <Route
                path="categories/:categorySlug/:subcategorySlug"
                element={<LegacySubcategoryRedirect />}
              />
              <Route path="produit/:productSlug" element={<ProductDetailsPage />} />
              <Route path="sous-categories" element={<SubcategoriesPage />} />
              <Route path="recherche" element={<SearchResultsPage />} />
              <Route path="a-propos" element={<AboutPage />} />
              <Route path="favoris" element={<FavoritesPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />

            <Route
              path="admin"
              element={
                <RequireAdmin>
                  <AdminLayout />
                </RequireAdmin>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="subcategories" element={<AdminSubcategories />} />
              <Route path="products" element={<AdminProducts />} />
            </Route>
          </Routes>
        </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
