// Número da loja (formato internacional, sem + nem espaços)
export const WHATSAPP = '5598981616144'
export const STORE_NAME = 'Casa Lumiar'
export const INSTAGRAM = 'https://www.instagram.com/casalumiar_/'
// PIN do painel no modo demonstração (sem Supabase configurado)
export const DEMO_PIN = 'lumiar'

// Banners da página inicial (imagens em public/banners). Com mais de um, vira carrossel.
// `href` é para onde o toque leva; sem produtos da linha no catálogo, vai para o WhatsApp.
export const BANNERS: { src: string; alt: string; href: string }[] = [
  {
    src: 'banners/imperio-rubi.jpg',
    alt: 'Novo lançamento Império Rubi: perfume, body splash e hidratante. Conhecer a linha.',
    href: `https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Olá, Casa Lumiar! Quero conhecer a linha Império Rubi.')}`,
  },
]

export const brl =(v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
