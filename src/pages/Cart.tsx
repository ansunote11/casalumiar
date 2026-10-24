import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { lineName, unitPrice, useCart } from '../lib/cart'
import { Icon, PageShade, Thumb, TopBar } from '../components'
import { brl } from '../lib/config'
import { whatsappLink } from '../lib/whatsapp'
import type { Delivery } from '../types'

const PAYMENTS = ['PIX', 'Dinheiro', 'Cartão']

export default function Cart() {
  const { lines, setQty, clear } = useCart()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [delivery, setDelivery] = useState<Delivery>('entrega')
  const [address, setAddress] = useState('')
  const [payment, setPayment] = useState('PIX')
  const [notes, setNotes] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const unit = (l: (typeof lines)[number]) => unitPrice(l.product, l.size, payment === 'PIX')
  const total = lines.reduce((s, l) => s + unit(l) * l.qty, 0)
  const deliveryLabel = delivery === 'entrega' ? 'Entrega' : 'Retirar na loja'

  const send = async () => {
    setErr('')
    if (!name.trim() || phone.replace(/\D/g, '').length < 10) return setErr('Informe seu nome e um WhatsApp válido com DDD.')
    if (delivery === 'entrega' && !address.trim()) return setErr('Informe o endereço de entrega.')
    setBusy(true)
    try {
      const order = await api.createOrder({
        customer_name: name.trim(),
        phone: phone.trim(),
        delivery,
        address: address.trim(),
        payment,
        notes: notes.trim(),
        items: lines.map((l) => ({ id: l.product.id, name: lineName(l), qty: l.qty, price: unit(l) })),
        total,
        source: 'catalogo',
      })
      window.open(whatsappLink(order), '_blank')
      clear()
    } catch {
      setErr('Não foi possível registrar o pedido. Tente novamente.')
    } finally {
      setBusy(false)
    }
  }

  if (lines.length === 0)
    return (
      <>
        <TopBar wave="c" />
        <PageShade side="flip" />
        <div className="page center">
          <h2 className="page-title">Meu pedido</h2>
          <p className="muted">Seu pedido está vazio.</p>
          <Link className="btn dark" to="/produtos">
            Ver produtos
          </Link>
        </div>
      </>
    )

  return (
    <>
      <TopBar wave="c" />
        <PageShade side="flip" />
      <div className="page">
        <h2 className="page-title" style={{ marginBottom: 14 }}>
          Meu pedido
        </h2>
        {lines.map((l) => (
          <div key={l.key} className="line">
            <div className="mini">
              <Thumb p={l.product} />
            </div>
            <div className="grow">
              <b>{lineName(l)}</b>
              <small>{brl(unit(l))} cada</small>
            </div>
            <div className="stepper sm">
              <button onClick={() => setQty(l.key, l.qty - 1)} aria-label={`Diminuir ${lineName(l)}`}>
                −
              </button>
              <span>{l.qty}</span>
              <button onClick={() => setQty(l.key, l.qty + 1)} aria-label={`Aumentar ${lineName(l)}`}>
                +
              </button>
            </div>
          </div>
        ))}

        <h3>Seus dados</h3>
        <input aria-label="Seu nome" placeholder="Como podemos te chamar?" value={name} onChange={(e) => setName(e.target.value)} />
        <input aria-label="WhatsApp com DDD" placeholder="WhatsApp com DDD" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />

        <h3>Como prefere receber?</h3>
        <div className="seg split">
          {(['entrega', 'retirada'] as const).map((d) => (
            <button key={d} className={delivery === d ? 'on' : ''} aria-pressed={delivery === d} onClick={() => setDelivery(d)}>
              {d === 'entrega' ? 'Entrega' : 'Retirar na loja'}
            </button>
          ))}
        </div>
        {delivery === 'entrega' && (
          <textarea aria-label="Endereço de entrega" placeholder="Endereço completo (rua, número, bairro, referência)" value={address} onChange={(e) => setAddress(e.target.value)} />
        )}

        <h3>Pagamento</h3>
        <div className="seg">
          {PAYMENTS.map((p) => (
            <button key={p} className={payment === p ? 'on' : ''} aria-pressed={payment === p} onClick={() => setPayment(p)}>
              {p}
            </button>
          ))}
        </div>
        <textarea aria-label="Observações" placeholder="Observações (opcional)" value={notes} onChange={(e) => setNotes(e.target.value)} />

        <div className="bubble" aria-label="Prévia da mensagem do WhatsApp">
          {['Olá, Casa Lumiar! Quero fazer um pedido:', ...lines.map((l) => `${l.qty}x ${lineName(l)}`), `Recebimento: ${deliveryLabel} · ${payment}`].join('\n')}
        </div>

        {err && <p className="error">{err}</p>}
        <div className="total">
          <span>Total</span>
          <b>{brl(total)}</b>
        </div>
        <button className="btn wa" disabled={busy} onClick={send}>
          <Icon name="whatsapp" />
          {busy ? 'Enviando…' : 'Enviar pedido pelo WhatsApp'}
        </button>
        <p className="muted center small">Frete e prazo combinados com a loja pelo WhatsApp.</p>
      </div>
    </>
  )
}
