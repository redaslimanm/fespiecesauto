import { Truck, Store } from 'lucide-react'
import WhatsAppIcon from './WhatsAppIcon'
import { SITE } from '../utils/site'
import { buildInquiryWhatsAppUrl } from '../utils/whatsapp'

export default function DeliverySection() {
  return (
    <section className="border-y border-border-light bg-surface py-16 sm:py-20">
      <div className="section-container">
        <div className="mb-12 text-center">
          <h2 className="section-title">{SITE.deliveryTitle}</h2>
          <p className="section-subtitle mx-auto mt-2 max-w-2xl">{SITE.deliveryDescription}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {SITE.deliveryOptions.map(({ title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-border-light bg-warm p-6 text-center sm:p-8"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-border-light bg-surface">
                {title.includes('Retrait') ? (
                  <Store className="h-6 w-6 text-text" strokeWidth={1.5} />
                ) : (
                  <Truck className="h-6 w-6 text-text" strokeWidth={1.5} />
                )}
              </div>
              <h3 className="font-display text-lg font-bold text-text">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">{description}</p>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <h3 className="mb-8 text-center font-display text-xl font-bold text-text">
            Comment commander ?
          </h3>
          <div className="grid gap-6 sm:grid-cols-3">
            {SITE.deliverySteps.map(({ title, description }, index) => (
              <div
                key={title}
                className="rounded-2xl border border-border-light bg-warm p-6 text-center"
              >
                <span className="font-display text-3xl font-bold text-text-light">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h4 className="mt-3 font-display text-base font-bold text-text">{title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-text-muted">
            Besoin d&apos;un devis livraison ? Contactez-nous avec votre adresse et la pièce recherchée.
          </p>
          <a
            href={buildInquiryWhatsAppUrl('Demande de livraison — Fès et région')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp mt-6 inline-flex"
          >
            <WhatsAppIcon />
            Demander sur WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
