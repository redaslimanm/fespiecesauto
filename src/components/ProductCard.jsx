import { Link } from 'react-router-dom'
import WhatsAppIcon from './WhatsAppIcon'
import ProductMedia from './ProductMedia'
import { buildWhatsAppUrl } from '../utils/whatsapp'

export default function ProductCard({ product }) {
  const whatsappUrl = buildWhatsAppUrl(product.name, product.reference)

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-surface shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,0,0,0.12)]"
    >
      {product.featured && (
        <span className="absolute left-4 top-4 z-10 rounded-full bg-[#e85d04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
          Vedette
        </span>
      )}
      <Link
        to={`/produit/${product.slug}`}
        className="group/image relative block overflow-hidden"
      >
        <ProductMedia product={product} />
      </Link>
      <div className="flex flex-col items-center gap-3 border-t border-border-light p-6 text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-text-light">
          Réf. {product.reference}
        </p>
        <Link
          to={`/produit/${product.slug}`}
          className="font-display text-xl font-bold text-text transition-colors hover:text-[#e85d04]"
        >
          {product.name}
        </Link>
        {product.description && (
          <p className="text-sm leading-relaxed text-text-muted line-clamp-2">
            {product.description}
          </p>
        )}
        <a
          href={whatsappUrl}
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
