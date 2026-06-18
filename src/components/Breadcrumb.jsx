import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function Breadcrumb({ items = [], className = '', light = false }) {
  const linkClass = light
    ? 'text-white/75 transition-colors hover:text-white'
    : 'transition-colors hover:text-text'
  const currentClass = light ? 'text-white' : 'text-text'
  const chevronClass = light ? 'text-white/40' : 'text-text-light'
  const listClass = light ? 'text-white/75' : 'text-text-muted'

  return (
    <nav aria-label="Fil d'Ariane" className={`mb-8 ${className}`}>
      <ol className={`flex flex-wrap items-center gap-1 text-sm ${listClass}`}>
        <li>
          <Link to="/" className={linkClass}>
            Accueil
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1">
            <ChevronRight className={`h-3.5 w-3.5 ${chevronClass}`} />
            {item.to ? (
              <Link to={item.to} className={linkClass}>
                {item.label}
              </Link>
            ) : (
              <span className={currentClass}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
