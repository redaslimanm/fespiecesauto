import { Link } from 'react-router-dom'
import Seo from '../components/Seo'

export default function NotFoundPage() {
  return (
    <>
      <Seo title="Page introuvable" noindex />
    <div className="section-container flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-display text-8xl font-bold text-text-light">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-text">Page introuvable</h1>
      <p className="mt-3 max-w-md text-text-muted">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link to="/" className="btn-dark mt-8">
        Retour à l'accueil
      </Link>
    </div>
    </>
  )
}
