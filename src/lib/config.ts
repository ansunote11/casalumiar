// Número da loja (formato internacional, sem + nem espaços)
export const WHATSAPP = '5598981616144'
export const STORE_NAME = 'Casa Lumiar'
export const INSTAGRAM = 'https://www.instagram.com/casalumiar_/'
// PIN do painel no modo demonstração (sem Supabase configurado)
export const DEMO_PIN = 'lumiar'

// Banners da página inicial (imagens 1200x800 em public/banners). Giram sozinhos; com setas e pontinhos.
// `href` começando com # abre uma página do catálogo; com https abre em outra aba (ex.: WhatsApp).
// Com `video`, o slide é um vídeo mudo em loop (src vira a capa enquanto carrega) e o
// carrossel não sai dele sozinho: fica passando até a pessoa ir para o próximo.
export type Banner = { src: string; alt: string; href: string; video?: string }
export const BANNERS: Banner[] = [
  {
    src: 'banners/vela-kids.jpg',
    video: 'banners/vela-kids.mp4',
    alt: 'Vela Conforto de Criança: aroma suave de baunilha, cera vegetal feita à mão. Crie memórias no seu lar.',
    href: `#/produtos?q=${encodeURIComponent('Vela Conforto de Criança')}`,
  },
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
