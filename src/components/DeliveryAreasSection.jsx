import { MapPin } from 'lucide-react'
import { SITE } from '../utils/site'

export default function DeliveryAreasSection() {
  return (
    <section className="border-b border-border-light bg-warm py-12 sm:py-16">
      <div className="section-container">
        <div className="mb-8 text-center sm:mb-10">
          <h2 className="section-title">Zones desservies</h2>
          <p className="section-subtitle mx-auto mt-2 max-w-2xl">
            Livraison à Fès, Sefrou, Meknès et dans la région Fès-Meknès
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SITE.deliveryAreas.map(({ name, detail }) => (
            <div
              key={name}
              className="flex items-center gap-3 rounded-2xl border border-border-light bg-surface px-5 py-4"
            >
              <MapPin className="h-5 w-5 shrink-0 text-[#e85d04]" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-semibold text-text">{name}</p>
                <p className="text-xs text-text-muted">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
