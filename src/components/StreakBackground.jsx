import { useEffect, useRef } from 'react'

const vertex = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

// 第二屏背景：从左上到右下的蓝紫色斜向光束，缓慢流动
const fragment = `
precision mediump float;
uniform vec2 u_res;
uniform float u_time;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 p = uv * vec2(u_res.x / u_res.y, 1.0);
  vec2 dir = normalize(vec2(1.0, -0.78));   // 光束方向
  vec2 nrm = vec2(-dir.y, dir.x);           // 垂直于光束
  float across = dot(p, nrm);
  float along = dot(p, dir);
  float t = u_time * 0.12;

  float wide = noise(vec2(across * 3.0 + t * 0.6, along * 0.25 - t));
  float thin = noise(vec2(across * 14.0 - t, along * 0.35 + t * 0.5));
  float beam = pow(wide, 2.2) * 0.9 + pow(thin, 5.0) * 1.4;

  vec3 deep   = vec3(0.055, 0.040, 0.230);
  vec3 blue   = vec3(0.220, 0.170, 0.900);
  vec3 violet = vec3(0.520, 0.380, 1.000);
  vec3 pink   = vec3(0.950, 0.700, 1.000);

  vec3 col = mix(deep, blue, smoothstep(0.05, 0.75, beam));
  col = mix(col, violet, smoothstep(0.6, 1.2, beam));
  col = mix(col, pink, smoothstep(1.15, 1.7, beam) * 0.8);
  col *= 1.0 - 0.35 * length(uv - 0.5);
  gl_FragColor = vec4(col, 1.0);
}
`

export default function StreakBackground({ active = true, still = false, style }) {
  const canvasRef = useRef(null)
  const activeRef = useRef(active)
  activeRef.current = active

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false })
    if (!gl) return // 不支持 WebGL 时显示 CSS 渐变底色

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

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(program, 'a_pos')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const uRes = gl.getUniformLocation(program, 'u_res')
    const uTime = gl.getUniformLocation(program, 'u_time')

    const resize = () => {
      // 光束本身是柔和的，用低分辨率渲染换性能
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * 0.5
      canvas.width = Math.max(2, canvas.clientWidth * dpr)
      canvas.height = Math.max(2, canvas.clientHeight * dpr)
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    let raf = 0
    const start = performance.now()
    const draw = () => {
      raf = requestAnimationFrame(draw)
      if (!activeRef.current) return // 看不见的时候不画
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, still ? 20 : 20 + (performance.now() - start) / 1000)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
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
      style={style}
      className="absolute inset-0 h-full w-full bg-gradient-to-br from-[#1b1470] via-[#3a2be0] to-[#150f4a]"
    />
  )
}
