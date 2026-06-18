import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Loader2, Mail, Lock } from 'lucide-react'
import Swal from 'sweetalert2'
import { loginUser } from '../utils/api'
import { SITE } from '../utils/site'
import { useAuth } from '../context/AuthContext'
import Seo from '../components/Seo'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    try {
      const user = await loginUser({ email, password })
      login(user)

      await Swal.fire({
        icon: 'success',
        title: `Bienvenue, ${user.name || 'cher client'} !`,
        text:
          user.role === 'admin'
            ? "Connexion réussie. Redirection vers l'espace administrateur."
            : 'Connexion réussie.',
        confirmButtonColor: '#e85d04',
        timer: 1800,
        timerProgressBar: true,
      })

      if (user.role === 'admin') {
        navigate('/admin', { replace: true })
      } else {
        navigate(location.state?.from || '/', { replace: true })
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Échec de la connexion',
        text: err.message,
        confirmButtonColor: '#e85d04',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Seo title="Connexion" noindex />
    <AuthShell
      title="Connexion"
      subtitle={`Accédez à votre compte ${SITE.name}.`}
      footer={
        <>
          Pas encore de compte ?{' '}
          <Link to="/signup" className="font-semibold text-[#e85d04] hover:underline">
            Créer un compte
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field
          icon={Mail}
          type="email"
          label="Email"
          value={email}
          onChange={setEmail}
          placeholder="vous@exemple.com"
          autoComplete="email"
          autoFocus
          required
        />
        <Field
          icon={Lock}
          type="password"
          label="Mot de passe"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#e85d04] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#d45403] disabled:opacity-60"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Se connecter
        </button>
      </form>
    </AuthShell>
    </>
  )
}

export function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-warm to-[#e6edf7] px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-3">
          <img src="/logo.png" alt="" className="h-14 w-auto object-contain" />
          <div>
            <span className="block font-display text-xl font-bold tracking-tight text-text">
              {SITE.nameLine1}
            </span>
            <span className="block -mt-0.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-text-muted">
              {SITE.nameLine2}
            </span>
          </div>
        </Link>

        <div className="rounded-3xl bg-surface p-8 shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
          <h1 className="font-display text-2xl font-bold text-text">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-text-muted">{subtitle}</p>}
          <div className="mt-6">{children}</div>
          {footer && <p className="mt-6 text-center text-sm text-text-muted">{footer}</p>}
        </div>
      </div>
    </div>
  )
}

export function Field({ icon: Icon, label, value, onChange, ...props }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-text">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-light" />
        )}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-lg border border-border bg-surface py-2.5 text-sm text-text outline-none transition-colors focus:border-[#e85d04] ${
            Icon ? 'pl-10 pr-3' : 'px-3'
          }`}
          {...props}
        />
      </div>
    </div>
  )
}
