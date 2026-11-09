import { useEffect, useState } from 'react'

const links = ['Accounts', 'Cards', 'Treasury', 'Pricing']

export default function Nav() {
  // 背景转为深松绿后，Logo 切换成浅色
  const [dark, setDark] = useState(false)
  useEffect(() => {
    const onScroll = () => setDark(window.scrollY > window.innerHeight * 0.5)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="flex items-center justify-between px-6 py-5 md:px-[6vw]">
        <a
          href="/"
          className={`font-display text-2xl font-semibold tracking-tight transition-colors duration-500 ${
            dark ? 'text-mist' : 'text-pine-deep'
          }`}
        >
          Halden
        </a>
        <ul className="hidden items-center gap-1 rounded-full bg-mist/70 px-2 py-1.5 backdrop-blur-md md:flex">
          {links.map((l) => (
            <li key={l}>
              <a
                href={`#${l.toLowerCase()}`}
                className="rounded-full px-4 py-1.5 text-sm text-ink/80 transition-colors hover:bg-white/70 hover:text-ink"
              >
                {l}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#open"
          className="rounded-full bg-mist/80 px-5 py-2.5 text-sm font-semibold text-pine-deep backdrop-blur-md transition-colors hover:bg-white"
        >
          Log in
        </a>
      </nav>
    </header>
  )
}
