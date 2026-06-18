import { ExternalLink, MapPin } from 'lucide-react'
import { SITE } from '../utils/site'

export default function LocationMap({ className = '' }) {
  return (
    <div className={className}>
      <div className="overflow-hidden rounded-2xl border border-border-light bg-surface shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
        <iframe
          title={`Localisation ${SITE.name}`}
          src={SITE.mapsEmbedUrl}
          className="h-[280px] w-full sm:h-[360px] lg:h-[420px]"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2 text-sm text-text-muted">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#e85d04]" />
          <span>
            {SITE.address}
            <span className="mt-1 block text-text-light">{SITE.coordinates.label}</span>
          </span>
        </p>
        <a
          href={SITE.mapsDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-border-light bg-surface px-5 py-2.5 text-sm font-semibold text-text transition-colors hover:border-text hover:bg-warm"
        >
          Obtenir l&apos;itinéraire
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  )
}
