-- Produtos iniciais da Casa Lumiar (aromas do documento de identidade).
-- Rode DEPOIS do schema.sql. Preços de Home Spray/Difusor são provisórios: ajuste no painel.
-- Gerado a partir de src/lib/seed.ts. Pode rodar de novo: não duplica (usa o SKU).

insert into products (sku, name, description, notes, category_id, price, pix_price, stock, featured)
select v.* from (values
  ('VEL-001', 'Vela Clarear', 'Leve e limpo, como lençol recém-lavado.', array['Chá branco']::text[], 'velas', 62.5, 50, 12, true),
  ('SPR-001', 'Home Spray Clarear', 'Leve e limpo, como lençol recém-lavado.', array['Chá branco']::text[], 'home-spray', 39.9, 35, 8, false),
  ('DIF-001', 'Difusor Clarear', 'Leve e limpo, como lençol recém-lavado.', array['Chá branco']::text[], 'difusores', 54.9, 48, 6, false),
  ('VEL-002', 'Vela Conforto de Criança', 'Floral macio que lembra colo e cuidado.', array['Jasmim','Rosa','Ylang Ylang']::text[], 'velas', 62.5, 50, 12, true),
  ('VEL-003', 'Vela Amazônia Viva', 'Frutas amazônicas, energia e frescor tropical.', array['Cupuaçu','Guaraná']::text[], 'velas', 62.5, 50, 12, true),
  ('SPR-003', 'Home Spray Amazônia Viva', 'Frutas amazônicas, energia e frescor tropical.', array['Cupuaçu','Guaraná']::text[], 'home-spray', 39.9, 35, 8, false),
  ('VEL-004', 'Vela Delícia de Morango', 'Doce cremoso e irresistível.', array['Morango','Iogurte']::text[], 'velas', 62.5, 50, 12, true),
  ('DIF-004', 'Difusor Delícia de Morango', 'Doce cremoso e irresistível.', array['Morango','Iogurte']::text[], 'difusores', 54.9, 48, 6, false),
  ('VEL-005', 'Vela Explosão Tropical', 'Cítrico vibrante com fundo frutado.', array['Laranja sanguínea','Mandarina verde','Framboesa']::text[], 'velas', 62.5, 50, 12, false),
  ('SPR-005', 'Home Spray Explosão Tropical', 'Cítrico vibrante com fundo frutado.', array['Laranja sanguínea','Mandarina verde','Framboesa']::text[], 'home-spray', 39.9, 35, 8, false),
  ('VEL-006', 'Vela Império Oriental', 'Especiado e envolvente, de presença marcante.', array['Canela','Tomilho','Lavanda','Rosa','Menta','Musk','Patchouli','Madeira de guaiaco']::text[], 'velas', 62.5, 50, 12, false),
  ('VEL-007', 'Vela Charme & Aroma', 'Frutal elegante com toque âmbar.', array['Folha de abacaxi','Notas florais','Âmbar cristal']::text[], 'velas', 62.5, 50, 12, false),
  ('SPR-007', 'Home Spray Charme & Aroma', 'Frutal elegante com toque âmbar.', array['Folha de abacaxi','Notas florais','Âmbar cristal']::text[], 'home-spray', 39.9, 35, 8, false),
  ('DIF-007', 'Difusor Charme & Aroma', 'Frutal elegante com toque âmbar.', array['Folha de abacaxi','Notas florais','Âmbar cristal']::text[], 'difusores', 54.9, 48, 6, false),
  ('VEL-008', 'Vela Doce Dourado', 'Baunilha quente e acolhedora.', array['Vanilla']::text[], 'velas', 62.5, 50, 12, false),
  ('VEL-009', 'Vela Doce Lar', 'O cheiro de casa cuidada.', array['Notas doces','Baunilha','Musk','Peônia','Âmbar']::text[], 'velas', 62.5, 50, 12, false),
  ('SPR-009', 'Home Spray Doce Lar', 'O cheiro de casa cuidada.', array['Notas doces','Baunilha','Musk','Peônia','Âmbar']::text[], 'home-spray', 39.9, 35, 8, false),
  ('VEL-010', 'Vela Aura Rosé', 'Tropical sofisticado.', array['Abacaxi','Ylang Ylang','Patchouli']::text[], 'velas', 62.5, 50, 12, false),
  ('DIF-010', 'Difusor Aura Rosé', 'Tropical sofisticado.', array['Abacaxi','Ylang Ylang','Patchouli']::text[], 'difusores', 54.9, 48, 6, false),
  ('VEL-011', 'Vela Limão Siciliano', 'Cítrico fresco e revigorante.', array['Limão siciliano']::text[], 'velas', 62.5, 50, 12, false),
  ('SPR-011', 'Home Spray Limão Siciliano', 'Cítrico fresco e revigorante.', array['Limão siciliano']::text[], 'home-spray', 39.9, 35, 8, false),
  ('VEL-012', 'Vela Morango com Champanhe', 'Festivo, doce e borbulhante.', array['Morango','Champanhe']::text[], 'velas', 62.5, 50, 12, false),
  ('VEL-013', 'Vela Orquídea Negra', 'Floral profundo e misterioso.', array['Orquídea']::text[], 'velas', 62.5, 50, 12, false),
  ('SPR-013', 'Home Spray Orquídea Negra', 'Floral profundo e misterioso.', array['Orquídea']::text[], 'home-spray', 39.9, 35, 8, false),
  ('DIF-013', 'Difusor Orquídea Negra', 'Floral profundo e misterioso.', array['Orquídea']::text[], 'difusores', 54.9, 48, 6, false),
  ('VEL-014', 'Vela Maracujá Azedo', 'Azedinho tropical e alegre.', array['Maracujá']::text[], 'velas', 62.5, 50, 12, false),
  ('VEL-015', 'Vela Lavanda Âmbar', 'Relaxante com fundo quente.', array['Lavanda','Âmbar']::text[], 'velas', 62.5, 50, 12, false),
  ('SPR-015', 'Home Spray Lavanda Âmbar', 'Relaxante com fundo quente.', array['Lavanda','Âmbar']::text[], 'home-spray', 39.9, 35, 8, false),
  ('VEL-016', 'Vela Bosque Boreal', 'Floresta fria: verde, amadeirado e limpo.', array['Campanula','Lítsea cubeba','Eucalipto globulus','Cedro','Almíscar']::text[], 'velas', 62.5, 50, 12, false),
  ('DIF-016', 'Difusor Bosque Boreal', 'Floresta fria: verde, amadeirado e limpo.', array['Campanula','Lítsea cubeba','Eucalipto globulus','Cedro','Almíscar']::text[], 'difusores', 54.9, 48, 6, false)
) as v(sku, name, description, notes, category_id, price, pix_price, stock, featured)
where not exists (select 1 from products p where p.sku = v.sku);
