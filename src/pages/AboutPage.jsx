import { Link } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb'
import WhatsAppIcon from '../components/WhatsAppIcon'
import LocationMap from '../components/LocationMap'
import AboutContactSection from '../components/AboutContactSection'
import DeliveryAreasSection from '../components/DeliveryAreasSection'
import { ArrowRight } from 'lucide-react'
import { SITE } from '../utils/site'
import { buildGeneralWhatsAppUrl } from '../utils/whatsapp'
import { useInView } from '../hooks/useInView'

export default function AboutPage() {
  const [aboutRef, aboutVisible] = useInView({
    threshold: 0.2,
    rootMargin: '0px 0px -80px 0px',
  })

  return (
    <>
      <section className="relative -mt-[72px]">
        <div className="relative overflow-hidden bg-black sm:min-h-[520px] lg:min-h-[580px]">
          <img
            src={SITE.aboutShopImage}
            alt={SITE.aboutShopImageAlt}
            className="absolute inset-0 h-full w-full object-cover object-[center_30%] sm:object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/88 via-black/55 to-black/65 sm:hidden" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15" />

          <div className="relative section-container flex items-end pb-14 pt-[100px] sm:min-h-[520px] sm:items-center sm:pb-20 sm:pt-[140px] lg:min-h-[580px]">
            <div className="max-w-xl">
              <Breadcrumb items={[{ label: 'À propos' }]} light className="hero-rise hero-rise-1 !mb-4" />
              <span className="hero-badge hero-rise hero-rise-2 mt-4 inline-block">
                Notre magasin
              </span>
              <h1 className="hero-title hero-rise hero-rise-3 mt-3">À propos</h1>
              <p className="hero-rise hero-rise-4 mt-4 max-w-md text-base leading-relaxed text-white/80 sm:text-lg">
                {SITE.tagline} — garage & vente de pièces à {SITE.addressShort}.
              </p>
            </div>
          </div>
        </div>
      </section>

      <DeliveryAreasSection />

      <section ref={aboutRef} className="section-container py-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div
            className={`scroll-reveal-up ${aboutVisible ? 'is-visible' : ''}`}
          >
            <span className="badge-label">Qui sommes-nous</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-text">{SITE.name}</h2>
            <p className="mt-4 text-base leading-relaxed text-text-muted">
              Spécialiste en vente et import de pièces automobiles à Fès. Nous accompagnons
              particuliers et professionnels pour l&apos;entretien et la réparation de leurs
              véhicules, avec un catalogue organisé par catégories et sous-catégories.
            </p>
            <p className="mt-4 text-base leading-relaxed text-text-muted">
              Situés à {SITE.addressShort}, nous mettons à votre disposition des marques de
              référence et un service réactif via WhatsApp ou téléphone.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {SITE.specialties.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-border-light bg-warm px-4 py-1.5 text-xs font-semibold text-text"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div
            className={`scroll-reveal-right overflow-hidden rounded-2xl border border-border-light bg-surface shadow-[0_4px_24px_rgba(0,0,0,0.06)] ${
              aboutVisible ? 'is-visible' : ''
            }`}
          >
            <img
              src="/phase-3.jpg"
              alt={`${SITE.name} — équipe et magasin`}
              className="h-full min-h-[320px] w-full object-cover object-center transition-transform duration-700 hover:scale-[1.02] sm:min-h-[400px]"
            />
          </div>
        </div>
      </section>

      <AboutContactSection />

      <section className="border-t border-border-light bg-surface py-16 sm:py-20">
        <div className="section-container">
          <div className="mb-10 text-center sm:mb-12">
            <h2 className="section-title">Notre localisation</h2>
            <p className="section-subtitle mx-auto">
              {SITE.coordinates.label} — retrait en magasin sur place
            </p>
          </div>
          <LocationMap className="mx-auto max-w-4xl" />
        </div>
      </section>

      <section className="section-container pb-20">
        <div className="overflow-hidden rounded-3xl bg-[#141e2e] px-8 py-12 text-center sm:px-12 sm:py-16">
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Besoin d&apos;une pièce ou d&apos;une livraison ?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/70 sm:text-base">
            Parcourez notre catalogue ou écrivez-nous directement — réponse rapide garantie.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/sous-categories" className="btn-orange inline-flex items-center gap-2">
              Voir le catalogue
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={buildGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp inline-flex"
            >
              <WhatsAppIcon />
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
