import { SOCIAL_BRAND_LOGOS } from './SocialBrandIcons'

export function SocialLink({ id, label, href, size = 'h-11 w-11' }) {
  const Logo = SOCIAL_BRAND_LOGOS[id]
  if (!Logo) return null

  const className = [
    'block rounded-full shadow-sm transition-transform duration-200',
    href ? 'hover:scale-110 hover:shadow-md' : 'cursor-default opacity-50',
  ].join(' ')

  if (!href) {
    return (
      <span aria-label={`${label} — bientôt disponible`} className={className}>
        <Logo className={size} />
      </span>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={className}
    >
      <Logo className={size} />
    </a>
  )
}

export function SocialLinks({ links, className = 'flex flex-wrap gap-3', size }) {
  return (
    <div className={className}>
      {links.map((link) => (
        <SocialLink key={link.id} {...link} size={size} />
      ))}
    </div>
  )
}
