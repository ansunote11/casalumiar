// Número da loja (formato internacional, sem + nem espaços)
export const WHATSAPP = '5598981616144'
export const STORE_NAME = 'Casa Lumiar'
export const INSTAGRAM = 'https://www.instagram.com/casalumiar_/'
// PIN do painel no modo demonstração (sem Supabase configurado)
export const DEMO_PIN = 'lumiar'

export const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
