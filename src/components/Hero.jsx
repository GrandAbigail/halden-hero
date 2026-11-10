import { forwardRef, useEffect, useRef, useState } from 'react'
import CoinCanvas from './CoinCanvas'
import { Atm, Bill, MascotGun } from './Illustrations'

/**
 * 第一屏。mascotRef 指向胶囊里的小黑人，滚动时外层以它为圆心收缩画面。
 * 悬停（或点按）ATM：持续喷金币；悬停胶囊：钞票枪打出钞票。
 */
const Hero = forwardRef(function Hero({ mascotRef }, ref) {
  const coins = useRef(null)
  const wrap = useRef(null)
  const atm = useRef(null)
  const [spewing, setSpewing] = useState(false)

  useEffect(() => {
    if (!spewing) return
    const emit = () => {
      const w = wrap.current.getBoundingClientRect()
      const a = atm.current.getBoundingClientRect()
      coins.current?.emit(a.left + a.width / 2 - w.left, a.top + a.height * 0.6 - w.top)
    }
    emit()
    const id = setInterval(emit, 75)
    return () => clearInterval(id)
  }, [spewing])

  return (
    <div ref={ref} className="absolute inset-0 bg-coal">
      <div ref={wrap} className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
        <CoinCanvas ref={coins} />

        <h1 className="relative text-[clamp(2.5rem,6.3vw,6.75rem)] font-normal leading-[0.92] tracking-[-0.035em] text-cream">
          <span className="block whitespace-nowrap">
            <span className="font-script text-[1.25em] leading-none tracking-normal">T</span>eens&rsquo;{' '}
            <em className="font-serif tracking-[-0.02em]">favorite</em>
          </span>
          <span className="block whitespace-nowrap">payment card</span>
          <span className="flex items-center justify-center gap-[0.14em] whitespace-nowrap">
            <em className="font-serif tracking-[-0.02em]">and</em>

            {/* 胶囊 + 小黑人 */}
            <span className="group/pill relative mx-[0.06em] inline-block h-[0.74em] w-[1.9em] rounded-full bg-cream align-middle">
              <span ref={mascotRef} className="absolute -left-[0.02em] bottom-0 block w-[1.12em]">
                <MascotGun className="block w-full" />
              </span>
              {[0, 0.23, 0.46].map((d) => (
                <Bill
                  key={d}
                  className="absolute left-[1.05em] top-[0.2em] w-[0.42em] opacity-0 group-hover/pill:animate-bill"
                  style={{ animationDelay: `${d}s` }}
                />
              ))}
            </span>

            <span>app</span>

            {/* ATM：金币喷口 */}
            <button
              ref={atm}
              type="button"
              aria-label="Shower coins"
              onPointerEnter={() => setSpewing(true)}
              onPointerLeave={() => setSpewing(false)}
              onFocus={() => setSpewing(true)}
              onBlur={() => setSpewing(false)}
              className="relative inline-block w-[0.78em] shrink-0 cursor-pointer rounded-full transition-transform duration-200 hover:-rotate-6 hover:scale-110"
            >
              <Atm className="-mt-[0.16em] block w-full" />
            </button>
          </span>
        </h1>

        <p className="relative mt-[clamp(1rem,2.2vw,2rem)] text-[clamp(0.85rem,1.05vw,1.05rem)] font-medium text-cream/75">
          Teach them to behave like adults, in complete safety!
        </p>

        {/* Get Started：悬停时开关拨到右边 */}
        <a
          href="#get-started"
          className="group/cta relative mt-[clamp(1.5rem,3.4vw,3rem)] block rounded-2xl bg-black/60 p-1.5 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]"
        >
          <span className="flex items-center gap-10 rounded-xl bg-[#2B2B2B] py-3 pl-4 pr-3 text-[13px] text-cream/55 transition-colors group-hover/cta:text-cream">
            Get Started
            <span className="relative block h-5 w-10 rounded-full bg-black/70 transition-colors duration-300 group-hover/cta:bg-flame">
              <span className="absolute left-0.5 top-0.5 block h-4 w-4 rounded-full bg-[#555] transition-all duration-300 group-hover/cta:left-[22px] group-hover/cta:bg-white" />
            </span>
          </span>
        </a>

        <p className="relative mt-5 text-[11px] font-medium tracking-[0.22em] text-cream/45">SCROLL DOWN</p>
      </div>
    </div>
  )
})

export default Hero
