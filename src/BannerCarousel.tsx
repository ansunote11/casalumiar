import { useEffect, useRef, useState } from 'react'
import { Icon } from './components'
import type { Banner } from './lib/config'

const INTERVAL = 5000 // ms em cada banner
const RESUME_AFTER = 6000 // depois de mexer, espera um pouco antes de voltar a girar

/**
 * Banners que giram sozinhos, com setas e pontinhos. É uma faixa rolável com "snap":
 * no celular também dá para arrastar com o dedo. Pausa enquanto a pessoa interage e
 * não gira sozinho para quem pediu menos movimento no sistema.
 */
export function BannerCarousel({ banners }: { banners: Banner[] }) {
  const track = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const pausedUntil = useRef(0)
  const many = banners.length > 1

  const go = (i: number, smooth = true) => {
    const el = track.current
    if (!el) return
    const n = (i + banners.length) % banners.length
    el.scrollTo({ left: n * el.clientWidth, behavior: smooth ? 'smooth' : 'auto' })
  }
  const userGo = (i: number) => {
    pausedUntil.current = Date.now() + RESUME_AFTER
    go(i)
  }

  useEffect(() => {
    if (!many || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => {
      if (document.hidden || Date.now() < pausedUntil.current) return
      const el = track.current
      if (el) go(Math.round(el.scrollLeft / el.clientWidth) + 1)
    }, INTERVAL)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [many, banners.length])

  const pause = () => (pausedUntil.current = Date.now() + RESUME_AFTER)

  return (
    <section className="banners" aria-roledescription="carrossel" aria-label="Destaques">
      <div
        ref={track}
        className="banner-track"
        onScroll={(e) => {
          const el = e.currentTarget
          setIndex(Math.round(el.scrollLeft / el.clientWidth))
        }}
        onPointerDown={pause}
        onTouchStart={pause}
        onMouseEnter={pause}
        onFocus={pause}
      >
        {banners.map((b, i) => (
          <a
            key={b.src}
            href={b.href}
            target={b.href.startsWith('http') ? '_blank' : undefined}
            rel="noreferrer"
            className="banner"
            aria-roledescription="slide"
            aria-label={`${i + 1} de ${banners.length}: ${b.alt}`}
            tabIndex={i === index ? 0 : -1}
          >
            <img src={`${import.meta.env.BASE_URL}${b.src}`} alt={b.alt} width={1200} height={800} loading={i === 0 ? 'eager' : 'lazy'} />
          </a>
        ))}
      </div>
      {many && (
        <>
          <button className="banner-arrow prev" onClick={() => userGo(index - 1)} aria-label="Banner anterior">
            <Icon name="arrow" />
          </button>
          <button className="banner-arrow next" onClick={() => userGo(index + 1)} aria-label="Próximo banner">
            <Icon name="arrow" />
          </button>
          <div className="banner-dots" role="group" aria-label="Escolher banner">
            {banners.map((b, i) => (
              <button key={b.src} className={i === index ? 'on' : ''} aria-label={`Ver banner ${i + 1}`} aria-current={i === index} onClick={() => userGo(i)} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
