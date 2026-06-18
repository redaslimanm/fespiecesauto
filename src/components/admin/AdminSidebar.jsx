import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Layers, FolderTree } from 'lucide-react'
import { SITE } from '../../utils/site'

const navItems = [
  { to: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
  { to: '/admin/categories', label: 'Catégorie', icon: Layers, end: false },
  { to: '/admin/subcategories', label: 'Sous-catégorie', icon: FolderTree, end: false },
]

export default function AdminSidebar() {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-[#11161d] text-slate-300">
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
        <img src="/logo.png" alt="" className="h-10 w-auto shrink-0 object-contain" />
        <div className="min-w-0">
          <span className="block font-display text-base font-bold leading-tight text-white">
            {SITE.nameLine1}
          </span>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e85d04]">
            {SITE.nameLine2}
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Menu
        </p>
        <ul className="space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#e85d04] text-white shadow-[0_4px_14px_rgba(232,93,4,0.35)]'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-white/10 px-6 py-4 text-xs text-slate-500">
        {SITE.name}
      </div>
    </aside>
  )
}
