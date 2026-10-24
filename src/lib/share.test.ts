// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import { copyText, nativeShare, shareLinks } from './share'

const url = 'https://casalumiar.vercel.app/produto/vela-maracuja-azedo'

describe('compartilhar', () => {
  it('links de WhatsApp e Facebook com o produto e a origem', () => {
    const l = shareLinks('Vela Maracujá Azedo', url)
    expect(decodeURIComponent(l.whatsapp)).toContain(`${url}?utm_source=whatsapp`)
    expect(l.facebook).toContain('facebook.com/sharer')
    expect(decodeURIComponent(l.facebook)).toContain(`${url}?utm_source=facebook`)
    expect(l.instagram).toBe(`${url}?utm_source=instagram&utm_medium=compartilhamento`)
  })
  it('copia pela área de transferência quando existe', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    expect(await copyText(url, { clipboard: { writeText } } as never)).toBe(true)
    expect(writeText).toHaveBeenCalledWith(url)
  })
  it('sem área de transferência, usa o plano B', async () => {
    document.execCommand = vi.fn().mockReturnValue(true)
    expect(await copyText(url, {} as never)).toBe(true)
    expect(document.execCommand).toHaveBeenCalledWith('copy')
  })
  it('compartilhamento nativo: falso quando não existe ou é cancelado', async () => {
    expect(await nativeShare({ url }, {} as never)).toBe(false)
    expect(await nativeShare({ url }, { share: vi.fn().mockRejectedValue(new Error('cancelou')) } as never)).toBe(false)
    expect(await nativeShare({ url }, { share: vi.fn().mockResolvedValue(undefined) } as never)).toBe(true)
  })
})
