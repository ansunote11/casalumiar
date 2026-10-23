# Casa Lumiar — catálogo + pedido no WhatsApp

Catálogo mobile (Vite + React + TypeScript) onde o cliente monta o pedido e ele chega pronto no WhatsApp da loja. Painel enxuto com pedidos, venda de balcão e estoque.

## Rodar

```bash
npm install
npm run dev
```

Sem `.env`, roda em **modo demonstração**: dados ficam no navegador, painel em `/#/admin` com PIN `lumiar`.

## Supabase

O site publicado já está ligado ao projeto `upfxtwbyhbyzyhbplght` pelo arquivo [`.env.production`](.env.production) (só a URL e a *publishable key*, que são públicas). `npm run dev` continua em modo demonstração.

### Ligar a outro projeto Supabase

1. Crie um projeto no Supabase e rode [`supabase/schema.sql`](supabase/schema.sql) no SQL Editor; depois rode [`supabase/seed.sql`](supabase/seed.sql) para carregar os produtos iniciais.
2. Em Authentication › Users, crie o usuário do painel (e-mail + senha).
3. Copie `.env.example` para `.env` e preencha URL e chave `anon`.
4. Reinicie `npm run dev`.

## Telas

- `/` boas-vindas com categorias · `/#/produtos` lista com busca · `/#/produto/:id` detalhe · `/#/carrinho` pedido → WhatsApp
- `/#/admin` Resumo, Pedidos (confirmar baixa estoque, cancelar devolve), Balcão (venda rápida) e Estoque (CRUD)

## Ajustes rápidos

- Número do WhatsApp, nome e PIN demo: `src/lib/config.ts`
- Perfumes (19, com tamanhos 30/50/100 mL e preço PIX) extraídos dos catálogos FlipHTML5: `src/lib/perfumes.ts`; fotos em `public/produtos/`
- Banco já criado antes dos perfumes: rode `supabase/schema.sql` de novo (só adiciona as colunas e categorias novas) e depois `supabase/seed.sql`
- Produtos de exemplo (aromas do documento de identidade; preços de spray/difusor são provisórios): `src/lib/seed.ts`

## Publicar

`npm run build` gera `dist/`. Usa HashRouter, então funciona em GitHub Pages sem configuração extra (ou Vercel/Netlify).
