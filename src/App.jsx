import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import CategoriesPage from './pages/CategoriesPage'
import SubcategoryPage, { CategoryDetailPage } from './pages/SubcategoryPage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import SearchResultsPage from './pages/SearchResultsPage'
import SubcategoriesPage from './pages/SubcategoriesPage'
import AboutPage from './pages/AboutPage'
import NotFoundPage from './pages/NotFoundPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import FavoritesPage from './pages/FavoritesPage'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminCategories from './pages/admin/AdminCategories'
import AdminSubcategories from './pages/admin/AdminSubcategories'
import AdminProducts from './pages/admin/AdminProducts'
import RequireAdmin from './components/RequireAdmin'
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
              <Route path="categories/:categorySlug" element={<CategoryDetailPage />} />
              <Route path="categories/:categorySlug/:subcategorySlug" element={<SubcategoryPage />} />
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
