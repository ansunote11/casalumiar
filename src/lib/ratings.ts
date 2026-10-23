// Um voto por produto em cada aparelho (guardado no navegador). Não impede quem limpa os dados,
// mas evita avaliações repetidas sem login.
const KEY = 'lumiar:myvotes'

const read = (): Record<string, number> => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}')
  } catch {
    return {}
  }
}

export const myVote = (id: string): number | null => read()[id] ?? null

export function rememberVote(id: string, stars: number) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...read(), [id]: stars }))
  } catch {
    /* navegador sem armazenamento: o voto vale, só não fica lembrado */
  }
}
