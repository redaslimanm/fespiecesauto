import { Link } from 'react-router-dom'
import WhatsAppIcon from './WhatsAppIcon'
import FavoriteButton from './FavoriteButton'
import SubcategoryMedia from './SubcategoryMedia'
import { subcategoryFavorite } from '../context/FavoritesContext'
import { buildInquiryWhatsAppUrl } from '../utils/whatsapp'

export default function SubcategoryCard({ category, sub, showFavorite = true }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl bg-surface shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,0,0,0.12)]">
      {showFavorite && (
        <FavoriteButton
          item={subcategoryFavorite(category, sub)}
          className="absolute right-4 top-4 z-10"
        />
      )}
      <Link
        to={`/categories/${category.slug}/${sub.slug}`}
        className="group/image relative block overflow-hidden"
      >
        <SubcategoryMedia sub={sub} category={category} />
      </Link>
      <div className="flex flex-col items-center gap-4 border-t border-border-light p-6 text-center">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-text-light">
          {category.name}
        </span>
        <Link
          to={`/categories/${category.slug}/${sub.slug}`}
          className="font-display text-xl font-bold text-text transition-colors hover:text-[#e85d04]"
        >
          {sub.name}
        </Link>
        {sub.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-text-muted">{sub.description}</p>
        )}
        <a
          href={buildInquiryWhatsAppUrl(`${sub.name} — ${category.name}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp w-full !py-2.5 !text-xs"
        >
          <WhatsAppIcon className="h-3.5 w-3.5" />
          Contacter sur WhatsApp
        </a>
      </div>
    </div>
  )
}
