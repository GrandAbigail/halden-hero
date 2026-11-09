# Halden — 金融科技 Hero 页（React + Tailwind CSS）

一个企业银行账户的落地页首屏：两段内容放在同一个滚动驱动的固定舞台里，WebGL 噪声背景，一张 3D 金属卡贯穿全程。

## 运行

```bash
npm install
npm run dev      # 本地开发
npm run build    # 生产构建，输出到 dist/
```

依赖只有 React、Vite、Tailwind，没有动画库；滚动动画由 `useScrollProgress` 自己计算。

## 目录

```
src/
  App.jsx                    页面组装（导航 + 滚动舞台 + 页脚）
  components/
    Nav.jsx                  固定导航，背景变深后 Logo 自动切浅色
    ScrollStory.jsx          核心：320vh 滚动区 + 100vh sticky 舞台，所有动画在这里
    BankCard.jsx             双面金属卡（正面卡号 / 背面本月收益）
    ShaderBackground.jsx     WebGL 片元着色器背景（fbm 噪声，随滚动加深）
  hooks/useScrollProgress.js 滚动进度、媒体查询、lerp / easing 工具
```

## 设计规范

| 角色 | 值 |
| --- | --- |
| 雾灰底色 mist | `#E6EBEE` |
| 灰蓝 fog | `#C7D2D7` |
| 松绿 pine / 深松绿 | `#143A33` / `#0C2621` |
| 黄铜 brass / 浅黄铜 | `#B48A3E` / `#D9B972` |
| 墨色 ink | `#1B2226` |

字体：标题 Bricolage Grotesque（600），正文 Instrument Sans。标题左对齐，收尾文案居中。

## 动画说明（按滚动进度 p：0 → 1）

| 进度 | 发生的事 |
| --- | --- |
| 初始 | 卡片在右侧倾斜悬浮（rotateX 20° / rotateY −28° / rotateZ −8°），轻微上下浮动 6s 循环；背景噪声缓慢流动 |
| 0.00 – 0.30 | 第一屏标题、正文和按钮上移 60px 并淡出 |
| 0.05 – 0.42 | 卡片平移到屏幕中心并放平、放大到 1.0；背景叠加深松绿，从雾灰过渡到暗色第二屏 |
| 0.30 – 0.55 | 三条卖点依次出现（左上 → 右中 → 左下），每条错开 0.07，从下方 24px 淡入 |
| 0.55 – 0.82 | 卖点淡出；卡片绕 Y 轴翻转 180°，露出黄铜色背面"本月收益 $1,284.60"，高光随旋转角扫过卡面 |
| 0.80 – 0.95 | 卡片上移缩小，收尾文案"Open an account in about eight minutes"和黄铜按钮浮现 |

调整节奏：改 `ScrollStory.jsx` 里各个 `segment(p, start, end)` 的区间；改滚动长度：改 `h-[320vh]`。

移动端：卡片改为纵向位移，卖点只显示标题并堆叠在底部。
`prefers-reduced-motion` 开启时：取消悬浮动画，着色器停在静帧（滚动驱动的变化保留，因为由用户操作触发）。
