import { Link } from 'react-router-dom'

import { MapPin, Phone } from 'lucide-react'

import { SocialLinks } from './SocialLinks'

import { SITE } from '../utils/site'



export default function Footer() {

  return (

    <footer className="footer-gradient border-t border-white/10">

      <div className="section-container py-16">

        <div className="grid gap-12 md:grid-cols-4">

          <div className="md:col-span-2">

            <Link to="/" className="group inline-flex items-center gap-3">

              <img

                src="/logo.png"

                alt=""

                className="h-12 w-auto shrink-0 object-contain transition-transform duration-200 group-hover:scale-105 sm:h-14"

              />

              <div>

                <span className="block font-display text-2xl font-bold text-white">

                  {SITE.nameLine1}

                </span>

                <span className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60">

                  {SITE.nameLine2}

                </span>

              </div>

            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">

              {SITE.tagline}. Parcourez notre catalogue et contactez-nous sur WhatsApp.

            </p>

            <p className="mt-3 text-xs text-white/50">

              {SITE.specialties.join(' · ')}

            </p>

            <SocialLinks links={SITE.socialLinks} className="mt-6 flex flex-wrap gap-3" />

          </div>



          <div>

            <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-white">Navigation</h4>

            <ul className="space-y-3 text-sm">

              <li>

                <Link to="/" className="text-white/70 transition-colors hover:text-white">Accueil</Link>

              </li>

              <li>

                <Link to="/categories" className="text-white/70 transition-colors hover:text-white">Catégories</Link>

              </li>

              <li>

                <Link to="/recherche" className="text-white/70 transition-colors hover:text-white">Recherche</Link>

              </li>

            </ul>

          </div>



          <div>

            <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-white">Contact</h4>

            <ul className="space-y-4 text-sm text-white/70">

              <li className="flex items-start gap-3">

                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/50" />

                <span>

                  {SITE.address}

                  <a

                    href={SITE.mapsDirectionsUrl}

                    target="_blank"

                    rel="noopener noreferrer"

                    className="mt-1 block text-xs text-[#e85d04] transition-colors hover:text-white"

                  >

                    Voir sur la carte →

                  </a>

                </span>

              </li>

              <li className="flex items-center gap-3">

                <Phone className="h-4 w-4 shrink-0 text-white/50" />

                <a href={`tel:+${SITE.phoneMobileWa}`} className="transition-colors hover:text-white">

                  {SITE.phoneMobileIntl}

                </a>

              </li>

              <li className="flex items-center gap-3">

                <Phone className="h-4 w-4 shrink-0 text-white/50" />

                <a href={`tel:+${SITE.phoneLandlineTel}`} className="transition-colors hover:text-white">

                  {SITE.phoneLandlineIntl}

                </a>

              </li>

            </ul>

          </div>

        </div>



        <div className="mt-14 border-t border-white/10 pt-8 text-center text-xs text-white/50">

          © {new Date().getFullYear()} {SITE.name}. Tous droits réservés.

        </div>

      </div>

    </footer>

  )

}


