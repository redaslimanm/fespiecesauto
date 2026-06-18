import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'

export default function SearchBar({ large = false, placeholder = 'Rechercher une sous-catégorie...' }) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/recherche?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={`flex items-center overflow-hidden rounded-full border border-border bg-surface shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-shadow focus-within:shadow-[0_4px_20px_rgba(0,0,0,0.08)] ${
          large ? 'h-14 sm:h-[60px]' : 'h-12'
        }`}
      >
        <Search className={`ml-5 shrink-0 text-text-light ${large ? 'h-5 w-5' : 'h-4 w-4'}`} />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`w-full border-0 bg-transparent px-4 text-text outline-none placeholder:text-text-light ${
            large ? 'text-base' : 'text-sm'
          }`}
        />
        <button
          type="submit"
          className={`shrink-0 bg-dark font-semibold text-white transition-colors hover:bg-text ${
            large ? 'h-full rounded-none px-8 text-sm' : 'mr-1.5 rounded-full px-5 py-2 text-sm'
          }`}
        >
          Rechercher
        </button>
      </div>
    </form>
  )
}
