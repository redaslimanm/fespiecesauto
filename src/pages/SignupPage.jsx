import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, Mail, Lock, User } from 'lucide-react'
import Swal from 'sweetalert2'
import { registerUser } from '../utils/api'
import { SITE } from '../utils/site'
import { useAuth } from '../context/AuthContext'
import { AuthShell, Field } from './LoginPage'
import Seo from '../components/Seo'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return

    if (password !== confirm) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Les mots de passe ne correspondent pas.',
        confirmButtonColor: '#e85d04',
      })
      return
    }

    setSubmitting(true)
    try {
      const user = await registerUser({ name, email, password })
      login(user)

      await Swal.fire({
        icon: 'success',
        title: 'Compte créé !',
        text: `Bienvenue, ${user.name}. Votre compte a bien été créé.`,
        confirmButtonColor: '#e85d04',
        timer: 1800,
        timerProgressBar: true,
      })

      navigate('/', { replace: true })
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: "Échec de l'inscription",
        text: err.message,
        confirmButtonColor: '#e85d04',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Seo title="Créer un compte" noindex />
    <AuthShell
      title="Créer un compte"
      subtitle={`Rejoignez ${SITE.name} en quelques secondes.`}
      footer={
        <>
          Vous avez déjà un compte ?{' '}
          <Link to="/login" className="font-semibold text-[#e85d04] hover:underline">
            Se connecter
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field
          icon={User}
          type="text"
          label="Nom complet"
          value={name}
          onChange={setName}
          placeholder="Votre nom"
          autoComplete="name"
          autoFocus
          required
        />
        <Field
          icon={Mail}
          type="email"
          label="Email"
          value={email}
          onChange={setEmail}
          placeholder="vous@exemple.com"
          autoComplete="email"
          required
        />
        <Field
          icon={Lock}
          type="password"
          label="Mot de passe"
          value={password}
          onChange={setPassword}
          placeholder="Au moins 6 caractères"
          autoComplete="new-password"
          minLength={6}
          required
        />
        <Field
          icon={Lock}
          type="password"
          label="Confirmer le mot de passe"
          value={confirm}
          onChange={setConfirm}
          placeholder="••••••••"
          autoComplete="new-password"
          minLength={6}
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#e85d04] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#d45403] disabled:opacity-60"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Créer mon compte
        </button>
      </form>
    </AuthShell>
    </>
  )
}
