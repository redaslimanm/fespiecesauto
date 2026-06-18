import { Link, Outlet } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import AdminSidebar from '../../components/admin/AdminSidebar'
import Seo from '../../components/Seo'

export default function AdminLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-warm">
      <Seo title="Administration" noindex />
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center justify-between border-b border-border-light bg-surface px-6 py-4">
          <h1 className="font-display text-lg font-bold text-text">
            Espace d&apos;administration
          </h1>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-text-muted transition-colors hover:text-text"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au site
          </Link>
        </header>

        <main className="min-w-0 flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
