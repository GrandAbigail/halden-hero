/**
 * 双面金属卡。rotateY 用来驱动表面高光的位置，翻面时高光会扫过卡面。
 */
export default function BankCard({ rotateY = 0 }) {
  const sheen = 50 + (((rotateY % 360) + 360) % 360) / 3.6

  return (
    <div className="relative aspect-[1.586] w-full preserve-3d">
      {/* 正面 */}
      <div
        className="absolute inset-0 overflow-hidden rounded-[22px] backface-hidden shadow-[0_40px_80px_-30px_rgba(12,38,33,0.55)]"
        style={{
          background:
            'linear-gradient(135deg, #1d4a41 0%, #143A33 45%, #0C2621 100%)',
        }}
      >
        <div
          className="absolute inset-0 opacity-60 mix-blend-soft-light"
          style={{
            background: `linear-gradient(115deg, transparent ${sheen - 25}%, rgba(255,255,255,0.55) ${sheen}%, transparent ${sheen + 25}%)`,
          }}
        />
        {/* 细线纹理 */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.12]" aria-hidden="true">
          <defs>
            <pattern id="lines" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(32)">
              <line x1="0" y1="0" x2="0" y2="6" stroke="#D9B972" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#lines)" />
        </svg>

        <div className="relative flex h-full flex-col justify-between p-[7%] text-mist">
          <div className="flex items-start justify-between">
            <span className="font-display text-[clamp(18px,2.2vw,28px)] font-semibold tracking-tight">
              Halden
            </span>
            <span className="text-[clamp(10px,0.9vw,13px)] text-mist/70">Business</span>
          </div>

          {/* 芯片 */}
          <div
            className="h-[18%] w-[14%] rounded-md"
            style={{ background: 'linear-gradient(135deg, #E8CF94, #B48A3E 60%, #8C6A2C)' }}
          />

          <div className="flex items-end justify-between">
            <div>
              <p className="text-[clamp(10px,0.9vw,13px)] text-mist/60">Marrow &amp; Finch Studio</p>
              <p className="font-display text-[clamp(14px,1.5vw,20px)] tracking-[0.12em]">•••• 4417</p>
            </div>
            <div className="flex">
              <span className="h-[clamp(22px,2.4vw,34px)] w-[clamp(22px,2.4vw,34px)] rounded-full bg-brass/90" />
              <span className="-ml-3 h-[clamp(22px,2.4vw,34px)] w-[clamp(22px,2.4vw,34px)] rounded-full bg-brass-light/70" />
            </div>
          </div>
        </div>
      </div>

      {/* 背面：账户实时数据 */}
      <div
        className="absolute inset-0 overflow-hidden rounded-[22px] backface-hidden shadow-[0_40px_80px_-30px_rgba(12,38,33,0.55)]"
        style={{
          transform: 'rotateY(180deg)',
          background: 'linear-gradient(135deg, #E9D3A0 0%, #C9A257 50%, #A47C33 100%)',
        }}
      >
        <div className="flex h-full flex-col justify-between p-[7%] text-pine-deep">
          <div className="h-[16%] -mx-[8%] bg-pine-deep/85" />
          <div>
            <p className="text-[clamp(10px,0.9vw,13px)] text-pine-deep/70">Earned this month</p>
            <p className="font-display text-[clamp(28px,3.6vw,52px)] font-semibold leading-none tracking-tight">
              $1,284.60
            </p>
          </div>
          <div className="flex justify-between text-[clamp(10px,0.9vw,13px)]">
            <span>Swept tonight at 11:40 pm</span>
            <span>4.1% APY</span>
          </div>
        </div>
      </div>
    </div>
  )
}
