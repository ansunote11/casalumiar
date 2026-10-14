import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { STORE_NAME } from '../lib/config'
import type { Category } from '../types'

export default function Welcome() {
  const [cats, setCats] = useState<Category[]>([])
  useEffect(() => void api.categories().then(setCats), [])

  return (
    <main className="welcome">
      <header className="brand">
        <span className="brand-name">{STORE_NAME.toUpperCase()}</span>
        <span className="brand-sub">AROMAS PARA O LAR</span>
      </header>

      <section className="hero">
        <h2>
          Aromas que <br />
          transformam <em>seu lar.</em>
        </h2>
        <p>Velas, home sprays e difusores feitos para acolher. Escolha, monte seu pedido e finalize direto no WhatsApp.</p>
        <Link className="btn dark" to="/produtos">
          Ver produtos →
        </Link>
        <div className="hero-art" aria-hidden>
          <svg viewBox="0 0 320 170">
            <ellipse cx="160" cy="160" rx="150" ry="9" fill="#e4d8c6" />
            <g>
              <rect x="30" y="80" width="78" height="76" rx="14" fill="#fffaf2" stroke="#2b2622" strokeWidth="2" />
              <rect x="66" y="66" width="6" height="14" rx="3" fill="#2b2622" />
              <path d="M69 28c9 13 14 19 14 28a14 14 0 0 1-28 0c0-9 5-15 14-28z" fill="#c9a66b" />
              <text x="69" y="124" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="13" fontWeight="700" fill="#2b2622" letterSpacing="1.500">LUMIAR</text>
            </g>
            <g>
              <rect x="128" y="50" width="38" height="106" rx="10" fill="#c9a66b" />
              <rect x="137" y="26" width="20" height="26" rx="4" fill="#2b2622" />
              <rect x="134" y="86" width="26" height="40" rx="3" fill="#fffaf2" />
            </g>
            <g>
              <rect x="186" y="104" width="100" height="52" rx="12" fill="#efe3cf" stroke="#2b2622" strokeWidth="2" />
              <rect x="186" y="96" width="100" height="14" rx="6" fill="#2b2622" />
              <text x="236" y="136" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="13" fontWeight="700" fill="#2b2622" letterSpacing="1.500">LUMIAR</text>
            </g>
          </svg>
        </div>
      </section>

      <section className="cat-panel">
        <h3>Categorias</h3>
        <div className="cat-grid">
          {cats.map((c) => (
            <Link key={c.id} to={`/produtos?cat=${c.id}`} className="cat">
              <span>{c.icon}</span>
              {c.name}
            </Link>
          ))}
        </div>
        <Link to="/admin" className="admin-link">
          Área da loja
        </Link>
      </section>
    </main>
  )
}
