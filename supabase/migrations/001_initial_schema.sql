-- =============================================
-- Primeira Escola — Schema inicial
-- =============================================

-- PROFILES (admin)
CREATE TABLE public.profiles (
  id   uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email     text,
  is_admin  boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- =============================================
-- ÁREAS EDITORIAIS
-- =============================================
CREATE TABLE public.areas (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug       text UNIQUE NOT NULL,
  nome       text NOT NULL,
  descricao  text,
  ordem      integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- =============================================
-- ARTIGOS
-- =============================================
CREATE TABLE public.artigos (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug               text UNIQUE NOT NULL,
  titulo             text NOT NULL,
  subtitulo          text,
  conteudo           text,
  resumo             text,
  area_id            uuid REFERENCES public.areas(id),
  autor              text NOT NULL DEFAULT 'Primeira Escola',
  publicado          boolean NOT NULL DEFAULT false,
  destaque           boolean NOT NULL DEFAULT false,
  publicado_em       timestamptz,
  tempo_leitura      integer,
  passagens_biblicas text[],
  tags               text[],
  cover_url          text,
  seo_titulo         text,
  seo_descricao      text,
  og_image_url       text,
  created_at         timestamptz DEFAULT now(),
  updated_at         timestamptz DEFAULT now()
);

-- =============================================
-- TRILHAS
-- =============================================
CREATE TABLE public.trilhas (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug               text UNIQUE NOT NULL,
  titulo             text NOT NULL,
  descricao          text,
  para_quem          text,
  objetivo           text,
  duracao_semanas    integer,
  passagens_biblicas text[],
  publicada          boolean NOT NULL DEFAULT false,
  ordem              integer NOT NULL DEFAULT 0,
  proxima_trilha_id  uuid REFERENCES public.trilhas(id),
  cover_url          text,
  created_at         timestamptz DEFAULT now()
);

-- AULAS (artigo dentro de trilha, com ordem)
CREATE TABLE public.aulas (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trilha_id       uuid NOT NULL REFERENCES public.trilhas(id) ON DELETE CASCADE,
  artigo_id       uuid NOT NULL REFERENCES public.artigos(id),
  titulo_override text,
  ordem           integer NOT NULL,
  created_at      timestamptz DEFAULT now(),
  UNIQUE (trilha_id, ordem)
);

-- =============================================
-- BIBLIOTECA
-- =============================================
CREATE TABLE public.biblioteca_categorias (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug      text UNIQUE NOT NULL,
  nome      text NOT NULL,
  descricao text,
  ordem     integer NOT NULL DEFAULT 0
);

CREATE TABLE public.biblioteca_itens (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          text UNIQUE NOT NULL,
  titulo        text NOT NULL,
  descricao     text,
  categoria_id  uuid REFERENCES public.biblioteca_categorias(id),
  tipo          text NOT NULL CHECK (tipo IN ('catecismo','confissao','credo','estudo','guia','ebook','lista_leitura')),
  conteudo      text,
  conteudo_json jsonb,
  arquivo_url   text,
  publicado     boolean NOT NULL DEFAULT false,
  destaque      boolean NOT NULL DEFAULT false,
  ordem         integer NOT NULL DEFAULT 0,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- =============================================
-- NEWSLETTER
-- =============================================
CREATE TABLE public.newsletter_inscritos (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email       text UNIQUE NOT NULL,
  nome        text,
  ativo       boolean NOT NULL DEFAULT true,
  inscrito_em timestamptz DEFAULT now()
);

-- =============================================
-- TRIGGERS updated_at
-- =============================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER artigos_updated_at
  BEFORE UPDATE ON public.artigos
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

CREATE TRIGGER biblioteca_itens_updated_at
  BEFORE UPDATE ON public.biblioteca_itens
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_artigos_area        ON public.artigos (area_id);
CREATE INDEX idx_artigos_publicado   ON public.artigos (publicado, publicado_em DESC);
CREATE INDEX idx_artigos_destaque    ON public.artigos (destaque) WHERE destaque = true;
CREATE INDEX idx_aulas_trilha        ON public.aulas (trilha_id, ordem);
CREATE INDEX idx_biblioteca_cat      ON public.biblioteca_itens (categoria_id);
CREATE INDEX idx_biblioteca_tipo     ON public.biblioteca_itens (tipo);
CREATE INDEX idx_biblioteca_pub      ON public.biblioteca_itens (publicado);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE public.profiles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.areas                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artigos              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trilhas              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aulas                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biblioteca_categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biblioteca_itens     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_inscritos ENABLE ROW LEVEL SECURITY;

-- Perfil: usuário vê o próprio
CREATE POLICY "profiles_self" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

-- Áreas: leitura pública
CREATE POLICY "areas_public_read" ON public.areas
  FOR SELECT USING (true);

-- Artigos: leitura pública só dos publicados
CREATE POLICY "artigos_public_read" ON public.artigos
  FOR SELECT TO anon USING (publicado = true);

-- Artigos: admin faz tudo
CREATE POLICY "artigos_admin_all" ON public.artigos
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

-- Trilhas: leitura pública só das publicadas
CREATE POLICY "trilhas_public_read" ON public.trilhas
  FOR SELECT TO anon USING (publicada = true);

CREATE POLICY "trilhas_admin_all" ON public.trilhas
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

-- Aulas: leitura pública
CREATE POLICY "aulas_public_read" ON public.aulas
  FOR SELECT USING (true);

CREATE POLICY "aulas_admin_all" ON public.aulas
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

-- Biblioteca categorias: leitura pública
CREATE POLICY "biblioteca_cat_public_read" ON public.biblioteca_categorias
  FOR SELECT USING (true);

CREATE POLICY "biblioteca_cat_admin_all" ON public.biblioteca_categorias
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

-- Biblioteca itens: leitura pública só dos publicados
CREATE POLICY "biblioteca_itens_public_read" ON public.biblioteca_itens
  FOR SELECT TO anon USING (publicado = true);

CREATE POLICY "biblioteca_itens_admin_all" ON public.biblioteca_itens
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

-- Newsletter: inserção pública, leitura só admin
CREATE POLICY "newsletter_public_insert" ON public.newsletter_inscritos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "newsletter_admin_read" ON public.newsletter_inscritos
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));
