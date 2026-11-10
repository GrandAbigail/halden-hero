import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

const GRAVITY = 1900
const MAX_COINS = 420
const PUSH_RADIUS = 110 // 鼠标影响金币的范围（px）
const PUSH_MAX = 16 // 金币被推开的最大距离（px）

/**
 * 金币物理画布。通过 ref 调用 emit(x, y) 在指定位置喷出一枚金币。
 * 每枚金币的落点在整个屏幕宽度上随机，所以会平铺在底部而不是堆在喷口正下方；
 * 落地后鼠标靠近时会被轻轻推开，移走后弹回原位。坐标相对画布左上角。
 */
const CoinCanvas = forwardRef(function CoinCanvas({ className = '' }, ref) {
  const canvasRef = useRef(null)
  const state = useRef({
    coins: [],
    heights: [],
    w: 0,
    h: 0,
    r: 12,
    raf: 0,
    last: 0,
    mx: -9999,
    my: -9999,
  })

  const start = () => {
    const s = state.current
    if (!s.raf) {
      s.last = performance.now()
      s.raf = requestAnimationFrame(tick)
    }
  }

  useImperativeHandle(ref, () => ({
    emit(x, y) {
      const s = state.current
      if (s.coins.length >= MAX_COINS) return // 池子满了就不再喷
      // 先定落点，再反推水平速度，让金币铺满整个底部
      // 随机取几个候选落点，挑当前最空的那个，避免局部垒高、留空隙
      const binW = s.r * 1.5
      let targetX = 0
      let lowest = Infinity
      for (let i = 0; i < 4; i++) {
        const cand = s.r + Math.random() * (s.w - s.r * 2)
        const hgt = s.heights[Math.min(s.heights.length - 1, Math.floor(cand / binW))]
        if (hgt < lowest) {
          lowest = hgt
          targetX = cand
        }
      }
      const vy = -520 + Math.random() * 320
      const drop = Math.max(10, s.h - s.r - y)
      const t = (-vy + Math.sqrt(vy * vy + 2 * GRAVITY * drop)) / GRAVITY
      s.coins.push({
        x,
        y,
        vx: (targetX - x) / t,
        vy,
        spin: Math.random() * Math.PI,
        vs: 6 + Math.random() * 10,
        rest: false,
        face: 1,
        ox: 0,
        oy: 0,
      })
      start()
    },
  }))

  const draw = () => {
    const s = state.current
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = canvas.width / s.w || 1
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, s.w, s.h)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `700 ${s.r * 1.1}px "Inter Tight", sans-serif`
    for (const c of s.coins) {
      const sx = c.rest ? c.face : Math.max(0.12, Math.abs(Math.cos(c.spin)))
      ctx.save()
      ctx.translate(c.x + c.ox, c.y + c.oy)
      ctx.scale(sx, 1)
      ctx.beginPath()
      ctx.arc(0, 0, s.r, 0, Math.PI * 2)
      ctx.fillStyle = '#E0A526'
      ctx.fill()
      ctx.lineWidth = 2
      ctx.strokeStyle = '#B07A12'
      ctx.stroke()
      if (sx > 0.45) {
        ctx.fillStyle = '#8A5E0A'
        ctx.fillText('$', 0, 1)
      }
      ctx.restore()
    }
  }

  const tick = (now) => {
    const s = state.current
    const dt = Math.min(0.032, (now - s.last) / 1000)
    s.last = now
    let active = false
    const binW = s.r * 1.5
    const last = s.heights.length - 1
    const ease = 1 - Math.pow(0.001, dt) // 与帧率无关的缓动系数

    for (const c of s.coins) {
      if (c.rest) {
        // 落地的金币：鼠标靠近时被推开，离开后弹回
        const dx = c.x - s.mx
        const dy = c.y - s.my
        const d = Math.hypot(dx, dy)
        let tx = 0
        let ty = 0
        if (d < PUSH_RADIUS && d > 0.01) {
          const f = (1 - d / PUSH_RADIUS) * PUSH_MAX
          tx = (dx / d) * f
          ty = (dy / d) * f * 0.6
        }
        c.ox += (tx - c.ox) * ease
        c.oy += (ty - c.oy) * ease
        if (Math.abs(tx - c.ox) > 0.05 || Math.abs(ty - c.oy) > 0.05) active = true
        continue
      }

      active = true
      c.vy += GRAVITY * dt
      c.x += c.vx * dt
      c.y += c.vy * dt
      c.spin += c.vs * dt
      if (c.x < s.r) { c.x = s.r; c.vx = Math.abs(c.vx) * 0.5 }
      if (c.x > s.w - s.r) { c.x = s.w - s.r; c.vx = -Math.abs(c.vx) * 0.5 }
      let bin = Math.max(0, Math.min(last, Math.floor(c.x / binW)))
      const floor = s.h - s.r - s.heights[bin]
      if (c.y >= floor && c.vy > 0) {
        c.y = floor
        if (c.vy > 320) {
          c.vy *= -0.3
          c.vx *= 0.5
        } else {
          // 落地前先往更矮的邻格滚，保证铺平而不是垒高
          for (let i = 0; i < 6; i++) {
            const l = bin > 0 ? s.heights[bin - 1] : Infinity
            const r = bin < last ? s.heights[bin + 1] : Infinity
            if (Math.min(l, r) >= s.heights[bin]) break
            bin += l < r ? -1 : 1
          }
          c.x = Math.max(s.r, Math.min(s.w - s.r, (bin + 0.5) * binW + (Math.random() - 0.5) * binW * 0.6))
          c.y = s.h - s.r - s.heights[bin]
          c.rest = true
          c.face = Math.random() < 0.25 ? 0.18 + Math.random() * 0.3 : 0.8 + Math.random() * 0.2
          s.heights[bin] += s.r * 0.7
        }
      }
    }
    draw()
    s.raf = active ? requestAnimationFrame(tick) : 0
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const s = state.current
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      s.w = canvas.clientWidth
      s.h = canvas.clientHeight
      s.r = Math.max(8, Math.min(15, s.w * 0.0105))
      canvas.width = s.w * dpr
      canvas.height = s.h * dpr
      // 尺寸变了就清空重来，避免金币悬空
      s.coins = []
      s.heights = new Array(Math.max(1, Math.floor(s.w / (s.r * 1.5)))).fill(0)
      draw()
    }
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      s.mx = e.clientX - rect.left
      s.my = e.clientY - rect.top
      if (s.coins.length) start()
    }
    const onLeave = () => {
      s.mx = s.my = -9999
      if (s.coins.length) start()
    }
    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(s.raf)
      s.raf = 0
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  )
})

export default CoinCanvas
