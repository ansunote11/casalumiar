import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { lineName, unitPrice, useCart } from '../lib/cart'
import { Icon, PageShade, Thumb, TopBar } from '../components'
import { DELIVERY_REGIONS, MAX_INSTALLMENTS, PICKUP_HOURS, STORE_ADDRESS, STORE_FULL_ADDRESS, WHATSAPP, brl } from '../lib/config'
import {
  PAY_LABEL,
  addressText,
  emptyForm,
  feeText,
  installmentLabel,
  installmentOptions,
  orderCode,
  orderMessage,
  summarize,
  validate,
  type CheckoutForm,
  type CheckoutLine,
  type Errors,
  type Field,
  type Pay,
} from '../lib/checkout'
import { currentUtm, track, utmText } from '../lib/track'
import { pageMeta, useMeta } from '../lib/useMeta'
import type { OrderItem } from '../types'

// linha de frete no pedido do painel: id "vazio" para a baixa de estoque ignorar
const FRETE_ID = '00000000-0000-0000-0000-000000000000'
const FIELD_ORDER: Field[] = ['name', 'phone', 'receive', 'regionId', 'street', 'reference', 'payment', 'installments']

export default function Cart() {
  useMeta(pageMeta('/carrinho', 'Meu pedido — Casa Lumiar', undefined, true))
  const { lines, setQty, clear } = useCart()
  const [f, setF] = useState<CheckoutForm>(emptyForm)
  const [errors, setErrors] = useState<Errors>({})
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [done, setDone] = useState<{ code: string; link: string } | null>(null)
  const started = useRef(false)

  useEffect(() => {
    if (lines.length && !started.current) {
      started.current = true
      track('begin_checkout', { itens: lines.reduce((n, l) => n + l.qty, 0) })
    }
  }, [lines])

  const set = <K extends keyof CheckoutForm>(k: K, v: CheckoutForm[K]) => {
    setF((x) => ({ ...x, [k]: v }))
    setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const items: CheckoutLine[] = lines.map((l) => ({
    name: lineName(l),
    qty: l.qty,
    price: unitPrice(l.product, l.size),
    pixPrice: unitPrice(l.product, l.size, true),
  }))
  const s = summarize(items, f, DELIVERY_REGIONS)
  const pix = f.payment === 'pix'

  const send = async () => {
    setErr('')
    const e = validate(f, DELIVERY_REGIONS)
    setErrors(e)
    const first = FIELD_ORDER.find((k) => e[k])
    if (first) {
      setErr('Confira os campos marcados antes de enviar.')
      document.getElementById(`f-${first}`)?.focus()
      return
    }
    // abre a aba já no clique (senão o celular bloqueia) e manda para o WhatsApp depois de salvar
    const tab = window.open('', '_blank')
    setBusy(true)
    try {
      const code = orderCode()
      const short = f.installments === 'whatsapp' ? 'decidir no WhatsApp' : f.installments === 1 ? 'à vista' : `${f.installments}x`
      const orderItems: OrderItem[] = lines.map((l, i) => ({ id: l.product.id, name: items[i].name, qty: l.qty, price: pix ? Math.min(items[i].price, items[i].pixPrice) : items[i].price }))
      if (s.fee) orderItems.push({ id: FRETE_ID, name: `Frete estimado (${s.region?.label ?? 'entrega'})`, qty: 1, price: s.fee })
      const origin = utmText(currentUtm())
      await api.createOrder({
        customer_name: f.name.trim(),
        phone: f.phone.trim(),
        delivery: f.receive!,
        address: addressText(f, s) + (f.receive === 'entrega' && s.fee == null ? ' · frete a confirmar' : ''),
        payment: f.payment === 'pix' ? 'PIX' : f.payment === 'cartao' ? `Cartão · ${short}` : 'Dinheiro',
        notes: [f.notes.trim(), origin && `Origem: ${origin}`].filter(Boolean).join(' · '),
        items: orderItems,
        total: s.total,
        source: 'catalogo',
      })
      const link = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(orderMessage(code, items, f, s, origin))}`
      track('send_whatsapp', { valor: s.total, pagamento: f.payment!, recebimento: f.receive! })
      if (tab) tab.location.href = link
      setDone({ code, link })
      clear()
    } catch {
      tab?.close()
      setErr('Não foi possível registrar o pedido agora. Verifique sua internet e tente novamente.')
    } finally {
      setBusy(false)
    }
  }

  if (done)
    return (
      <>
        <TopBar wave="c" />
        <PageShade side="flip" />
        <div className="page center" role="status">
          <h2 className="page-title">Pedido enviado!</h2>
          <p>
            Seu pedido <b>#{done.code}</b> foi registrado.
          </p>
          <p className="muted">Se o WhatsApp não abriu sozinho, toque no botão abaixo para enviar a mensagem para a loja.</p>
          <a className="btn wa" href={done.link} target="_blank" rel="noopener noreferrer">
            <Icon name="whatsapp" />
            Abrir WhatsApp
          </a>
          <p className="muted small">Responderemos pelo WhatsApp para confirmar disponibilidade, frete, prazo e pagamento.</p>
          <Link className="btn light" to="/produtos">
            Continuar vendo produtos
          </Link>
        </div>
      </>
    )

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

  const fieldProps = (k: Field) => ({
    id: `f-${k}`,
    'aria-invalid': errors[k] ? true : undefined,
    'aria-describedby': errors[k] ? `e-${k}` : undefined,
  })
  const Err = ({ k }: { k: Field }) =>
    errors[k] ? (
      <p className="field-error" id={`e-${k}`}>
        {errors[k]}
      </p>
    ) : null

  return (
    <>
      <TopBar wave="c" />
      <PageShade side="flip" />
      <div className="page checkout">
        <h2 className="page-title" style={{ marginBottom: 14 }}>
          Meu pedido
        </h2>
        {lines.map((l, i) => (
          <div key={l.key} className="line">
            <div className="mini">
              <Thumb p={l.product} />
            </div>
            <div className="grow">
              <b>{lineName(l)}</b>
              <small>
                {brl(items[i].price)} cada
                {items[i].pixPrice < items[i].price && ` · ${brl(items[i].pixPrice)} no Pix`}
              </small>
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
        <label className="field">
          <span>Nome</span>
          <input {...fieldProps('name')} autoComplete="name" placeholder="Como podemos te chamar?" value={f.name} onChange={(e) => set('name', e.target.value)} />
        </label>
        <Err k="name" />
        <label className="field">
          <span>WhatsApp com DDD</span>
          <input {...fieldProps('phone')} type="tel" autoComplete="tel" inputMode="tel" placeholder="(98) 90000-0000" value={f.phone} onChange={(e) => set('phone', e.target.value)} />
        </label>
        <Err k="phone" />

        <h3 id="l-receive">Como prefere receber?</h3>
        <div className="seg split" role="radiogroup" aria-labelledby="l-receive" {...fieldProps('receive')} tabIndex={-1}>
          {(['entrega', 'retirada'] as const).map((d) => (
            <button key={d} role="radio" className={f.receive === d ? 'on' : ''} aria-checked={f.receive === d} onClick={() => set('receive', d)}>
              {d === 'entrega' ? 'Entrega' : 'Retirada na loja (grátis)'}
            </button>
          ))}
        </div>
        <Err k="receive" />
        {STORE_ADDRESS && (
          <p className="store-pin">
            <Icon name="pin" />
            <span>
              Estamos localizados em <b>{STORE_ADDRESS}</b>. Os pedidos saem daqui.
            </span>
          </p>
        )}

        {f.receive === 'entrega' && (
          <div className="sub-form">
            <label className="field">
              <span>Região de entrega</span>
              <select {...fieldProps('regionId')} value={f.regionId} onChange={(e) => set('regionId', e.target.value)}>
                <option value="">Escolha sua região</option>
                {DELIVERY_REGIONS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                    {r.fee != null ? ` — ${brl(r.fee)}` : ''}
                  </option>
                ))}
              </select>
            </label>
            <Err k="regionId" />
            {!!s.region?.bairros?.length && <p className="small muted">Bairros: {s.region.bairros.join(', ')}</p>}
            <label className="field">
              <span>Rua e número</span>
              <input {...fieldProps('street')} autoComplete="address-line1" placeholder="Ex.: Rua das Flores, 120" value={f.street} onChange={(e) => set('street', e.target.value)} />
            </label>
            <Err k="street" />
            <label className="field">
              <span>
                Complemento <small>(opcional)</small>
              </span>
              <input autoComplete="address-line2" placeholder="Apto, bloco, casa…" value={f.complement} onChange={(e) => set('complement', e.target.value)} />
            </label>
            <label className="field">
              <span>Ponto de referência</span>
              <input {...fieldProps('reference')} placeholder="Ex.: ao lado da padaria" value={f.reference} onChange={(e) => set('reference', e.target.value)} />
            </label>
            <Err k="reference" />
            <label className="field">
              <span>
                CEP <small>(opcional)</small>
              </span>
              <input autoComplete="postal-code" inputMode="numeric" placeholder="00000-000" value={f.cep} onChange={(e) => set('cep', e.target.value)} />
            </label>
            <p className="info-box small">O frete exibido é uma estimativa por região. Confirmaremos o valor e o prazo pelo WhatsApp antes de finalizar o pedido.</p>
          </div>
        )}

        {f.receive === 'retirada' && (
          <div className="info-box">
            <b>Retirada na loja — grátis</b>
            <p className="small">
              {STORE_FULL_ADDRESS ? `Endereço: ${STORE_ADDRESS}` : `${STORE_ADDRESS ? `Em ${STORE_ADDRESS}. ` : ''}Enviaremos o endereço completo pelo WhatsApp.`}
            </p>
            {PICKUP_HOURS && <p className="small">Horário de retirada: {PICKUP_HOURS}</p>}
            <p className="small">Avisaremos pelo WhatsApp quando o seu pedido estiver pronto.</p>
          </div>
        )}

        <h3 id="l-payment">Pagamento</h3>
        <div className="seg pay" role="radiogroup" aria-labelledby="l-payment" {...fieldProps('payment')} tabIndex={-1}>
          {(Object.keys(PAY_LABEL) as Pay[]).map((p) => (
            <button
              key={p}
              role="radio"
              className={f.payment === p ? 'on' : ''}
              aria-checked={f.payment === p}
              onClick={() => {
                set('payment', p)
                if (p !== 'cartao') set('installments', null)
              }}
            >
              {PAY_LABEL[p]}
            </button>
          ))}
        </div>
        <Err k="payment" />

        {f.payment === 'cartao' && (
          <div className="sub-form">
            <h4 id="l-installments">Você deseja parcelar?</h4>
            <div className="choice-list" role="radiogroup" aria-labelledby="l-installments" {...fieldProps('installments')} tabIndex={-1}>
              {installmentOptions(MAX_INSTALLMENTS).map((n) => (
                <button key={String(n)} role="radio" className={f.installments === n ? 'on' : ''} aria-checked={f.installments === n} onClick={() => set('installments', n)}>
                  {installmentLabel(n, s.total)}
                </button>
              ))}
            </div>
            <Err k="installments" />
            <p className="info-box small">O pagamento é feito por link seguro ou na forma combinada com a loja. Nunca pedimos o número do cartão aqui nem no WhatsApp.</p>
          </div>
        )}

        <label className="field">
          <span>
            Observações <small>(opcional)</small>
          </span>
          <textarea placeholder="Presente, horário preferido, algum detalhe…" value={f.notes} onChange={(e) => set('notes', e.target.value)} />
        </label>

        <dl className="summary" aria-label="Resumo do pedido">
          <div>
            <dt>Subtotal</dt>
            <dd>{brl(s.subtotal)}</dd>
          </div>
          {s.discount > 0 && (
            <div className="good">
              <dt>Desconto Pix</dt>
              <dd>−{brl(s.discount)}</dd>
            </div>
          )}
          <div>
            <dt>Frete estimado</dt>
            <dd>{f.receive ? feeText(s) : 'escolha entrega ou retirada'}</dd>
          </div>
          <div className="total">
            <dt>Total estimado</dt>
            <dd>
              <b>{brl(s.total)}</b>
              {f.receive === 'entrega' && s.fee == null && <small> + frete</small>}
            </dd>
          </div>
        </dl>
        {!pix && s.subtotal > items.reduce((t, l) => t + l.pixPrice * l.qty, 0) && (
          <p className="small muted">No Pix sai por {brl(items.reduce((t, l) => t + l.pixPrice * l.qty, 0) + (s.fee ?? 0))}.</p>
        )}

        {err && (
          <p className="error" role="alert">
            {err}
          </p>
        )}
        <button className="btn wa" disabled={busy} onClick={send}>
          <Icon name="whatsapp" />
          {busy ? 'Registrando pedido…' : 'Enviar pedido pelo WhatsApp'}
        </button>
        <p className="muted center small">
          Após o envio, responderemos pelo WhatsApp para confirmar disponibilidade, frete, prazo e pagamento. O pedido só é considerado confirmado após essa validação.
        </p>
      </div>
    </>
  )
}
