/**
 * 第二屏的大黑人。rise：0 在屏幕下方，1 完全升起；open：左眼睁开的程度 0–1。
 * 眼睛通过父级的 CSS 变量 --mx / --my（-1 到 1）跟随鼠标。
 */
export default function Blob({ rise = 0, open = 0 }) {
  const slot = 'absolute aspect-square w-[36%] transition-transform duration-200 ease-out'
  const disc = 'h-full w-full rounded-full bg-cream'
  const follow = { transform: 'translate(calc(var(--mx, 0) * 5%), calc(var(--my, 0) * 5%))' }

  return (
    <div
      className="pointer-events-none absolute bottom-0 left-1/2 h-[74%] w-[min(43vw,72vh)] min-w-[240px] -translate-x-1/2"
      aria-hidden="true"
    >
      <div
        className="relative h-full w-full will-change-transform"
        style={{ transform: `translateY(${(1 - rise) * 105}%)` }}
      >
        {/* 身体：顶部带一圈紫色轮廓光 */}
        <div
          className="absolute inset-0 rounded-t-[999px]"
          style={{
            background:
              'radial-gradient(110% 60% at 50% 0%, #2c2748 0%, #0c0b12 16%, #050506 60%)',
            boxShadow:
              'inset 0 10px 22px rgba(150,135,255,0.28), inset -14px 0 30px rgba(120,100,255,0.12)',
          }}
        />
        {/* 左眼：一半露在身体外面，随滚动从半睁到全睁 */}
        <div className={`${slot} -left-[5%] top-[19%]`} style={follow}>
          <div className="h-full w-full animate-blink">
            <div className={disc} style={{ clipPath: `inset(${(1 - open) * 50}% 0 0 0)` }} />
          </div>
        </div>
        {/* 右眼 */}
        <div className={`${slot} left-[35%] top-[19%]`} style={follow}>
          <div className="h-full w-full animate-blink">
            <div className={disc} />
          </div>
        </div>
      </div>
    </div>
  )
}
