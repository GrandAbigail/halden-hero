import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

const GRAVITY = 1900
const MAX_COINS = 420

/**
 * 金币物理画布。通过 ref 调用 emit(x, y) 在指定位置喷出一枚金币，
 * 金币受重力下落、弹跳，最后在底部堆积。坐标相对画布左上角。
 */
const CoinCanvas = forwardRef(function CoinCanvas({ className = '' }, ref) {
  const canvasRef = useRef(null)
  const state = useRef({ coins: [], heights: [], w: 0, h: 0, r: 12, raf: 0, last: 0 })

  useImperativeHandle(ref, () => ({
    emit(x, y) {
      const s = state.current
      if (s.coins.length >= MAX_COINS) s.coins.shift()
      s.coins.push({
        x,
        y,
        vx: -140 + Math.random() * 420,
        vy: -420 + Math.random() * 300,
        spin: Math.random() * Math.PI,
        vs: 6 + Math.random() * 10,
        rest: false,
        face: 1,
      })
      if (!s.raf) {
        s.last = performance.now()
        s.raf = requestAnimationFrame(tick)
      }
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
      ctx.translate(c.x, c.y)
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
    let moving = false
    const binW = s.r * 1.5
    for (const c of s.coins) {
      if (c.rest) continue
      moving = true
      c.vy += GRAVITY * dt
      c.x += c.vx * dt
      c.y += c.vy * dt
      c.spin += c.vs * dt
      if (c.x < s.r) { c.x = s.r; c.vx = Math.abs(c.vx) * 0.5 }
      if (c.x > s.w - s.r) { c.x = s.w - s.r; c.vx = -Math.abs(c.vx) * 0.5 }
      const bin = Math.max(0, Math.min(s.heights.length - 1, Math.floor(c.x / binW)))
      const floor = s.h - s.r - s.heights[bin]
      if (c.y >= floor && c.vy > 0) {
        c.y = floor
        if (c.vy > 320) {
          c.vy *= -0.32
          c.vx *= 0.6
        } else {
          c.rest = true
          c.face = Math.random() < 0.3 ? 0.18 + Math.random() * 0.3 : 0.8 + Math.random() * 0.2
          s.heights[bin] = Math.min(s.r * 4.5, s.heights[bin] + s.r * 0.75)
        }
      }
    }
    draw()
    s.raf = moving ? requestAnimationFrame(tick) : 0
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
      s.heights = new Array(Math.ceil(s.w / (s.r * 1.5)) + 1).fill(0)
      draw()
    }
    resize()
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
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
