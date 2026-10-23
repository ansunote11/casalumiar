import type { Category, Product } from '../types'
import { seedPerfumes } from './perfumes'

export const seedCategories: Category[] = [
  { id: 'perfumes-femininos', name: 'Perfumes Femininos', icon: '', sort: 1 },
  { id: 'perfumes-masculinos', name: 'Perfumes Masculinos', icon: '', sort: 2 },
  { id: 'velas', name: 'Velas', icon: '', sort: 3 },
  { id: 'home-spray', name: 'Home Spray', icon: '', sort: 4 },
  { id: 'difusores', name: 'Difusores', icon: '', sort: 5 },
  { id: 'kits', name: 'Kits', icon: '', sort: 6 },
]

// Fragrâncias do documento de identidade. Preços de Home Spray/Difusor/Kit são provisórios.
const frag: [string, string[], string][] = [
  ['Clarear', ['Chá branco'], 'Leve e limpo, como lençol recém-lavado.'],
  ['Conforto de Criança', ['Jasmim', 'Rosa', 'Ylang Ylang'], 'Floral macio que lembra colo e cuidado.'],
  ['Amazônia Viva', ['Cupuaçu', 'Guaraná'], 'Frutas amazônicas, energia e frescor tropical.'],
  ['Delícia de Morango', ['Morango', 'Iogurte'], 'Doce cremoso e irresistível.'],
  ['Explosão Tropical', ['Laranja sanguínea', 'Mandarina verde', 'Framboesa'], 'Cítrico vibrante com fundo frutado.'],
  ['Império Oriental', ['Canela', 'Tomilho', 'Lavanda', 'Rosa', 'Menta', 'Musk', 'Patchouli', 'Madeira de guaiaco'], 'Especiado e envolvente, de presença marcante.'],
  ['Charme & Aroma', ['Folha de abacaxi', 'Notas florais', 'Âmbar cristal'], 'Frutal elegante com toque âmbar.'],
  ['Doce Dourado', ['Vanilla'], 'Baunilha quente e acolhedora.'],
  ['Doce Lar', ['Notas doces', 'Baunilha', 'Musk', 'Peônia', 'Âmbar'], 'O cheiro de casa cuidada.'],
  ['Aura Rosé', ['Abacaxi', 'Ylang Ylang', 'Patchouli'], 'Tropical sofisticado.'],
  ['Limão Siciliano', ['Limão siciliano'], 'Cítrico fresco e revigorante.'],
  ['Morango com Champanhe', ['Morango', 'Champanhe'], 'Festivo, doce e borbulhante.'],
  ['Orquídea Negra', ['Orquídea'], 'Floral profundo e misterioso.'],
  ['Maracujá Azedo', ['Maracujá'], 'Azedinho tropical e alegre.'],
  ['Lavanda Âmbar', ['Lavanda', 'Âmbar'], 'Relaxante com fundo quente.'],
  ['Bosque Boreal', ['Campanula', 'Lítsea cubeba', 'Eucalipto globulus', 'Cedro', 'Almíscar'], 'Floresta fria: verde, amadeirado e limpo.'],
]

const aromas: Product[] = frag.flatMap(([name, notes, description], i) => {
  const base = { notes, description, image_url: null, active: true, sizes: [], inspiration: '', pyramid: null }
  const list: Product[] = [
    { ...base, id: `vela-${i}`, sku: `VEL-${String(i + 1).padStart(3, '0')}`, name: `Vela ${name}`, category_id: 'velas', price: 62.5, pix_price: 50, stock: 12, featured: i < 4 },
  ]
  if (i % 2 === 0)
    list.push({ ...base, id: `spray-${i}`, sku: `SPR-${String(i + 1).padStart(3, '0')}`, name: `Home Spray ${name}`, category_id: 'home-spray', price: 39.9, pix_price: 35, stock: 8, featured: false })
  if (i % 3 === 0)
    list.push({ ...base, id: `dif-${i}`, sku: `DIF-${String(i + 1).padStart(3, '0')}`, name: `Difusor ${name}`, category_id: 'difusores', price: 54.9, pix_price: 48, stock: 6, featured: false })
  return list
})

export const seedProducts: Product[] = [...seedPerfumes, ...aromas]

// Muda quando a lista inicial muda, para o modo demonstração recarregar os produtos.
export const SEED_VERSION = 2
