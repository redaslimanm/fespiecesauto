import { SITE } from './site'

export function buildWhatsAppUrl(productName, reference) {
  const message = [
    'Bonjour, je souhaite obtenir plus d\'informations concernant ce produit.',
    '',
    `Produit : ${productName}`,
    `Référence : ${reference}`,
  ].join('\n')

  const encoded = encodeURIComponent(message)
  return `https://wa.me/${SITE.phoneMobileWa}?text=${encoded}`
}

export function buildInquiryWhatsAppUrl(label) {
  const message = [
    'Bonjour, je souhaite obtenir plus d\'informations.',
    '',
    `Demande : ${label}`,
  ].join('\n')

  return `https://wa.me/${SITE.phoneMobileWa}?text=${encodeURIComponent(message)}`
}

export function buildGeneralWhatsAppUrl() {
  const message = encodeURIComponent(
    'Bonjour, je souhaite obtenir des informations sur vos pièces automobiles.'
  )
  return `https://wa.me/${SITE.phoneMobileWa}?text=${message}`
}
