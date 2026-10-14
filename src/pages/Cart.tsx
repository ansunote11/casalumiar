import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { useCart } from '../lib/cart'
import { Thumb, TopBar } from '../components'
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

  const unit = (l: (typeof lines)[number]) => (payment === 'PIX' && l.product.pix_price ? l.product.pix_price : l.product.price)
  const total = lines.reduce((s, l) => s + unit(l) * l.qty, 0)

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
        items: lines.map((l) => ({ id: l.product.id, name: l.product.name, qty: l.qty, price: unit(l) })),
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
        <TopBar title="Seu pedido" />
        <div className="page center">
          <p className="muted">Seu pedido está vazio.</p>
          <Link className="btn dark" to="/produtos">
            Ver produtos
          </Link>
        </div>
      </>
    )

  return (
    <>
      <TopBar title="Seu pedido" />
      <div className="page">
        {lines.map((l) => (
          <div key={l.product.id} className="line">
            <div className="mini">
              <Thumb p={l.product} />
            </div>
            <div className="grow">
              <b>{l.product.name}</b>
              <small>{brl(unit(l))} cada</small>
            </div>
            <div className="stepper sm">
              <button onClick={() => setQty(l.product.id, l.qty - 1)}>−</button>
              <span>{l.qty}</span>
              <button onClick={() => setQty(l.product.id, l.qty + 1)}>+</button>
            </div>
          </div>
        ))}

        <h3>Seus dados</h3>
        <input placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="WhatsApp com DDD" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />

        <h3>Recebimento</h3>
        <div className="seg">
          {(['entrega', 'retirada'] as const).map((d) => (
            <button key={d} className={delivery === d ? 'on' : ''} onClick={() => setDelivery(d)}>
              {d === 'entrega' ? 'Entrega' : 'Retirada'}
            </button>
          ))}
        </div>
        {delivery === 'entrega' && <textarea placeholder="Endereço completo (rua, número, bairro, referência)" value={address} onChange={(e) => setAddress(e.target.value)} />}

        <h3>Pagamento</h3>
        <div className="seg">
          {PAYMENTS.map((p) => (
            <button key={p} className={payment === p ? 'on' : ''} onClick={() => setPayment(p)}>
              {p}
            </button>
          ))}
        </div>
        <textarea placeholder="Observações (opcional)" value={notes} onChange={(e) => setNotes(e.target.value)} />

        {err && <p className="error">{err}</p>}
        <div className="total">
          <span>Total</span>
          <b>{brl(total)}</b>
        </div>
        <button className="btn wa" disabled={busy} onClick={send}>
          {busy ? 'Enviando…' : 'Enviar pedido no WhatsApp'}
        </button>
        <p className="muted center small">Frete e prazo combinados com a loja pelo WhatsApp.</p>
      </div>
    </>
  )
}
