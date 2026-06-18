import { ShieldCheck, Package, MessageCircle, Truck } from 'lucide-react'
import { SITE } from '../utils/site'

const highlightIcons = [ShieldCheck, Package, MessageCircle, Truck]

export default function WhyChooseUsSection() {
  return (
    <section className="bg-cream py-16 sm:py-20">
      <div className="section-container">
        <div className="mb-12 text-center">
          <h2 className="section-title">Pourquoi nous choisir</h2>
          <p className="section-subtitle mx-auto">
            Un partenaire de confiance pour vos pièces auto à Fès
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SITE.highlights.map(({ title, description }, index) => {
            const Icon = highlightIcons[index] ?? ShieldCheck
            return (
              <div
                key={title}
                className="rounded-2xl border border-border-light bg-surface p-6 shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_8px_28px_rgba(0,0,0,0.08)]"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-warm">
                  <Icon className="h-6 w-6 text-text" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-lg font-bold text-text">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
