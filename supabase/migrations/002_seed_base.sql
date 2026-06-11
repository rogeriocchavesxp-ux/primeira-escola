-- =============================================
-- Primeira Escola — Seed base
-- =============================================

-- ÁREAS EDITORIAIS
INSERT INTO public.areas (slug, nome, descricao, ordem) VALUES
  ('fundamentos',            'Fundamentos',              'Base teológica para a vida familiar',                    1),
  ('casamento',              'Casamento',                'Fundamentos bíblicos do casamento',                      2),
  ('filhos',                 'Filhos',                   'Educação e instrução espiritual dos filhos',              3),
  ('culto-devocao',          'Culto e Devoção',          'Culto doméstico, oração e devoção familiar',             4),
  ('cultura-contracorrente', 'Cultura e Contracorrente', 'Como navegar a cultura à luz da Escritura',              5),
  ('legado',                 'Legado',                   'Transmissão geracional da fé',                           6)
ON CONFLICT (slug) DO NOTHING;

-- CATEGORIAS DA BIBLIOTECA
INSERT INTO public.biblioteca_categorias (slug, nome, descricao, ordem) VALUES
  ('catecismos',      'Catecismos',          'Catecismos históricos para uso familiar',         1),
  ('confissoes',      'Confissões e Credos', 'Confissões e credos da fé reformada',             2),
  ('estudos',         'Estudos Bíblicos',    'Estudos por livro e por tema',                    3),
  ('guias',           'Guias Práticos',      'Guias para download e uso imediato',              4),
  ('ebooks',          'E-books',             'Recursos digitais gratuitos',                     5),
  ('listas-leitura',  'Listas de Leitura',   'Livros recomendados por tema e fase de vida',     6)
ON CONFLICT (slug) DO NOTHING;

-- TRILHAS (estrutura base, sem aulas ainda)
INSERT INTO public.trilhas (slug, titulo, para_quem, objetivo, duracao_semanas, passagens_biblicas, ordem) VALUES
  ('fundamentos-fe-familiar', 'Fundamentos da Fé Familiar',
   'Qualquer família cristã, em qualquer fase',
   'Construir o alicerce bíblico-teológico para a vida familiar',
   8, ARRAY['Gn 1-2', 'Dt 6', 'Ef 5-6'], 1),

  ('casamento-solido', 'Casamento Sólido',
   'Casais em qualquer fase do casamento',
   'Fundamentos bíblicos do casamento, papéis, comunicação e fidelidade',
   8, ARRAY['Gn 2', 'Pv 31', 'Ef 5', '1 Pe 3'], 2),

  ('pais-filhos-pequenos', 'Pais de Filhos Pequenos',
   'Pais com filhos de 0 a 6 anos',
   'Iniciar a instrução espiritual nos primeiros anos de vida',
   6, ARRAY['Dt 6', 'Sl 127', 'Pv 22.6'], 3),

  ('educando-na-fe', 'Educando na Fé',
   'Pais de filhos de 7 a 12 anos',
   'Integrar fé, cosmovisão e educação na fase formativa',
   6, ARRAY['Dt 6', 'Sl 78', 'Pv 4'], 4),

  ('adolescentes-fe', 'Adolescentes e a Fé',
   'Pais de adolescentes de 13 a 18 anos',
   'Manter o diálogo e a transmissão da fé na adolescência',
   6, ARRAY['Sl 119', '2 Tm 2', 'Ec 12'], 5),

  ('culto-domestico', 'Culto Doméstico',
   'Famílias que querem começar ou estruturar o culto em casa',
   'Implementar o culto doméstico de forma sustentável',
   5, ARRAY['Dt 6', 'Js 24', 'At 2'], 6),

  ('catecismo-familia', 'Catecismo em Família',
   'Pais que querem ensinar doutrina de forma estruturada',
   'Usar os catecismos históricos na instrução familiar',
   4, ARRAY['Dt 6', '2 Tm 3.16-17'], 7),

  ('novo-na-fe', 'Novo na Fé',
   'Convertidos recentes com família',
   'Fundamentos para viver a fé em casa sem imposição nem omissão',
   6, ARRAY['1 Pe 3', '1 Co 7', 'Lc 15'], 8),

  ('legado-geracional', 'Legado Geracional',
   'Avós e pais na segunda metade da vida',
   'Transmitir a fé às gerações de forma intencional',
   5, ARRAY['Sl 78', 'Pv 13.22', 'Tt 2'], 9),

  ('familia-sob-pressao', 'Família sob Pressão',
   'Famílias em crise, dificuldade, luto ou separação',
   'Encontrar âncoras bíblicas em momentos de dor',
   NULL, ARRAY['Sl 46', 'Rm 8', '2 Co 1'], 10)

ON CONFLICT (slug) DO NOTHING;
