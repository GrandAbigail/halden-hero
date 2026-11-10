import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Blob from './components/Blob'
import StreakBackground from './components/StreakBackground'
import { MascotMaracas } from './components/Illustrations'
import {
  useScrollProgress,
  useMediaQuery,
  segment,
  lerp,
  clamp,
  easeInOut,
} from './hooks/useScrollProgress'

/**
 * 整页是一个 420vh 的滚动区，里面一个 100vh 的 sticky 舞台。
 * 滚动进度 p（0→1）驱动：
 *   0.04–0.36  第一屏被一个圆形遮罩收缩，圆心对准胶囊里的小黑人，外面露出深蓝底
 *   0.34–0.42  圆里的画面换成橙色圆 + 摇沙锤的小黑人
 *   0.58–0.86  蓝紫光束背景淡入，导航淡出，大黑人从底部升起
 *   0.72–0.82  左下角出现 "Loading..."
 *   0.86–0.98  大黑人左眼睁开
 */
export default function App() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const mascotRef = useRef(null)
  const applied = useRef({ x: 0, y: 0 })
  const [view, setView] = useState({ w: 1440, h: 900, dx: 0, dy: 0 })

  const p = useScrollProgress(sectionRef)
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')

  // 量出小黑人中心到舞台中心的偏移，收缩时把它移到圆心
  useLayoutEffect(() => {
    const measure = () => {
      const st = stageRef.current.getBoundingClientRect()
      const m = mascotRef.current.getBoundingClientRect()
      setView({
        w: st.width,
        h: st.height,
        dx: st.left + st.width / 2 - (m.left + m.width * 0.36 - applied.current.x),
        dy: st.top + st.height / 2 - (m.top + m.height * 0.45 - applied.current.y),
      })
    }
    measure()
    window.addEventListener('resize', measure)
    document.fonts?.ready.then(measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // 大黑人的眼睛跟随鼠标
  useEffect(() => {
    const onMove = (e) => {
      const el = stageRef.current
      if (!el) return
      el.style.setProperty('--mx', ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3))
      el.style.setProperty('--my', ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3))
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  const shrink = easeInOut(segment(p, 0.04, 0.36))
  const swap = segment(p, 0.34, 0.42)
  const rise = easeInOut(segment(p, 0.58, 0.86))
  const circleOut = segment(p, 0.58, 0.68)
  const loading = segment(p, 0.72, 0.82)
  const eyeOpen = easeInOut(segment(p, 0.86, 0.98))

  const circle = clamp(view.w * 0.09, 84, 140) // 橙色圆的直径
  const radius = lerp(Math.hypot(view.w, view.h) / 2 + 20, circle / 2, shrink)
  const tx = view.dx * shrink
  const ty = view.dy * shrink
  applied.current = { x: tx, y: ty }

  return (
    <main>
      <section ref={sectionRef} className="relative h-[420vh]">
        <div ref={stageRef} className="sticky top-0 h-screen overflow-hidden bg-night">
          <StreakBackground active={rise > 0} still={reduced} style={{ opacity: rise }} />

          {/* 第一屏：圆形遮罩收缩 */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: `circle(${radius}px at 50% 50%)`,
              opacity: 1 - swap,
              visibility: swap >= 1 ? 'hidden' : 'visible',
              pointerEvents: shrink > 0.02 ? 'none' : 'auto',
            }}
          >
            <div className="absolute inset-0" style={{ transform: `translate3d(${tx}px, ${ty}px, 0)` }}>
              <Hero mascotRef={mascotRef} />
            </div>
          </div>

          {/* 中段：橙色圆里的小黑人 */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2"
            style={{
              width: circle,
              height: circle,
              opacity: swap * (1 - circleOut),
              transform: `translate(-50%, -50%) scale(${1 - circleOut * 0.5})`,
            }}
          >
            <MascotMaracas className="h-full w-full" />
          </div>

          {/* 第二屏 */}
          <Blob rise={rise} open={eyeOpen} />
          <p
            className="pointer-events-none absolute bottom-[4%] left-[2.5%] text-[clamp(1.25rem,2vw,2rem)] text-cream"
            style={{ opacity: loading, transform: `translateY(${(1 - loading) * 12}px)` }}
          >
            <span className="font-script text-[1.9em] leading-none">L</span>oading...
          </p>

          <Nav style={{ opacity: 1 - rise, pointerEvents: rise > 0.5 ? 'none' : 'auto' }} />
        </div>
      </section>
    </main>
  )
}
