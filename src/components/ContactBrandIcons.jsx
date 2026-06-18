function SvgIcon({ className = 'h-10 w-10', children, viewBox = '0 0 48 48', ...props }) {
  return (
    <svg
      className={className}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

export function GoogleMapsBrandLogo({ className }) {
  return (
    <SvgIcon className={className}>
      <path
        fill="#34A853"
        d="M24 4C16.268 4 10 10.268 10 18c0 10.5 14 26 14 26s14-15.5 14-26c0-7.732-6.268-14-14-14z"
      />
      <path
        fill="#4285F4"
        d="M24 4c-4.5 0-8.5 2-11.2 5.2C16.5 7.5 20 7 24 7.5c4 .5 7.5 2 9.2 4.7C30.5 6 27.5 4 24 4z"
      />
      <path fill="#FBBC04" d="M10 18c0 2.5.6 4.8 1.7 6.8C9.5 20 10 18 10 18z" />
      <path fill="#EA4335" d="M38 18c0-2.5-.6-4.8-1.7-6.8C38.5 20 38 18 38 18z" />
      <circle cx="24" cy="18" r="5.5" fill="#FFF" />
      <circle cx="24" cy="18" r="3" fill="#4285F4" />
    </SvgIcon>
  )
}

export function MobileBrandLogo({ className }) {
  return (
    <SvgIcon className={className}>
      <rect x="4" y="4" width="40" height="40" rx="12" fill="#34C759" />
      <path
        fill="#FFF"
        d="M28.5 15.5h-9a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-13a2 2 0 0 0-2-2zm-4.5 16.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"
      />
    </SvgIcon>
  )
}

export function PhoneBrandLogo({ className }) {
  return (
    <SvgIcon className={className}>
      <rect x="4" y="4" width="40" height="40" rx="12" fill="#007AFF" />
      <path
        fill="#FFF"
        d="M33.2 29.8l-3.2-1.4c-.6-.25-1.3-.1-1.75.4l-1.1 1.35c-2.15-1.1-3.9-2.85-5-5l1.35-1.1c.5-.45.65-1.15.4-1.75l-1.4-3.2c-.3-.65-1-.95-1.65-.75l-3.05 1.15c-.65.25-1.05.9-.95 1.6.55 3.45 2.95 6.85 6.4 9.3 3.45 2.45 7.15 3.55 10.6 2.85.7-.1 1.25-.65 1.45-1.35l1.15-3.05c.2-.65-.1-1.35-.75-1.65z"
      />
    </SvgIcon>
  )
}

export function AlarmClockBrandLogo({ className }) {
  return (
    <SvgIcon className={className}>
      <rect x="4" y="4" width="40" height="40" rx="12" fill="#FF9500" />
      <path
        fill="#FFF"
        d="M16 12.5a2.5 2.5 0 0 1 0 5h-1.2a1.3 1.3 0 0 1 0-2.6H16zm17.2 0a1.3 1.3 0 0 1 0 2.6H32a2.5 2.5 0 0 1 0-5h1.2z"
      />
      <path
        fill="#FFF"
        d="M13.5 14.8 11.8 13a1.2 1.2 0 0 1 1.7-1.7l1.7 1.8a1.2 1.2 0 0 1-1.7 1.7zm20.8 0a1.2 1.2 0 0 1-1.7-1.7l1.7-1.8a1.2 1.2 0 0 1 1.7 1.7l-1.7 1.8z"
      />
      <circle cx="24" cy="27" r="11" fill="#FFF" />
      <circle cx="24" cy="27" r="9.5" fill="#FFF" stroke="#FF9500" strokeWidth="1.2" />
      <circle cx="24" cy="27" r="1.2" fill="#FF3B30" />
      <path
        stroke="#1C1C1E"
        strokeWidth="1.8"
        strokeLinecap="round"
        d="M24 27V20.5"
      />
      <path
        stroke="#FF3B30"
        strokeWidth="1.4"
        strokeLinecap="round"
        d="M24 27h5.5"
      />
      <path
        fill="#FF9500"
        d="M19.5 37.5h9a1.5 1.5 0 0 0 0-3h-9a1.5 1.5 0 0 0 0 3z"
      />
      <path fill="#FFF" d="M17 37.5h2v2.5a1 1 0 0 1-2 0v-2.5zm12 0h2v2.5a1 1 0 0 1-2 0v-2.5z" />
    </SvgIcon>
  )
}
