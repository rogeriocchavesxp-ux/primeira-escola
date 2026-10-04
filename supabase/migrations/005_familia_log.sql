-- =============================================
-- Primeira Escola — Log Familiar
-- =============================================

-- MEMBROS / BENS DA FAMÍLIA
CREATE TABLE public.familia_membros (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome       text NOT NULL,
  tipo       text NOT NULL DEFAULT 'pessoa'
             CHECK (tipo IN ('pessoa','veiculo','imovel','pet','outro')),
  relacao    text,
  emoji      text NOT NULL DEFAULT '👤',
  nascimento date,
  notas      text,
  ativo      boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.familia_membros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner only" ON public.familia_membros
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- REGISTROS (log de eventos)
CREATE TABLE public.familia_registros (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  membro_id     uuid REFERENCES public.familia_membros(id) ON DELETE SET NULL,
  categoria     text NOT NULL DEFAULT 'outro'
                CHECK (categoria IN ('medico','veiculo','escola','visita','casa','financeiro','outro')),
  titulo        text NOT NULL,
  descricao     text,
  data_evento   date NOT NULL,
  data_proximo  date,
  status        text NOT NULL DEFAULT 'realizado'
                CHECK (status IN ('realizado','agendado','cancelado')),
  local         text,
  profissional  text,
  valor         numeric(10,2),
  tags          text[] DEFAULT '{}',
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

ALTER TABLE public.familia_registros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner only" ON public.familia_registros
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Índices úteis
CREATE INDEX familia_registros_user_idx    ON public.familia_registros(user_id);
CREATE INDEX familia_registros_proximo_idx ON public.familia_registros(user_id, data_proximo)
  WHERE data_proximo IS NOT NULL;
CREATE INDEX familia_membros_user_idx      ON public.familia_membros(user_id);

-- GRANTs
GRANT ALL ON public.familia_membros   TO authenticated;
GRANT ALL ON public.familia_registros TO authenticated;
