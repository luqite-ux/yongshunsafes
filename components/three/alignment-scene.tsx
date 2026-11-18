'use client'

import { useEffect, useRef, useState } from 'react'
import type * as ThreeNS from 'three'
import { cn } from '@/lib/utils'

type Variant = 'bolts' | 'arcs'

function StaticFallback() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 400"
      className="absolute inset-0 size-full"
      preserveAspectRatio="xMaxYMid meet"
      fill="none"
    >
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={110 + i * 20}
          y={70 + i * 26}
          width={180 - i * 40}
          height={250 - i * 52}
          stroke="#b8862b"
          strokeOpacity={0.55 - i * 0.1}
          strokeWidth="1.2"
        />
      ))}
      {[150, 200, 250].map((y) => (
        <g key={y} stroke="#4a6c9b" strokeOpacity="0.5">
          <line x1="290" x2="340" y1={y} y2={y} />
          <circle cx="344" cy={y} r="4" />
        </g>
      ))}
      {[150, 175, 200].map((r, i) => (
        <path
          key={r}
          d={`M ${200 - r * 0.5} ${360 - i * 4} A ${r} ${r} 0 0 0 ${200 + r * 0.5} ${360 - i * 4}`}
          stroke="#9aa6b8"
          strokeOpacity="0.7"
        />
      ))}
    </svg>
  )
}

export function AlignmentScene({
  variant = 'bolts',
  className,
}: {
  variant?: Variant
  className?: string
}) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let disposed = false
    let started = false
    let visible = false
    let api: { resume: () => void; pause: () => void; destroy: () => void } | null = null

    const start = async () => {
      const THREE = await import('three')
      if (disposed) return

      let renderer: ThreeNS.WebGLRenderer
      try {
        renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: 'low-power',
        })
      } catch {
        return
      }
      renderer.setClearColor(0x000000, 0)
      const canvas = renderer.domElement
      canvas.style.cssText = 'display:block;width:100%;height:100%'
      host.appendChild(canvas)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 60)
      camera.position.set(0, 0, 14)

      const geometries: ThreeNS.BufferGeometry[] = []
      const materials: ThreeNS.Material[] = []
      const lineMat = (color: string, opacity: number) => {
        const m = new THREE.LineBasicMaterial({ color, transparent: true, opacity })
        materials.push(m)
        return m
      }
      const geo = (points: ThreeNS.Vector3[]) => {
        const g = new THREE.BufferGeometry().setFromPoints(points)
        geometries.push(g)
        return g
      }
      const v = (x: number, y: number, z = 0) => new THREE.Vector3(x, y, z)

      const root = new THREE.Group()
      scene.add(root)

      const emphasis = variant === 'arcs' ? 0.5 : 1
      const frames: ThreeNS.Object3D[] = []
      for (let i = 0; i < 5; i++) {
        const w = 5.2 - i * 0.7
        const h = 6.6 - i * 0.9
        const loop = new THREE.LineLoop(
          geo([v(-w / 2, -h / 2), v(w / 2, -h / 2), v(w / 2, h / 2), v(-w / 2, h / 2)]),
          lineMat(i % 2 ? '#4a6c9b' : '#b8862b', (0.75 - i * 0.12) * (variant === 'bolts' ? 1 : 0.7)),
        )
        loop.position.z = -i * 0.8
        frames.push(loop)
        root.add(loop)
      }

      const bolts: { group: ThreeNS.Group; side: number }[] = []
      const boltMat = lineMat('#b8862b', 0.85 * emphasis)
      const headMat = lineMat('#4a6c9b', 0.8 * emphasis)
      const circle = Array.from({ length: 28 }, (_, i) => {
        const a = (i / 28) * Math.PI * 2
        return v(Math.cos(a) * 0.17, Math.sin(a) * 0.17)
      })
      for (const side of [-1, 1]) {
        for (const y of [-1.9, -0.65, 0.65, 1.9]) {
          const g = new THREE.Group()
          g.add(new THREE.Line(geo([v(side * 2.6, y), v(side * 4.0, y)]), boltMat))
          const head = new THREE.LineLoop(geo(circle), headMat)
          head.position.set(side * 4.17, y, 0)
          g.add(head)
          root.add(g)
          bolts.push({ group: g, side })
        }
      }

      const arcGroup = new THREE.Group()
      arcGroup.position.z = -0.4
      root.add(arcGroup)
      const arcMat = lineMat('#4a6c9b', variant === 'arcs' ? 0.9 : 0.35)
      const tickMat = lineMat('#b8862b', variant === 'arcs' ? 0.9 : 0.35)
      ;[3.6, 4.3, 5.0].forEach((r) => {
        const pts: ThreeNS.Vector3[] = []
        for (let a = -0.15; a <= 0.75; a += 0.02) {
          pts.push(v(Math.cos(a * Math.PI) * r, Math.sin(a * Math.PI) * r))
        }
        arcGroup.add(new THREE.Line(geo(pts), arcMat))
        const ticks: ThreeNS.Vector3[] = []
        for (let a = -0.15; a <= 0.751; a += 0.05) {
          const c = Math.cos(a * Math.PI)
          const s = Math.sin(a * Math.PI)
          ticks.push(v(c * r, s * r), v(c * (r + 0.2), s * (r + 0.2)))
        }
        arcGroup.add(new THREE.LineSegments(geo(ticks), tickMat))
      })
      const dim = new THREE.LineSegments(
        geo([
          v(-2.6, -4.0), v(2.6, -4.0),
          v(-2.6, -3.8), v(-2.6, -4.2),
          v(2.6, -3.8), v(2.6, -4.2),
        ]),
        tickMat,
      )
      root.add(dim)

      const state = { px: 0, py: 0, cx: 0, cy: 0, p: 0.5, cp: 0.5 }
      const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n))
      let raf = 0
      let running = false

      const applyLayout = () => {
        const w = host.clientWidth || 1
        const h = host.clientHeight || 1
        const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.25 : 2)
        renderer.setPixelRatio(dpr)
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        const viewH = 2 * 14 * Math.tan((32 * Math.PI) / 360)
        const viewW = viewH * camera.aspect
        root.scale.setScalar(Math.min(1, viewW / 10.5, 1.05))
        root.position.x = camera.aspect > 1.3 ? viewW * 0.12 : 0
      }

      const update = () => {
        const rect = host.getBoundingClientRect()
        state.p = clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0, 1)
        state.cx += (state.px - state.cx) * 0.07
        state.cy += (state.py - state.cy) * 0.07
        state.cp += (state.p - state.cp) * 0.08
        const p = state.cp
        root.rotation.y = state.cx * 0.38 + (p - 0.5) * 0.7
        root.rotation.x = -state.cy * 0.2
        frames.forEach((f, i) => {
          f.position.z = -i * (0.4 + p * 0.9)
        })
        bolts.forEach(({ group, side }) => {
          group.position.x = -side * (1 - p) * 1.4
        })
        arcGroup.rotation.z = (p - 0.5) * 0.9 + state.cx * 0.12
      }

      const render = () => renderer.render(scene, camera)
      const tick = () => {
        raf = 0
        if (!running) return
        update()
        render()
        raf = requestAnimationFrame(tick)
      }

      const onPointer = (e: PointerEvent) => {
        const r = host.getBoundingClientRect()
        state.px = clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1)
        state.py = clamp(((e.clientY - r.top) / r.height) * 2 - 1, -1, 1)
      }

      applyLayout()
      render()
      setReady(true)

      const resizeObserver = new ResizeObserver(() => {
        applyLayout()
        render()
      })
      resizeObserver.observe(host)

      const onVisibility = () => {
        if (document.hidden) api?.pause()
        else if (visible) api?.resume()
      }

      if (!reduced) {
        window.addEventListener('pointermove', onPointer, { passive: true })
        document.addEventListener('visibilitychange', onVisibility)
      }

      api = {
        resume: () => {
          if (reduced || running || document.hidden) return
          running = true
          raf = requestAnimationFrame(tick)
        },
        pause: () => {
          running = false
          if (raf) cancelAnimationFrame(raf)
          raf = 0
        },
        destroy: () => {
          running = false
          if (raf) cancelAnimationFrame(raf)
          resizeObserver.disconnect()
          window.removeEventListener('pointermove', onPointer)
          document.removeEventListener('visibilitychange', onVisibility)
          geometries.forEach((g) => g.dispose())
          materials.forEach((m) => m.dispose())
          renderer.dispose()
          canvas.remove()
        },
      }
      if (visible) api.resume()
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible && !started) {
          started = true
          void start()
        } else if (api) {
          if (visible) api.resume()
          else api.pause()
        }
      },
      { rootMargin: '120px' },
    )
    io.observe(host)

    return () => {
      disposed = true
      io.disconnect()
      api?.destroy()
    }
  }, [variant])

  return (
    <div
      ref={hostRef}
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      <div className={cn('transition-opacity duration-700', ready && 'opacity-0')}>
        <StaticFallback />
      </div>
    </div>
  )
}
