-- Casa Lumiar — rode este arquivo no Supabase: SQL Editor > New query > Run.
-- Depois crie o usuário do painel em Authentication > Users > Add user (e-mail + senha).

create table if not exists categories (
  id text primary key,
  name text not null,
  icon text not null default '',
  sort int not null default 0
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  sku text not null default '',
  name text not null,
  description text not null default '',
  notes text[] not null default '{}',
  category_id text references categories(id),
  price numeric(10,2) not null default 0,
  pix_price numeric(10,2),
  stock int not null default 0 check (stock >= 0),
  image_url text,
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Tamanhos com preço próprio (perfumes), inspiração e pirâmide olfativa.
-- 'add column if not exists' também atualiza um banco criado antes desta versão.
alter table products add column if not exists sizes jsonb not null default '[]';
alter table products add column if not exists inspiration text not null default '';
alter table products add column if not exists pyramid jsonb;

create table if not exists orders (
  id uuid primary key,
  code text not null,
  customer_name text not null default '',
  phone text not null default '',
  delivery text not null check (delivery in ('entrega','retirada','balcao')),
  address text not null default '',
  payment text not null default '',
  notes text not null default '',
  items jsonb not null,
  total numeric(10,2) not null,
  status text not null default 'novo' check (status in ('novo','confirmado','entregue','cancelado')),
  source text not null default 'catalogo' check (source in ('catalogo','balcao')),
  created_at timestamptz not null default now()
);

alter table categories enable row level security;
alter table products enable row level security;
alter table orders enable row level security;

-- Público (cliente do catálogo): lê categorias e produtos ativos; cria pedidos "novo" do catálogo.
create policy "public read categories" on categories for select using (true);
create policy "public read products" on products for select using (active = true or auth.uid() is not null);
create policy "public create catalog order" on orders for insert to anon
  with check (source = 'catalogo' and status = 'novo');

-- Dono (logado): tudo.
create policy "admin categories" on categories for all to authenticated using (true) with check (true);
create policy "admin products" on products for all to authenticated using (true) with check (true);
create policy "admin orders" on orders for all to authenticated using (true) with check (true);

-- Baixa (sign = 1) ou devolução (sign = -1) de estoque. Só para usuário logado.
create or replace function apply_stock(p_items jsonb, p_sign int) returns void
language plpgsql security definer set search_path = public as $$
declare it jsonb;
begin
  if auth.uid() is null then raise exception 'not authorized'; end if;
  for it in select * from jsonb_array_elements(p_items) loop
    update products
       set stock = greatest(0, stock - p_sign * (it->>'qty')::int)
     where id = (it->>'id')::uuid;
  end loop;
end $$;

insert into categories (id, name, icon, sort) values
  ('perfumes-femininos','Perfumes Femininos','',1), ('perfumes-masculinos','Perfumes Masculinos','',2),
  ('velas','Velas','',3), ('home-spray','Home Spray','',4),
  ('difusores','Difusores','',5), ('kits','Kits','',6)
on conflict (id) do update set name = excluded.name, sort = excluded.sort;
