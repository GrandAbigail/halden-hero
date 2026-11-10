// 页面里用到的插画，全部是内联 SVG，方便以后替换成正式素材。

/** 导航 Logo：橙色圆角方块 + 白色四瓣花 */
export function LogoMark({ className = '' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#F2573B" />
      <g fill="#fff">
        <circle cx="16" cy="11.6" r="4" />
        <circle cx="16" cy="20.4" r="4" />
        <circle cx="11.6" cy="16" r="4" />
        <circle cx="20.4" cy="16" r="4" />
      </g>
    </svg>
  )
}

/** 标题胶囊里的小黑人，拿着橙色钞票枪 */
export function MascotGun({ className = '' }) {
  return (
    <svg viewBox="0 0 100 80" className={className} aria-hidden="true">
      {/* 头顶的小闪线 */}
      <g stroke="#9BC66B" strokeWidth="2" strokeLinecap="round">
        <path d="M12 12l-5-5M22 6l-1-6M58 10l5-6" />
      </g>
      {/* 身体 + 头 */}
      <path d="M14 80c0-16 8-24 22-24s22 8 22 24z" fill="#0B0B0B" />
      <circle cx="36" cy="34" r="24" fill="#0B0B0B" />
      {/* 半眯的眼睛 */}
      <path d="M22 30a8 8 0 0 0 16 0z" fill="#fff" />
      <path d="M42 30a7 7 0 0 0 14 0z" fill="#fff" />
      <path d="M20 27l20 4M40 31l18-5" stroke="#0B0B0B" strokeWidth="3.5" strokeLinecap="round" />
      {/* 钞票枪 */}
      <g className="origin-[55%_70%] group-hover/pill:animate-recoil">
        <path d="M50 46h40a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H74l-4 14H56l4-14H50z" fill="#F2573B" />
        <path d="M58 46h10v-5H58z" fill="#D8442B" />
        <path d="M62 60a8 8 0 0 1 16 0" fill="none" stroke="#FFC83D" strokeWidth="3" />
        <path d="M66 60a4 4 0 0 1 8 0" fill="none" stroke="#3D7BFF" strokeWidth="3" />
        <rect x="90" y="50" width="6" height="10" rx="1" fill="#B8341F" />
      </g>
      {/* 握枪的手 */}
      <circle cx="62" cy="68" r="7" fill="#0B0B0B" />
    </svg>
  )
}

/** 一张绿色钞票 */
export function Bill({ className = '', style }) {
  return (
    <svg viewBox="0 0 40 22" className={className} style={style} aria-hidden="true">
      <rect width="40" height="22" rx="3" fill="#2F9E44" />
      <rect x="3" y="3" width="34" height="16" rx="2" fill="none" stroke="#8CE99A" strokeWidth="1.5" />
      <circle cx="20" cy="11" r="5" fill="#8CE99A" />
      <text x="20" y="14.5" textAnchor="middle" fontSize="9" fontWeight="700" fill="#1B6B2C">$</text>
    </svg>
  )
}

/** 标题末尾的 ATM 机图标 */
export function Atm({ className = '' }) {
  return (
    <svg viewBox="0 0 80 96" className={className} aria-hidden="true">
      <circle cx="40" cy="56" r="38" fill="#F5EEE4" />
      {/* 顶部招牌 */}
      <rect x="22" y="2" width="36" height="13" rx="3" fill="#1F7A4D" />
      <text x="40" y="12" textAnchor="middle" fontSize="9" fontWeight="700" fill="#F5EEE4" letterSpacing="1">ATM</text>
      {/* 机身 */}
      <path d="M12 26c0-6 4-10 10-10h36c6 0 10 4 10 10v62H12z" fill="#2E9B62" />
      <path d="M12 30h8v58h-8zM60 30h8v58h-8z" fill="#F08A2E" />
      <path d="M24 88V68h4v20zM34 88V68h4v20zM44 88V68h4v20z" fill="#F08A2E" />
      {/* 屏幕 */}
      <rect x="22" y="22" width="36" height="26" rx="3" fill="#0F3D2A" />
      <rect x="26" y="26" width="28" height="14" rx="2" fill="#1B5C40" />
      <rect x="28" y="29" width="16" height="2.5" rx="1" fill="#7FD6A6" />
      <rect x="28" y="34" width="10" height="2.5" rx="1" fill="#7FD6A6" />
      {/* 出钞口 */}
      <rect x="24" y="54" width="32" height="6" rx="2" fill="#0F3D2A" />
      <rect x="28" y="56" width="24" height="2" fill="#F5EEE4" />
    </svg>
  )
}

/** 滚动中段：橙色圆里摇沙锤、笑眯眯的小黑人 */
export function MascotMaracas({ className = '' }) {
  const maraca = (
    <>
      <rect x="-2.5" y="0" width="5" height="16" rx="2" fill="#E8862A" />
      <ellipse cx="0" cy="-8" rx="9" ry="11" fill="#F2573B" stroke="#D8442B" strokeWidth="1" />
      <path d="M-8 -10l4 4 4-4 4 4 4-4" fill="none" stroke="#FFC83D" strokeWidth="2" />
      <path d="M-7 -3h14" stroke="#2E9B62" strokeWidth="2" />
    </>
  )
  return (
    <svg viewBox="0 0 120 120" className={className} overflow="visible" aria-hidden="true">
      <circle cx="60" cy="60" r="54" fill="#F2573B" />
      <clipPath id="mm-clip">
        <circle cx="60" cy="60" r="54" />
      </clipPath>
      <g clipPath="url(#mm-clip)">
        <path d="M34 120c0-22 10-34 26-34s26 12 26 34z" fill="#0B0B0B" />
      </g>
      <circle cx="60" cy="54" r="28" fill="#0B0B0B" />
      {/* 笑眼 */}
      <path d="M40 54a8 8 0 0 1 16 0z" fill="#fff" />
      <path d="M64 54a8 8 0 0 1 16 0z" fill="#fff" />
      {/* 左右沙锤 */}
      <g transform="translate(15 66) scale(1.3)">
        <g className="animate-shakeL" style={{ transformOrigin: '0px 14px', transformBox: 'view-box' }}>
          {maraca}
        </g>
      </g>
      <g transform="translate(105 66) scale(1.3)">
        <g className="animate-shakeR" style={{ transformOrigin: '0px 14px', transformBox: 'view-box' }}>
          {maraca}
        </g>
      </g>
      <circle cx="16" cy="86" r="7" fill="#0B0B0B" />
      <circle cx="104" cy="86" r="7" fill="#0B0B0B" />
    </svg>
  )
}
