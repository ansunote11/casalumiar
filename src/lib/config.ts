// Número da loja (formato internacional, sem + nem espaços)
export const WHATSAPP = '5598984011690' // (98) 9 8401-1690
export const STORE_NAME = 'Casa Lumiar'
export const INSTAGRAM = 'https://www.instagram.com/casalumiar_/'
// PIN do painel no modo demonstração (sem Supabase configurado)
export const DEMO_PIN = 'lumiar'

// Banners da página inicial (imagens 1200x800 em public/banners). Giram sozinhos; com setas e pontinhos.
// `href` começando com / abre uma página do catálogo; com https abre em outra aba (ex.: WhatsApp).
// Com `video`, o slide é um vídeo mudo em loop (src vira a capa enquanto carrega) e o
// carrossel não sai dele sozinho: fica passando até a pessoa ir para o próximo.
export type Banner = { src: string; alt: string; href: string; video?: string }
export const BANNERS: Banner[] = [
  {
    src: 'banners/vela-conforto.jpg',
    video: 'banners/vela-conforto.mp4',
    alt: 'Vela Conforto de Criança: aroma suave de baunilha, cera vegetal feita à mão. Crie memórias no seu lar.',
    href: `/produtos?q=${encodeURIComponent('Vela Conforto de Criança')}`,
  },
  {
    src: 'banners/amazonia-viva.jpg',
    alt: 'O sucesso voltou! Amazônia Viva, aromatizador de ambientes com notas de guaraná e cupuaçu.',
    href: `/produtos?q=${encodeURIComponent('Amazônia Viva')}`,
  },
  {
    src: 'banners/imperio-rubi.jpg',
    alt: 'Novo lançamento Império Rubi: perfume, body splash e hidratante. Conhecer a linha.',
    href: `/produtos?q=${encodeURIComponent('Império Rubi')}`,
  },
]

// ======================================================================
// ENTREGA, RETIRADA E PAGAMENTO — a loja pode mudar tudo aqui, sem mexer no carrinho.
// ======================================================================

// Endereço público do site (usado nos links de compartilhamento, sitemap e prévias).
export const SITE_URL = 'https://casalumiar.vercel.app'

// Retirada na loja: o que aparece para a cliente (aqui só a cidade; o endereço completo vai pelo WhatsApp).
// STORE_FULL_ADDRESS = true quando STORE_ADDRESS for o endereço completo (rua, número, bairro).
export const STORE_ADDRESS = 'Paço do Lumiar - MA'
export const STORE_FULL_ADDRESS = false
export const PICKUP_HOURS = ''

/**
 * Regiões de entrega e frete estimado (em reais). `fee: null` = calcular pelo WhatsApp.
 * `bairros` é opcional: os nomes aparecem embaixo da região para a cliente se localizar.
 * Valores iniciais para testar — ajuste conforme as entregas reais.
 * Distâncias aproximadas a partir do Maiobão (Paço do Lumiar).
 */
export type DeliveryRegion = { id: string; label: string; fee: number | null; bairros?: string[] }
export const DELIVERY_REGIONS: DeliveryRegion[] = [
  { id: 'proxima', label: 'Maiobão, Paranã, Cohatrac e vizinhos (até ~5 km)', fee: 10, bairros: ['Maiobão', 'Paranã (I, II e III)', 'Pindoba', 'Mocajituba', 'Forquilha', 'Cohatrac'] },
  { id: 'intermediaria', label: 'Paço (sede), Cohab Anil, Turu e vizinhos (~5 a 10 km)', fee: 15, bairros: ['Paço do Lumiar (sede/Centro)', 'Cohab Anil', 'Turu', 'Habitacional Turu', 'Anil', 'Cohafuma'] },
  { id: 'intermediaria-distante', label: 'Cohama, Vinhais, Calhau, Raposa e Ribamar (~10 a 15 km)', fee: 22, bairros: ['Cohama', 'Vinhais', 'Bequimão', 'Angelim', "Olho d'Água", 'Calhau', 'Cohajap', 'Raposa', 'São José de Ribamar (Centro)'] },
  { id: 'distante', label: "Renascença, Centro de São Luís, Ponta d'Areia (~15 a 20 km)", fee: 29, bairros: ['Renascença', 'João Paulo', 'Fátima', 'Monte Castelo', 'São Francisco', "Ponta d'Areia", 'Ponta do Farol', 'Centro de São Luís'] },
  { id: 'consultar', label: 'Não encontrei minha região — calcular pelo WhatsApp', fee: null },
]

// Parcelamento no cartão: até quantas vezes a loja aceita (1 = só à vista).
export const MAX_INSTALLMENTS = 3

export const brl =(v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
