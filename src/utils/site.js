const MAP_COORDS = '34.016944,-4.985167'

export const SITE = {
  name: 'Fes Pièces Auto',
  nameLine1: 'Fes Pièces',
  nameLine2: 'Auto',
  tagline: 'Vente & import de pièces automobiles',
  aboutShopImage: '/hero-shop.jpeg',
  aboutShopImageAlt: 'Fes Pièces Auto — garage et vente de pièces automobiles à Fès',
  address: '2 Rue Angola - Mont Fleuri - Route de SEFROU - Fès',
  addressShort: 'Mont Fleuri, Route de Sefrou - Fès',
  coordinates: {
    lat: 34.016944,
    lng: -4.985167,
    label: '34°01\'01.0"N 4°59\'06.6"W',
  },
  mapsEmbedUrl: `https://maps.google.com/maps?q=${MAP_COORDS}&z=17&output=embed`,
  mapsDirectionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${MAP_COORDS}`,
  mapsSearchUrl: `https://www.google.com/maps/search/?api=1&query=${MAP_COORDS}`,
  phoneMobile: '07 64 95 85 02',
  phoneMobileIntl: '+212 7 64 95 85 02',
  phoneMobileWa: '212764958502',
  phoneLandline: '05 35 73 38 73',
  phoneLandlineIntl: '+212 5 35 73 38 73',
  phoneLandlineTel: '212535733873',
  openingHours: {
    days: 'Lundi — Samedi',
    time: '09:00 — 20:00',
  },
  socialLinks: [
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      href: 'https://wa.me/212764958502',
    },
    {
      id: 'facebook',
      label: 'Facebook',
      href: 'https://www.facebook.com/share/1B11PrpyGY/?mibextid=wwXIfr',
    },
    {
      id: 'instagram',
      label: 'Instagram',
      href: 'https://www.instagram.com/fespiecesauto?igsh=cDF5Yzc2eW90NTVm&utm_source=qr',
    },
  ],
  specialties: ['Batteries VARTA', 'Bougies NGK'],
  deliveryTitle: 'Livraison à Fès et dans la région',
  deliveryDescription:
    'Commandez vos pièces auto et recevez-les où vous êtes, ou passez les récupérer directement au magasin à Mont Fleuri.',
  deliveryOptions: [
    {
      title: 'Livraison à domicile',
      description: 'Nous livrons vos pièces à Fès, Sefrou, Meknès et dans la région Fès-Meknès.',
    },
    {
      title: 'Retrait en magasin',
      description: 'Récupérez votre commande sur place — 2 Rue Angola, Mont Fleuri, Route de Sefrou.',
    },
  ],
  deliverySteps: [
    {
      title: 'Contactez-nous',
      description: 'Par WhatsApp ou téléphone, indiquez la pièce dont vous avez besoin.',
    },
    {
      title: 'Confirmation & devis',
      description: 'Nous vérifions la disponibilité et vous confirmons le prix et le délai.',
    },
    {
      title: 'Livraison ou retrait',
      description: 'Recevez chez vous ou venez chercher votre commande au magasin.',
    },
  ],
  deliveryAreas: [
    { name: 'Fès', detail: 'Ville & agglomération' },
    { name: 'Sefrou', detail: 'Livraison disponible' },
    { name: 'Meknès', detail: 'Livraison disponible' },
    { name: 'Région Fès-Meknès', detail: 'Sur demande' },
  ],
  highlights: [
    {
      title: 'Pièces de qualité',
      description: 'Marques reconnues et références fiables pour l\'entretien de votre véhicule.',
    },
    {
      title: 'Import & disponibilité',
      description: 'Vente et import de pièces — nous trouvons la référence qu\'il vous faut.',
    },
    {
      title: 'Conseil personnalisé',
      description: 'Une équipe à votre écoute pour vous orienter vers la bonne pièce.',
    },
    {
      title: 'Livraison locale',
      description: 'Service de livraison à Fès et dans la région, ou retrait au magasin.',
    },
  ],
  seo: {
    defaultTitle: 'Fes Pièces Auto — Vente & Import de Pièces Automobiles à Fès',
    defaultDescription:
      'Fes Pièces Auto : vente et import de pièces automobiles à Fès, Maroc. Freinage, filtres, huiles, batteries, bougies NGK. Livraison Fès, Sefrou, Meknès. WhatsApp 07 64 95 85 02.',
    keywords:
      'pièces auto Fès, pièces automobile Maroc, Fes Pièces Auto, freinage, filtres, huiles moteur, batterie VARTA, bougies NGK, pièces auto Sefrou, pièces auto Meknès, Mont Fleuri, garage Fès, import pièces auto',
    defaultImage: '/logo.png',
  },
}
