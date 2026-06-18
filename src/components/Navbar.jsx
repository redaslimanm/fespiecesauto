import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Search, User, LogOut, LayoutDashboard, Heart, MapPin } from 'lucide-react'
import WhatsAppIcon from './WhatsAppIcon'
import { buildGeneralWhatsAppUrl } from '../utils/whatsapp'
import { SITE } from '../utils/site'
import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../context/FavoritesContext'

const navLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/categories', label: 'Catégories' },
  { to: '/a-propos', label: 'À propos' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, isAdmin, user, logout } = useAuth()
  const { count: favoritesCount } = useFavorites()
  const isHome = pathname === '/'
  const isHeroTheme = isHome && !scrolled

  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate('/', { replace: true })
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <>
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isHeroTheme
          ? 'navbar-hero'
          : 'border-b border-border-light bg-surface/95 shadow-sm backdrop-blur-md'
      }`}
    >
      <nav className="section-container flex items-center justify-between py-5">
        <Link to="/" className="group flex items-center gap-3">
          <img
            src="/logo.png"
            alt=""
            className="h-14 w-auto shrink-0 object-contain sm:h-16"
          />
          <div>
            <span
              className={`block font-display text-xl font-bold tracking-tight transition-colors duration-500 sm:text-2xl ${
                isHeroTheme ? 'text-white' : 'text-text'
              }`}
            >
              {SITE.nameLine1}
            </span>
            <span
              className={`block -mt-0.5 text-[10px] font-semibold uppercase tracking-[0.3em] transition-colors duration-500 ${
                isHeroTheme ? 'text-white' : 'text-text-muted'
              }`}
            >
              {SITE.nameLine2}
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-500 ${
                  isHeroTheme
                    ? isActive
                      ? 'text-[#e85d04]'
                      : 'text-white/75 hover:text-white'
                    : isActive
                      ? 'text-text'
                      : 'text-text-muted hover:text-text'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/recherche"
            className={`transition-colors duration-500 ${
              isHeroTheme ? 'text-white/75 hover:text-[#e85d04]' : 'text-text-muted hover:text-text'
            }`}
            aria-label="Rechercher"
          >
            <Search className="h-5 w-5" />
          </Link>
          <Link
            to="/favoris"
            className={`relative transition-colors duration-500 ${
              isHeroTheme ? 'text-white/75 hover:text-[#e85d04]' : 'text-text-muted hover:text-text'
            }`}
            aria-label="Favoris"
          >
            <Heart className="h-5 w-5" />
            {favoritesCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-[#e85d04] px-1 text-[10px] font-bold text-white">
                {favoritesCount}
              </span>
            )}
          </Link>
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors duration-500 ${
                    isHeroTheme ? 'text-white/75 hover:text-[#e85d04]' : 'text-text-muted hover:text-text'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Admin
                </Link>
              )}
              <span
                className={`flex items-center gap-2 text-sm font-medium transition-colors duration-500 ${
                  isHeroTheme ? 'text-white' : 'text-text'
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    isHeroTheme ? 'bg-white/15 text-white' : 'bg-warm text-text'
                  }`}
                >
                  <User className="h-4 w-4" />
                </span>
                <span className="max-w-[10rem] truncate">{user.name || user.email}</span>
              </span>
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Déconnexion"
                className={`transition-colors duration-500 ${
                  isHeroTheme ? 'text-white/75 hover:text-[#e85d04]' : 'text-text-muted hover:text-text'
                }`}
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className={`text-sm font-medium transition-colors duration-500 ${
                isHeroTheme ? 'text-white/75 hover:text-white' : 'text-text-muted hover:text-text'
              }`}
            >
              Connexion
            </Link>
          )}
          <a
            href={SITE.mapsSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={SITE.coordinates.label}
            aria-label={`Localisation — ${SITE.coordinates.label}`}
            className={`transition-colors duration-500 ${
              isHeroTheme ? 'text-white/75 hover:text-[#e85d04]' : 'text-text-muted hover:text-text'
            }`}
          >
            <MapPin className="h-5 w-5" />
          </a>
          <a
            href={buildGeneralWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp !py-2.5 !text-xs"
          >
            <WhatsAppIcon className="h-3.5 w-3.5" />
            WhatsApp
          </a>
        </div>

        <button
          type="button"
          className={`p-2 transition-colors duration-500 md:hidden ${
            isHeroTheme ? 'text-white' : 'text-text'
          }`}
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>
    </header>

      {/* Menu mobile — tiroir latéral depuis la droite */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${open ? '' : 'pointer-events-none'}`}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`absolute right-0 top-0 flex h-full w-72 max-w-[80%] flex-col bg-surface shadow-2xl transition-transform duration-300 ease-out ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between border-b border-border-light px-5 py-4">
            <span className="font-display text-base font-bold text-text">Menu</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer le menu"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-warm hover:text-text"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-1 flex-col overflow-y-auto px-5 py-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block py-3 text-sm font-medium transition-colors ${
                    isActive ? 'text-[#e85d04]' : 'text-text-muted hover:text-text'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/recherche"
              onClick={() => setOpen(false)}
              className="block py-3 text-sm font-medium text-text-muted transition-colors hover:text-text"
            >
              Rechercher
            </Link>
            <Link
              to="/favoris"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 py-3 text-sm font-medium text-text-muted transition-colors hover:text-text"
            >
              <Heart className="h-4 w-4" />
              Favoris{favoritesCount > 0 ? ` (${favoritesCount})` : ''}
            </Link>

            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 py-3 text-sm font-medium text-text-muted transition-colors hover:text-text"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Admin
                  </Link>
                )}
                <div className="flex items-center gap-2 py-3 text-sm font-medium text-text">
                  <User className="h-4 w-4" />
                  <span className="truncate">{user.name || user.email}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 py-3 text-left text-sm font-medium text-text-muted transition-colors hover:text-text"
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="block py-3 text-sm font-medium text-text-muted transition-colors hover:text-text"
              >
                Connexion
              </Link>
            )}

            <a
              href={SITE.mapsSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={SITE.coordinates.label}
              className="flex items-center gap-2 py-3 text-sm font-medium text-text-muted transition-colors hover:text-text"
            >
              <MapPin className="h-4 w-4" />
              Localisation
            </a>

            <a
              href={buildGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp mt-4 w-full"
            >
              <WhatsAppIcon />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
