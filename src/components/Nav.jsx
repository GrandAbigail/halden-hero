import { LogoMark } from './Illustrations'

const links = ['Plans', 'Reviews', 'Learn']
const item =
  'rounded-lg border border-white/[0.06] bg-white/[0.03] px-3.5 py-2 text-[13px] text-cream/60 transition-colors hover:bg-white/[0.08] hover:text-cream'

export default function Nav({ style }) {
  return (
    <header className="absolute inset-x-0 top-0 z-40 flex justify-center pt-6 md:pt-8" style={style}>
      <nav className="flex items-center gap-1.5" aria-label="Main">
        <a href="/" aria-label="Home" className="mr-2 block rounded-lg shadow-[0_0_24px_rgba(242,87,59,0.45)]">
          <LogoMark className="h-9 w-9" />
        </a>
        <button type="button" className={`${item} flex items-center gap-2`}>
          Functionality
          <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
            <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        {links.map((l) => (
          <a key={l} href={`#${l.toLowerCase()}`} className={`${item} hidden sm:block`}>
            {l}
          </a>
        ))}
      </nav>
    </header>
  )
}
