import { useEffect, useRef, type PointerEvent as RPointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { Icon, catIcon } from './components'
import type { Category } from './types'

// Foto de cada categoria em public/categorias/. .jpg = foto real do produto; .png = imagem do Canva (Dream Lab).
const CAT_IMAGES: Record<string, string> = {
  'perfumes-femininos': 'perfumes-femininos.jpg',
  'perfumes-masculinos': 'perfumes-masculinos.jpg',
  'body-splash': 'body-splash.jpg',
  velas: 'velas.jpg',
  'home-spray': 'home-spray.png',
  difusores: 'difusores.jpg',
  kits: 'kits.jpg',
}
const SPEED = 28 // px por segundo
const RESUME_AFTER = 2500 // ms parado depois que a pessoa solta
const STEP = 150 + 12 // largura de um card + espaço: o quanto cada seta anda
// Tamanho pela posição: perto do centro (os 2 do meio) fica 100%; nas pontas, 80%.
const FULL_ZONE = STEP / 2 // até aqui do centro, tamanho cheio
const SHRINK_UNTIL = 250 // a partir daqui do centro, tamanho mínimo
const MIN_SCALE = 0.8

/**
 * Fileira de categorias que desliza sozinha em loop (a lista é desenhada duas vezes e,
 * ao passar da metade, volta o mesmo tanto, sem salto visível). Tocar, arrastar ou passar
 * o mouse pausa; quem prefere menos movimento no sistema vê a fileira parada, rolável à mão.
 */
export function CategoryRail({ cats }: { cats: Category[] }) {
  const rail = useRef<HTMLDivElement>(null)
  const state = useRef({ pos: 0, paused: false, resumeAt: 0, drag: null as null | { x: number; left: number; moved: boolean }, justDragged: false })

  useEffect(() => {
    const el = rail.current
    if (!el || !cats.length) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const s = state.current
    let raf = 0
    let last = performance.now()
    const half = () => el.scrollWidth / 2
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000)
      last = now
      if (s.paused && s.resumeAt && now >= s.resumeAt) {
        s.paused = false
        s.resumeAt = 0
        s.pos = el.scrollLeft // continua de onde a pessoa deixou
      }
      if (!s.paused && !reduce) {
        s.pos += SPEED * dt
        if (s.pos >= half()) s.pos -= half()
        el.scrollLeft = s.pos
      }
      scaleByPosition(el)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [cats])

  const arrow = (dir: 1 | -1) => {
    pause()
    rail.current?.scrollBy({ left: dir * STEP, behavior: 'smooth' })
    resumeLater(4000)
  }
  const pause = () => {
    state.current.paused = true
    state.current.resumeAt = 0
  }
  const resumeLater = (ms = RESUME_AFTER) => {
    state.current.resumeAt = performance.now() + ms
  }
  // rolagem manual também dá a volta, nos dois sentidos
  const onScroll = () => {
    const el = rail.current
    if (!el || !state.current.paused) return
    const half = el.scrollWidth / 2
    if (el.scrollLeft >= half) el.scrollLeft -= half
    else if (el.scrollLeft <= 0) el.scrollLeft += half
  }
  // arrastar com o mouse (no celular o dedo já rola nativamente)
  const onPointerDown = (e: RPointerEvent) => {
    pause()
    if (e.pointerType === 'mouse' && rail.current) state.current.drag = { x: e.clientX, left: rail.current.scrollLeft, moved: false }
  }
  const onPointerMove = (e: RPointerEvent) => {
    const d = state.current.drag
    if (!d || !rail.current) return
    const dx = e.clientX - d.x
    if (Math.abs(dx) > 4) d.moved = true
    rail.current.scrollLeft = d.left - dx
  }
  const endDrag = () => {
    // o clique chega logo depois do pointerup: guarda se foi arraste para cancelá-lo
    state.current.justDragged = !!state.current.drag?.moved
    state.current.drag = null
    resumeLater()
  }

  const card = (c: Category, i: number, copy: boolean) => (
    <Link
      key={`${copy ? 'b' : 'a'}-${c.id}`}
      to={`/produtos?cat=${c.id}`}
      className={`rail-card c${i % 6}`}
      aria-hidden={copy || undefined}
      tabIndex={copy ? -1 : undefined}
      draggable={false}
    >
      {CAT_IMAGES[c.id] ? (
        <img src={`${import.meta.env.BASE_URL}categorias/${CAT_IMAGES[c.id]}`} alt="" loading="lazy" draggable={false} />
      ) : (
        <Icon name={catIcon(c.id)} />
      )}
      <span>{c.name}</span>
    </Link>
  )

  return (
    <div className="rail-wrap">
    <nav
      ref={rail as never}
      className="rail"
      aria-label="Categorias"
      onScroll={onScroll}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={(e) => {
        // um arraste com o mouse não deve abrir a categoria
        if (state.current.justDragged) e.preventDefault()
        state.current.justDragged = false
      }}
      onMouseEnter={pause}
      onMouseLeave={() => {
        state.current.drag = null
        resumeLater(600)
      }}
      onTouchStart={pause}
      onTouchEnd={() => resumeLater()}
      onFocus={pause}
      onBlur={() => resumeLater()}
    >
      {cats.map((c, i) => card(c, i, false))}
      {cats.map((c, i) => card(c, i, true))}
    </nav>
    <button className="rail-arrow prev" onClick={() => arrow(-1)} aria-label="Categorias anteriores">
      <Icon name="arrow" />
    </button>
    <button className="rail-arrow next" onClick={() => arrow(1)} aria-label="Próximas categorias">
      <Icon name="arrow" />
    </button>
    </div>
  )
}

/** Encolhe cada card conforme a distância até o centro da fileira (chamado a cada quadro). */
function scaleByPosition(el: HTMLElement) {
  const box = el.getBoundingClientRect()
  const center = box.left + box.width / 2
  for (const c of el.children as HTMLCollectionOf<HTMLElement>) {
    const r = c.getBoundingClientRect()
    const d = Math.abs(r.left + r.width / 2 - center)
    const t = Math.min(1, Math.max(0, (d - FULL_ZONE) / (SHRINK_UNTIL - FULL_ZONE)))
    c.style.transform = `scale(${(1 - t * (1 - MIN_SCALE)).toFixed(3)})`
  }
}
