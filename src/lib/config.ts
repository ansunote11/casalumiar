// Número da loja (formato internacional, sem + nem espaços)
export const WHATSAPP = '5598981616144'
export const STORE_NAME = 'Casa Lumiar'
export const INSTAGRAM = 'https://www.instagram.com/casalumiar_/'
// PIN do painel no modo demonstração (sem Supabase configurado)
export const DEMO_PIN = 'lumiar'

// Banners da página inicial (imagens 1200x800 em public/banners). Giram sozinhos; com setas e pontinhos.
// `href` começando com # abre uma página do catálogo; com https abre em outra aba (ex.: WhatsApp).
export type Banner = { src: string; alt: string; href: string }
export const BANNERS: Banner[] = [
  {
    src: 'banners/amazonia-viva.jpg',
    alt: 'O sucesso voltou! Amazônia Viva, aromatizador de ambientes com notas de guaraná e cupuaçu.',
    href: `#/produtos?q=${encodeURIComponent('Amazônia Viva')}`,
  },
  {
    src: 'banners/imperio-rubi.jpg',
    alt: 'Novo lançamento Império Rubi: perfume, body splash e hidratante. Conhecer a linha.',
    href: `#/produtos?q=${encodeURIComponent('Império Rubi')}`,
  },
]

export const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
