import { useEffect, useRef } from 'react'

const vertex = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

// 缓慢流动的矿物色噪声场：雾灰底色，深松绿暗部，黄铜色高光
const fragment = `
precision mediump float;
uniform vec2 u_res;
uniform float u_time;
uniform float u_scroll;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 p = uv * vec2(u_res.x / u_res.y, 1.0) * 2.2;
  float t = u_time * 0.04;
  vec2 q = vec2(fbm(p + t), fbm(p + vec2(4.1, 1.7) - t));
  float n = fbm(p + 1.6 * q + vec2(0.0, u_scroll * 1.5));

  vec3 mist  = vec3(0.902, 0.922, 0.933);
  vec3 fog   = vec3(0.780, 0.824, 0.843);
  vec3 pine  = vec3(0.078, 0.227, 0.200);
  vec3 brass = vec3(0.706, 0.541, 0.243);

  vec3 col = mix(mist, fog, smoothstep(0.35, 0.75, n));
  // 随滚动加深，过渡到第二屏的松绿色调
  col = mix(col, pine, smoothstep(0.55, 0.95, n) * (0.15 + u_scroll * 0.75));
  col += brass * smoothstep(0.62, 0.8, q.x) * 0.10;
  // 轻微暗角
  col *= 1.0 - 0.18 * length(uv - 0.5);
  gl_FragColor = vec4(col, 1.0);
}
`

export default function ShaderBackground({ scroll = 0, still = false }) {
  const canvasRef = useRef(null)
  const scrollRef = useRef(scroll)
  scrollRef.current = scroll

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false })
    if (!gl) return // 不支持 WebGL 时退回到 CSS 渐变底色

    const compile = (type, src) => {
      const s = gl.createShader(type)
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }
    const program = gl.createProgram()
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex))
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment))
    gl.linkProgram(program)
    gl.useProgram(program)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(program, 'a_pos')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(program, 'u_res')
    const uTime = gl.getUniformLocation(program, 'u_time')
    const uScroll = gl.getUniformLocation(program, 'u_scroll')

    const resize = () => {
      // 背景是柔和噪声，降低分辨率换性能
      const dpr = Math.min(window.devicePixelRatio, 1.5) * 0.6
      canvas.width = canvas.clientWidth * dpr
      canvas.height = canvas.clientHeight * dpr
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    let raf = 0
    const start = performance.now()
    const draw = () => {
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, still ? 12 : (performance.now() - start) / 1000)
      gl.uniform1f(uScroll, scrollRef.current)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [still])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full bg-gradient-to-br from-mist via-fog to-mist"
    />
  )
}
