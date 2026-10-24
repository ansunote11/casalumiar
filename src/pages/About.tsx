import { Link } from 'react-router-dom'
import { Icon, PageShade, TopBar } from '../components'
import { DELIVERY_REGIONS, INSTAGRAM, PICKUP_HOURS, STORE_ADDRESS, STORE_FULL_ADDRESS, WHATSAPP, brl } from '../lib/config'
import { track } from '../lib/track'
import { pageMeta, useMeta } from '../lib/useMeta'

/** Página "Sobre": origem, produção artesanal, atendimento, retirada e área de entrega. */
export default function About() {
  useMeta(
    pageMeta(
      '/sobre',
      'Sobre a Casa Lumiar — aromas artesanais do Maranhão',
      'Casa Lumiar: velas, difusores e perfumes artesanais do Maranhão. Atendimento pelo WhatsApp, retirada na loja e entrega em São Luís, Paço do Lumiar e arredores.',
    ),
  )
  return (
    <>
      <TopBar wave="a" />
      <PageShade side="left" />
      <article className="page about">
        <h2 className="page-title">Sobre a Casa Lumiar</h2>
        <p className="lead">Onde a luz vira essência.</p>

        <h3>Do Maranhão para o seu lar</h3>
        <p>
          A Casa Lumiar é uma marca maranhense de aromas para casa e perfumaria. Atendemos clientes de São Luís, Paço do Lumiar e
          arredores, com a proximidade de quem conversa com cada pessoa pelo WhatsApp.
        </p>

        <h3>Feito à mão</h3>
        <p>
          Nossas velas são artesanais, em cera vegetal, e cada linha de perfumes e aromatizadores é inspirada nos clássicos da alta
          perfumaria. Cada peça é feita com cuidado em cada detalhe.
        </p>

        <h3>Como comprar</h3>
        <ol className="steps">
          <li>Escolha seus produtos no catálogo.</li>
          <li>No carrinho, informe entrega ou retirada e a forma de pagamento.</li>
          <li>Envie o pedido pelo WhatsApp. Respondemos para confirmar disponibilidade, frete, prazo e pagamento.</li>
        </ol>

        <h3>Retirada na loja</h3>
        <p>
          Grátis. {STORE_FULL_ADDRESS ? `Endereço: ${STORE_ADDRESS}.` : `${STORE_ADDRESS ? `Em ${STORE_ADDRESS}. ` : ''}O endereço completo é enviado pelo WhatsApp ao confirmar o pedido.`}
          {PICKUP_HOURS && ` Horário: ${PICKUP_HOURS}.`} Avisamos quando o pedido estiver pronto.
        </p>

        <h3>Área de entrega</h3>
        {STORE_ADDRESS && (
          <p className="store-pin">
            <Icon name="pin" />
            <span>
              Estamos localizados em <b>{STORE_ADDRESS}</b>. Os pedidos saem daqui.
            </span>
          </p>
        )}
        <ul className="regions">
          {DELIVERY_REGIONS.map((r) => (
            <li key={r.id}>
              <span>
                {r.label}
                {!!r.bairros?.length && <small>{r.bairros.join(', ')}</small>}
              </span>
              <b>{r.fee == null ? 'consultar' : brl(r.fee)}</b>
            </li>
          ))}
        </ul>
        <p className="small muted">Valores estimados por região. Confirmamos o frete e o prazo pelo WhatsApp antes de finalizar.</p>

        <div className="about-cta">
          <Link className="btn dark" to="/produtos">
            Ver o catálogo
          </Link>
          <a className="btn light" href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer">
            <Icon name="whatsapp" />
            Falar no WhatsApp
          </a>
          <a className="btn light" href={INSTAGRAM} target="_blank" rel="noopener noreferrer" onClick={() => track('instagram_click', { local: 'sobre' })}>
            <Icon name="instagram" />
            Instagram
          </a>
        </div>
      </article>
    </>
  )
}
