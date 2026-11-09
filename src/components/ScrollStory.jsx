import { useRef } from 'react'
import ShaderBackground from './ShaderBackground'
import BankCard from './BankCard'
import {
  useScrollProgress,
  useMediaQuery,
  segment,
  lerp,
  easeInOut,
} from '../hooks/useScrollProgress'

const facts = [
  {
    title: '4.1% on idle cash',
    body: 'Anything above your operating balance moves into treasury bills overnight and comes back by morning.',
    pos: 'md:left-[6vw] md:top-[20vh]',
  },
  {
    title: 'A card for everyone',
    body: 'Issue cards to each employee and set limits per person, per merchant, per month.',
    pos: 'md:right-[6vw] md:top-[44vh]',
  },
  {
    title: 'One ledger',
    body: 'Payroll, supplier invoices and card spend land in the same place, already categorized.',
    pos: 'md:left-[6vw] md:bottom-[16vh]',
  },
]

/**
 * 一个 320vh 的滚动区，内部是 100vh 的 sticky 舞台。
 * 进度 p（0→1）驱动全部动画：
 *   0.00–0.30  第一屏文字上移淡出
 *   0.05–0.42  卡片从右侧倾斜状态移到中心并放平，背景转深松绿
 *   0.30–0.55  三条卖点依次出现在卡片周围
 *   0.55–0.82  卖点淡出，卡片翻到背面显示收益
 *   0.80–0.95  收尾文案与按钮出现
 */
export default function ScrollStory() {
  const ref = useRef(null)
  const p = useScrollProgress(ref)
  const isMobile = useMediaQuery('(max-width: 767px)')
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')

  const heroOut = easeInOut(segment(p, 0.0, 0.3))
  const toCenter = easeInOut(segment(p, 0.05, 0.42))
  const flip = easeInOut(segment(p, 0.55, 0.82))
  const factsOut = segment(p, 0.55, 0.64)
  const finale = easeInOut(segment(p, 0.8, 0.95))

  const rotateY = lerp(-28, 0, toCenter) + 180 * flip
  const cardStyle = {
    transform: [
      isMobile
        ? `translate3d(0, ${lerp(16, -4, toCenter) - finale * 6}vh, 0)`
        : `translate3d(${lerp(22, 0, toCenter)}vw, ${-finale * 8}vh, 0)`,
      `rotateX(${lerp(20, 0, toCenter)}deg)`,
      `rotateY(${rotateY}deg)`,
      `rotateZ(${lerp(-8, 0, toCenter)}deg)`,
      `scale(${lerp(isMobile ? 0.8 : 0.82, isMobile ? 0.92 : 1, toCenter) - finale * 0.08})`,
    ].join(' '),
  }

  return (
    <section ref={ref} className="relative h-[320vh]" aria-label="Halden business account">
      <div className="sticky top-0 h-screen overflow-hidden">
        <ShaderBackground scroll={toCenter} still={reduced} />
        {/* 第二屏的深色底，保证白字对比度 */}
        <div
          className="absolute inset-0 bg-pine-deep"
          style={{ opacity: toCenter * 0.82 }}
          aria-hidden="true"
        />

        {/* 第一屏：标题 */}
        <div className="absolute inset-x-0 top-[14vh] z-10 px-6 md:top-1/2 md:-translate-y-1/2 md:px-[6vw]">
          {/* 滚动位移放在内层，避免覆盖外层的居中 translate */}
          <div
            className="max-w-[34rem]"
            style={{
              opacity: 1 - heroOut,
              transform: `translateY(${-heroOut * 60}px)`,
              pointerEvents: heroOut > 0.5 ? 'none' : 'auto',
            }}
          >
            <h1 className="font-display text-[clamp(2.6rem,min(6vw,9vh),5.6rem)] font-semibold leading-[0.95] tracking-[-0.03em] text-pine-deep">
              Business banking that earns while you work.
            </h1>
            <p className="mt-6 max-w-[30rem] text-[clamp(1rem,1.25vw,1.15rem)] leading-relaxed text-ink/75">
              Halden holds your operating cash, pays your team and suppliers, and
              moves anything idle into treasury bills overnight.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#open"
                className="rounded-full bg-pine px-6 py-3 text-sm font-semibold text-mist transition-colors hover:bg-pine-deep"
              >
                Open an account
              </a>
              <a
                href="#pricing"
                className="rounded-full border border-pine/30 px-6 py-3 text-sm font-semibold text-pine transition-colors hover:border-pine"
              >
                See pricing
              </a>
            </div>
          </div>
        </div>

        {/* 卡片 */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ perspective: '1600px' }}
        >
          <div className={`w-[78vw] max-w-[440px] md:w-[34vw] ${reduced ? '' : 'animate-float'}`}>
            <div className="preserve-3d will-change-transform" style={cardStyle}>
              <BankCard rotateY={rotateY} />
            </div>
          </div>
        </div>

        {/* 第二屏：卖点 */}
        <ul className="absolute inset-x-6 bottom-[8vh] z-10 space-y-4 md:inset-0 md:space-y-0">
          {facts.map((f, i) => {
            const inT = easeInOut(segment(p, 0.3 + i * 0.07, 0.4 + i * 0.07))
            const o = inT * (1 - factsOut)
            return (
              <li
                key={f.title}
                className={`md:absolute md:max-w-[19rem] ${f.pos}`}
                style={{
                  opacity: o,
                  transform: `translateY(${(1 - inT) * 24}px)`,
                }}
              >
                <h2 className="font-display text-lg font-semibold text-brass-light md:text-2xl">
                  {f.title}
                </h2>
                <p className="mt-1 hidden text-[0.95rem] leading-relaxed text-mist/80 md:block">
                  {f.body}
                </p>
              </li>
            )
          })}
        </ul>

        {/* 收尾 */}
        <div
          id="open"
          className="absolute inset-x-6 bottom-[10vh] z-10 text-center md:bottom-[12vh]"
          style={{
            opacity: finale,
            transform: `translateY(${(1 - finale) * 30}px)`,
            pointerEvents: finale > 0.5 ? 'auto' : 'none',
          }}
        >
          <p className="mx-auto max-w-[26rem] font-display text-[clamp(1.5rem,2.6vw,2.2rem)] font-semibold leading-tight tracking-tight text-mist">
            Open an account in about eight minutes. No minimum balance.
          </p>
          <a
            href="#open"
            tabIndex={finale > 0.5 ? 0 : -1}
            className="mt-6 inline-block rounded-full bg-brass px-7 py-3 text-sm font-semibold text-pine-deep transition-colors hover:bg-brass-light"
          >
            Open an account
          </a>
        </div>
      </div>
    </section>
  )
}
