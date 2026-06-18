import { Link } from 'react-router-dom'

import { Shield, Truck, Headphones, ArrowRight } from 'lucide-react'

import HeroSlideshow from '../components/HeroSlideshow'

import SearchBar from '../components/SearchBar'

import CategoryIcon from '../components/CategoryIcon'

import CategoryGrid from '../components/CategoryGrid'

import DeliverySection from '../components/DeliverySection'
import WhyChooseUsSection from '../components/WhyChooseUsSection'
import SubcategoryCard from '../components/SubcategoryCard'

import WhatsAppIcon from '../components/WhatsAppIcon'

import { buildGeneralWhatsAppUrl } from '../utils/whatsapp'

import { SITE } from '../utils/site'

import { getAllSubcategories } from '../utils/data'

import { useInView } from '../hooks/useInView'

import { useCategories } from '../hooks/useCategories'
import { categoryPath } from '../utils/routes'



const PREVIEW_COUNT = 8

const HERO_FEATURED_SLUGS = [
  'filtres',
  'huiles-fluides',
  'demarrage-charge',
  'outillages',
  'freinage',
  'nettoyage-entretien',
]

const HERO_FEATURED_LABELS = {
  'huiles-fluides': 'Huiles',
  'demarrage-charge': 'Alternateur, démarrage et charge',
  'nettoyage-entretien': 'Nettoyage',
}



export default function HomePage() {

  const { categories, loading } = useCategories()

  const allSubcategories = getAllSubcategories(categories)

  const previewSubcategories = allSubcategories.slice(0, PREVIEW_COUNT)

  const heroCategories = HERO_FEATURED_SLUGS.map((slug) => categories.find((cat) => cat.slug === slug)).filter(
    Boolean
  )

  const [catalogueRef, catalogueVisible] = useInView({

    threshold: 0.3,

    rootMargin: '0px 0px -100px 0px',

  })



  const heroContent = (

    <div className="max-w-xl">

      <span className="hero-badge hero-rise hero-rise-1">Nouveau catalogue</span>

      <h1 className="hero-title hero-rise hero-rise-2">{SITE.name}</h1>

      <p className="hero-rise hero-rise-3 mt-5 max-w-md text-base leading-relaxed text-white/80 sm:text-lg">

        {SITE.tagline}. Contactez-nous sur WhatsApp.

      </p>

      <div className="hero-rise hero-rise-4 mt-8 flex flex-wrap gap-4">

        <Link to="/categories" className="btn-orange">

          Explorer le catalogue

        </Link>

        <a

          href={buildGeneralWhatsAppUrl()}

          target="_blank"

          rel="noopener noreferrer"

          className="btn-whatsapp-hero"

        >

          <WhatsAppIcon />

          WhatsApp

        </a>

      </div>

    </div>

  )



  return (

    <>

      <section className="relative -mt-[72px]">

        <div className="relative overflow-hidden bg-black sm:min-h-[600px] sm:bg-transparent lg:min-h-[660px]">

          <HeroSlideshow />
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/35 to-black/45 sm:hidden" />
          <div className="absolute inset-0 hidden bg-gradient-to-r from-black/70 via-black/35 to-transparent sm:block" />
          <div className="absolute inset-0 hidden bg-gradient-to-t from-black/40 via-transparent to-black/10 sm:block" />



          <div className="relative section-container flex items-start pb-10 pt-[112px] sm:min-h-[600px] sm:items-center sm:pb-20 sm:pt-[140px] lg:min-h-[660px]">

            {heroContent}

          </div>

        </div>



        <div className="relative z-10 section-container mt-4 pb-6 sm:-mt-20">

          <div className="rounded-2xl bg-white px-4 py-6 shadow-[0_12px_40px_rgba(0,0,0,0.12)] sm:px-8 sm:py-8">

            <div className="grid grid-cols-3 gap-4 sm:grid-cols-6 sm:gap-6">

              {heroCategories.map((cat) => (

                <Link

                  key={cat.id}

                  to={categoryPath(cat.slug)}

                  className="group flex flex-col items-center text-center"

                >

                  <div className="mb-3 flex h-16 w-16 items-center justify-center overflow-hidden transition-transform group-hover:scale-105 sm:h-20 sm:w-20">

                    <CategoryIcon category={cat} />

                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wide text-text sm:text-xs">

                    {HERO_FEATURED_LABELS[cat.slug] ?? cat.name}

                  </span>

                </Link>

              ))}

            </div>

          </div>

        </div>

      </section>



      <section className="bg-cream pt-10 pb-4">

        <div className="section-container">

          <SearchBar large />

        </div>

      </section>



      <section className="border-y border-border-light bg-surface py-16 sm:py-20">

        <div className="section-container grid gap-12 sm:grid-cols-3">

          {[

            { icon: Shield, title: 'Haute qualité', desc: 'Pièces de marques reconnues et certifiées pour votre véhicule.' },

            { icon: Truck, title: 'Large catalogue', desc: 'Des centaines de sous-catégories couvrant toutes les spécialités auto.' },

            { icon: Headphones, title: 'Conseil expert', desc: 'Notre équipe vous accompagne pour trouver la bonne pièce.' },

          ].map(({ icon: Icon, title, desc }) => (

            <div key={title} className="flex flex-col items-center text-center">

              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-border-light bg-warm shadow-[0_4px_16px_rgba(0,0,0,0.05)]">

                <Icon className="h-7 w-7 text-text" strokeWidth={1.5} />

              </div>

              <h3 className="mb-2.5 font-display text-xl font-bold text-text">{title}</h3>

              <p className="max-w-xs text-sm leading-relaxed text-text-muted">{desc}</p>

            </div>

          ))}

        </div>

      </section>



      <WhyChooseUsSection />



      <section className="bg-warm py-16 sm:py-20">

        <div className="section-container">

          <div className="mb-10 text-center sm:mb-12">

            <h2 className="section-title">Catégories</h2>

            <p className="section-subtitle mx-auto">

              Explorez nos familles de pièces par spécialité

            </p>

          </div>



          {loading ? (
            <p className="text-center text-text-muted">Chargement…</p>
          ) : categories.length > 0 ? (
            <CategoryGrid categories={categories} />
          ) : (
            <p className="text-center text-text-muted">Aucune catégorie disponible.</p>
          )}

        </div>

      </section>



      <DeliverySection />



      <section className="section-container py-16 sm:py-20">

        <div ref={catalogueRef} className="overflow-hidden rounded-3xl bg-[#e6edf7]">

          <div className="grid items-stretch lg:grid-cols-2">

            <div

              className={`scroll-reveal-up relative min-h-[280px] sm:min-h-[340px] lg:min-h-[420px] ${

                catalogueVisible ? 'is-visible' : ''

              }`}

            >

              <img

                src="/phase-1.jpg"

                alt={`${SITE.name} — spécialiste pièces automobiles`}

                className="absolute inset-0 h-full w-full object-cover object-center"

              />

            </div>



            <div

              className={`scroll-reveal-right flex flex-col justify-center px-8 py-12 sm:px-12 sm:py-16 lg:px-14 lg:py-20 ${

                catalogueVisible ? 'is-visible' : ''

              }`}

            >

              <span className="badge-label">Catalogue complet</span>

              <h2 className="section-title mt-4">

                Bienvenue chez {SITE.name}

              </h2>

              <p className="mt-4 text-base leading-relaxed text-text-muted">

                {SITE.tagline} — à votre service avec expertise, conseils personnalisés et un

                accueil chaleureux à {SITE.addressShort}.

              </p>

              <p className="mt-3 text-base leading-relaxed text-text-muted">

                {SITE.specialties.join(', ')} et bien plus. Parcourez notre catalogue complet

                et contactez-nous pour trouver la pièce qu&apos;il vous faut.

              </p>

              <Link to="/sous-categories" className="btn-explore mt-8 w-fit">

                Voir toutes les sous-catégories

              </Link>

            </div>

          </div>

        </div>

      </section>



      <section className="bg-surface py-20">

        <div className="section-container">

          <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">

            <div>

              <h2 className="section-title">Sous-catégories</h2>

              <p className="section-subtitle">Découvrez nos spécialités par famille de pièces</p>

            </div>

            <Link

              to="/sous-categories"

              className="flex items-center gap-2 text-sm font-semibold text-text transition-colors hover:text-text-muted"

            >

              Voir tout

              <ArrowRight className="h-4 w-4" />

            </Link>

          </div>



          {loading ? (

            <p className="text-text-muted">Chargement…</p>

          ) : previewSubcategories.length > 0 ? (

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

              {previewSubcategories.map((sub) => (

                <SubcategoryCard key={sub.id} category={sub.category} sub={sub} />

              ))}

            </div>

          ) : (

            <p className="text-text-muted">Aucune sous-catégorie disponible.</p>

          )}

        </div>

      </section>



      <section className="border-t border-border-light bg-surface py-20">

        <div className="section-container">

          <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">

            <div>

              <h2 className="section-title">Besoin d&apos;une pièce ?</h2>

              <p className="section-subtitle">

                Contactez-nous directement — réponse rapide garantie

              </p>

            </div>

            <a

              href={buildGeneralWhatsAppUrl()}

              target="_blank"

              rel="noopener noreferrer"

              className="btn-whatsapp"

            >

              <WhatsAppIcon />

              Chat on WhatsApp

            </a>

          </div>



          <div className="rounded-2xl border border-border-light bg-warm px-8 py-12 text-center">

            <p className="text-text-muted">

              Consultez nos{' '}

              <Link to="/sous-categories" className="font-semibold text-text underline-offset-2 hover:underline">

                {allSubcategories.length} sous-catégories

              </Link>{' '}

              ou parcourez les{' '}

              <Link to="/categories" className="font-semibold text-text underline-offset-2 hover:underline">

                catégories

              </Link>{' '}

              pour trouver la pièce adaptée à votre véhicule.

            </p>

          </div>

        </div>

      </section>

    </>

  )

}


