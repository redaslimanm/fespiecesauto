import {
  GoogleMapsBrandLogo,
  MobileBrandLogo,
  PhoneBrandLogo,
  AlarmClockBrandLogo,
} from './ContactBrandIcons'
import { WhatsAppBrandLogo } from './SocialBrandIcons'
import { SocialLink } from './SocialLinks'
import { SITE } from '../utils/site'
import { buildGeneralWhatsAppUrl } from '../utils/whatsapp'

function ContactItem({ logo: Logo, label, value, href, external }) {
  const content = (
    <>
      <Logo className="h-10 w-10 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">{label}</p>
        <p className="mt-1 text-sm font-medium leading-snug text-text">{value}</p>
      </div>
    </>
  )

  const className =
    'group flex items-center gap-4 rounded-xl border border-border-light bg-warm/60 p-4 transition-all duration-200 hover:border-[#e85d04]/30 hover:bg-warm hover:shadow-sm'

  if (!href) {
    return <div className={className}>{content}</div>
  }

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={className}
    >
      {content}
    </a>
  )
}

export default function AboutContactSection() {
  return (
    <section className="border-t border-border-light bg-warm py-16 sm:py-20">
      <div className="section-container">
        <div className="mb-10 text-center sm:mb-12">
          <h2 className="section-title">Contact</h2>
          <p className="section-subtitle mx-auto">
            Retrouvez-nous au magasin ou contactez-nous directement
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-border-light bg-surface p-6 sm:p-8">
            <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-text-muted">
              Coordonnées
            </h3>
            <div className="mt-6 space-y-3">
              <ContactItem
                logo={GoogleMapsBrandLogo}
                label="Adresse"
                value={`${SITE.address} (${SITE.coordinates.label})`}
                href={SITE.mapsDirectionsUrl}
                external
              />
              <ContactItem
                logo={MobileBrandLogo}
                label="Mobile"
                value={SITE.phoneMobileIntl}
                href={`tel:+${SITE.phoneMobileWa}`}
              />
              <ContactItem
                logo={PhoneBrandLogo}
                label="Fixe"
                value={SITE.phoneLandlineIntl}
                href={`tel:+${SITE.phoneLandlineTel}`}
              />
              <ContactItem
                logo={WhatsAppBrandLogo}
                label="WhatsApp"
                value="Envoyez-nous un message"
                href={buildGeneralWhatsAppUrl()}
                external
              />
            </div>
          </div>

          <div className="rounded-2xl border border-border-light bg-surface p-6 sm:p-8">
            <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-text-muted">
              Horaires d&apos;ouverture
            </h3>
            <div className="mt-6 flex items-start gap-4">
              <AlarmClockBrandLogo className="h-12 w-12 shrink-0" />
              <div>
                <p className="font-display text-xl font-bold text-text">{SITE.openingHours.time}</p>
                <p className="mt-1 text-sm text-text-muted">{SITE.openingHours.days}</p>
                <p className="mt-4 text-sm leading-relaxed text-text-muted">
                  Ouvert du lundi au samedi, de 9h à 20h. Retrait en magasin pendant nos horaires
                  d&apos;ouverture.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border-light bg-surface p-6 sm:p-8">
            <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-text-muted">
              Réseaux sociaux
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-text-muted">
              Suivez {SITE.name} et contactez-nous sur nos réseaux.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {SITE.socialLinks.map((link) => (
                <SocialLink key={link.id} {...link} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
