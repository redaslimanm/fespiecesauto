import WhatsAppIcon from './WhatsAppIcon'
import { buildGeneralWhatsAppUrl } from '../utils/whatsapp'

export default function WhatsAppButton() {
  return (
    <a
      href={buildGeneralWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactez-nous sur WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_20px_rgba(37,211,102,0.4)] transition-all hover:scale-105 hover:shadow-[0_6px_28px_rgba(37,211,102,0.5)] sm:bottom-8 sm:right-8"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  )
}