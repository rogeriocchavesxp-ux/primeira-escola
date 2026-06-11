import type { Metadata } from 'next'
import Link from 'next/link'
import { getArtigosPublicados, getTrilhasPublicadas } from '@/lib/db'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Primeira Escola — Formação familiar cristã',
  description: 'Recursos bíblicos e reformados para a família cristã. Trilhas de formação, artigos, catecismos e guias.',
}

const PILARES = [
  { slug: 'fundamentos',          nome: 'Fundamentos',       desc: 'Base bíblica e teológica da família' },
  { slug: 'casamento',             nome: 'Casamento',         desc: 'Formação e cuidado do casal' },
  { slug: 'filhos',                nome: 'Filhos',            desc: 'Instrução e formação dos filhos' },
  { slug: 'culto-devocao',         nome: 'Culto e Devoção',   desc: 'Vida espiritual do lar' },
  { slug: 'cultura-contracorrente', nome: 'Cultura',          desc: 'Discernimento e cosmovisão cristã' },
  { slug: 'legado',                nome: 'Legado',            desc: 'Transmissão geracional da fé' },
]

const PERSONAS = [
  { label: 'Sou Pai',       desc: 'Lidere sua família com fé',         href: '/trilhas?para=pai' },
  { label: 'Sou Mãe',       desc: 'Forme seus filhos na Palavra',       href: '/trilhas?para=mae' },
  { label: 'Somos Casal',   desc: 'Construa um lar bíblico',            href: '/trilhas?para=casal' },
  { label: 'Sou Educador',  desc: 'Ensine com fundamento',              href: '/trilhas?para=educador' },
  { label: 'Sou Pastor',    desc: 'Recursos para recomendar',           href: '/trilhas?para=pastor' },
]

export default async function HomePage() {
  const [destaques, recentes, trilhas] = await Promise.all([
    getArtigosPublicados({ destaque: true, limit: 3 }),
    getArtigosPublicados({ limit: 6 }),
    getTrilhasPublicadas(),
  ])

  const destaquesIds = new Set(destaques.map(a => a.id))
  const naoDestaques = recentes.filter(a => !destaquesIds.has(a.id)).slice(0, 6)
  const semArtigos = destaques.length === 0 && naoDestaques.length === 0

  return (
    <main>

      {/* ── 1. Hero ──────────────────────────────────────────────── */}
      <section style={{ background: 'var(--brand)', color: '#fff', padding: '5rem 1.5rem 4rem' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent-light)', fontFamily: 'system-ui, sans-serif', marginBottom: '1.25rem' }}>
            FORMAÇÃO FAMILIAR CRISTÃ
          </p>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.6rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: '1.25rem' }}>
            A família é a primeira escola<br />instituída por Deus.
          </h1>
          <p style={{ fontSize: '1.0625rem', opacity: 0.8, lineHeight: 1.75, fontFamily: 'system-ui, sans-serif', marginBottom: '2.25rem', maxWidth: 520, margin: '0 auto 2.25rem' }}>
            Equipamos pais, mães e educadores com recursos bíblicos sólidos para cada fase da vida familiar.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#comece-aqui" style={{
              display: 'inline-block', background: 'var(--accent)', color: '#fff',
              padding: '0.75rem 2rem', borderRadius: 8, fontWeight: 700,
              fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', textDecoration: 'none',
            }}>
              Comece por aqui
            </a>
            <Link href="/trilhas" style={{
              display: 'inline-block', color: 'rgba(255,255,255,0.7)',
              padding: '0.75rem 1.5rem', borderRadius: 8, fontWeight: 500,
              fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.2)',
            }}>
              Ver trilhas
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. Nossa Convicção ───────────────────────────────────── */}
      <section style={{ background: 'var(--brand-surface)', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p style={sectionLabel}>NOSSA CONVICÇÃO</p>
          <h2 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.75rem)', fontWeight: 700, lineHeight: 1.3, marginBottom: '1.25rem' }}>
            Teologia bíblica para a vida real da família.
          </h2>
          <p style={{ color: 'var(--text-2)', lineHeight: 1.8, fontFamily: 'system-ui, sans-serif', marginBottom: '1.75rem' }}>
            Existe escassez de material bíblico sólido para famílias. Grande parte do que existe é superficial, psicologizado ou motivacional. A Primeira Escola existe para oferecer o que falta: conteúdo profundamente bíblico, teologicamente sólido e pastoralmente aplicável.
          </p>
          <blockquote style={{
            borderLeft: '3px solid var(--accent)', paddingLeft: '1.25rem',
            margin: '0', fontStyle: 'italic', color: 'var(--text-2)',
          }}>
            <p style={{ marginBottom: '0.4rem', lineHeight: 1.7 }}>
              "Estas palavras que hoje te ordeno estarão no teu coração; e as ensinarás diligentemente a teus filhos, e delas falarás sentado em tua casa, e andando pelo caminho..."
            </p>
            <footer style={{ fontSize: '0.8rem', fontStyle: 'normal', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif' }}>
              Deuteronômio 6.6–7
            </footer>
          </blockquote>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '2.5rem' }}>
            {[
              { titulo: 'Bíblico', desc: 'Fundamentado nas Escrituras, não em tendências' },
              { titulo: 'Sólido', desc: 'Ancorado na teologia histórica reformada' },
              { titulo: 'Aplicável', desc: 'Para a vida real da sua família' },
            ].map(p => (
              <div key={p.titulo}>
                <p style={{ fontWeight: 800, fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brand)', fontFamily: 'system-ui, sans-serif', marginBottom: '0.35rem' }}>
                  {p.titulo}
                </p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', fontFamily: 'system-ui, sans-serif', lineHeight: 1.6 }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Comece Aqui ───────────────────────────────────────── */}
      <section id="comece-aqui" style={{ padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: 'var(--max-w-wide)', margin: '0 auto' }}>
          <p style={sectionLabel}>COMECE POR AQUI</p>
          <h2 style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)', fontWeight: 700, marginBottom: '0.5rem' }}>
            Encontre o caminho certo para a sua situação.
          </h2>
          <p style={{ color: 'var(--text-2)', fontFamily: 'system-ui, sans-serif', marginBottom: '2rem', fontSize: '0.9rem' }}>
            A Primeira Escola tem trilhas e recursos para cada momento da vida familiar.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
            {PERSONAS.map(p => (
              <Link key={p.label} href={p.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 12, padding: '1.5rem 1.25rem',
                  height: '100%', transition: 'border-color 0.15s',
                }}>
                  <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.4rem', color: 'var(--brand)' }}>
                    {p.label}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif', lineHeight: 1.5 }}>
                    {p.desc}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--accent)', fontFamily: 'system-ui, sans-serif', marginTop: '0.75rem', fontWeight: 600 }}>
                    Explorar →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Pilares ───────────────────────────────────────────── */}
      <section style={{ background: 'var(--brand-surface)', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: 'var(--max-w-wide)', margin: '0 auto' }}>
          <p style={sectionLabel}>ÁREAS DE FORMAÇÃO</p>
          <h2 style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)', fontWeight: 700, marginBottom: '2rem' }}>
            Seis pilares para a formação familiar completa.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
            {PILARES.map(p => (
              <Link key={p.slug} href={`/artigos?area=${p.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 10, padding: '1.25rem 1.5rem',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem',
                }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem', color: 'var(--brand)' }}>
                      {p.nome}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif' }}>
                      {p.desc}
                    </p>
                  </div>
                  <span style={{ color: 'var(--accent)', fontWeight: 700, flexShrink: 0 }}>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Trilhas ───────────────────────────────────────────── */}
      <section style={{ padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: 'var(--max-w-wide)', margin: '0 auto' }}>
          <p style={sectionLabel}>TRILHAS DE FORMAÇÃO</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)', fontWeight: 700 }}>
              Percursos estruturados para cada fase.
            </h2>
            {trilhas.length > 0 && (
              <Link href="/trilhas" style={{ fontSize: '0.82rem', color: 'var(--brand)', fontFamily: 'system-ui, sans-serif' }}>
                Ver todas →
              </Link>
            )}
          </div>

          {trilhas.length === 0 ? (
            <div style={{
              background: 'var(--brand-surface)', borderRadius: 12, padding: '2.5rem',
              textAlign: 'center', border: '1px dashed var(--border)',
            }}>
              <p style={{ fontWeight: 700, color: 'var(--brand)', marginBottom: '0.5rem' }}>
                Trilhas em preparação.
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif', marginBottom: '1.25rem' }}>
                Cada trilha é um percurso de 4 a 8 semanas. Estamos finalizando o conteúdo.
              </p>
              <a href="#newsletter" style={{
                display: 'inline-block', background: 'var(--brand)', color: '#fff',
                padding: '0.55rem 1.5rem', borderRadius: 7, fontSize: '0.82rem',
                fontWeight: 700, fontFamily: 'system-ui, sans-serif', textDecoration: 'none',
              }}>
                Avisar no lançamento
              </a>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {(trilhas as Array<Record<string, unknown>>).slice(0, 6).map(t => (
                <Link key={t.id as string} href={`/trilhas/${t.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 12, padding: '1.5rem', height: '100%',
                    display: 'flex', flexDirection: 'column',
                  }}>
                    <p style={{ fontWeight: 700, fontSize: '1.0rem', marginBottom: '0.35rem', color: 'var(--brand)' }}>
                      {t.titulo as string}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif', marginBottom: '0.75rem' }}>
                      Para: {t.para_quem as string}
                    </p>
                    {!!(t.descricao) && (
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.6, flex: 1, fontFamily: 'system-ui, sans-serif' }}>
                        {(t.descricao as string).slice(0, 100)}{(t.descricao as string).length > 100 ? '…' : ''}
                      </p>
                    )}
                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {t.duracao_semanas ? (
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif' }}>
                          {t.duracao_semanas as number} semanas
                        </p>
                      ) : <span />}
                      <span style={{ color: 'var(--accent)', fontSize: '0.875rem', fontWeight: 700 }}>Iniciar →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 6. Artigos Recentes ──────────────────────────────────── */}
      <section style={{ background: 'var(--brand-surface)', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: 'var(--max-w-wide)', margin: '0 auto' }}>
          <p style={sectionLabel}>ARTIGOS</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)', fontWeight: 700 }}>
              Reflexões para a família cristã.
            </h2>
            {!semArtigos && (
              <Link href="/artigos" style={{ fontSize: '0.82rem', color: 'var(--brand)', fontFamily: 'system-ui, sans-serif' }}>
                Ver todos →
              </Link>
            )}
          </div>

          {semArtigos ? (
            <div style={{
              background: 'var(--surface)', borderRadius: 12, padding: '2.5rem',
              border: '1px dashed var(--border)',
            }}>
              <p style={{ fontWeight: 700, color: 'var(--brand)', marginBottom: '0.5rem' }}>
                Artigos em preparação.
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif', marginBottom: '1.25rem' }}>
                Enquanto preparamos o conteúdo, explore nossa Biblioteca — catecismos e confissões históricas já disponíveis.
              </p>
              <Link href="/biblioteca" style={{
                display: 'inline-block', border: '1px solid var(--brand)', color: 'var(--brand)',
                padding: '0.5rem 1.25rem', borderRadius: 7, fontSize: '0.82rem',
                fontWeight: 700, fontFamily: 'system-ui, sans-serif',
              }}>
                Acessar Biblioteca →
              </Link>
            </div>
          ) : (
            <>
              {destaques.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  {destaques.map(a => <ArtigoCard key={a.id} artigo={a} featured />)}
                </div>
              )}
              {naoDestaques.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.85rem' }}>
                  {naoDestaques.map(a => <ArtigoCard key={a.id} artigo={a} />)}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── 7. Biblioteca ────────────────────────────────────────── */}
      <section style={{ background: 'var(--brand)', color: '#fff', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: 'var(--max-w-wide)', margin: '0 auto' }}>
          <p style={{ ...sectionLabel, color: 'var(--accent-light)' }}>BIBLIOTECA</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)', fontWeight: 700, marginBottom: '0.5rem' }}>
                Acervo permanente. Gratuito.
              </h2>
              <p style={{ fontSize: '0.9rem', opacity: 0.75, fontFamily: 'system-ui, sans-serif', maxWidth: 480 }}>
                Catecismos históricos, confissões de fé, guias práticos e recursos para a formação familiar.
              </p>
            </div>
            <Link href="/biblioteca" style={{
              display: 'inline-block', border: '1px solid rgba(255,255,255,0.3)', color: '#fff',
              padding: '0.55rem 1.25rem', borderRadius: 7, fontSize: '0.82rem',
              fontWeight: 600, fontFamily: 'system-ui, sans-serif', flexShrink: 0,
            }}>
              Acessar biblioteca →
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
            {[
              { nome: 'Catecismos',      slug: 'catecismos' },
              { nome: 'Confissões',      slug: 'confissoes' },
              { nome: 'Guias Práticos',  slug: 'guias-praticos' },
              { nome: 'E-books',         slug: 'ebooks' },
            ].map(cat => (
              <Link key={cat.slug} href={`/biblioteca/${cat.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 10, padding: '1.1rem 1.25rem',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>{cat.nome}</p>
                  <span style={{ color: 'var(--accent-light)', fontWeight: 700 }}>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Recursos Gratuitos ────────────────────────────────── */}
      <section style={{ padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: 'var(--max-w-wide)', margin: '0 auto' }}>
          <p style={sectionLabel}>RECURSOS GRATUITOS</p>
          <h2 style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)', fontWeight: 700, marginBottom: '0.5rem' }}>
            Materiais para baixar e usar em família.
          </h2>
          <div style={{
            background: 'var(--brand-surface)', borderRadius: 12, padding: '2rem 2.5rem',
            border: '1px dashed var(--border)', marginTop: '1.5rem',
          }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent)', fontFamily: 'system-ui, sans-serif', marginBottom: '0.75rem' }}>
              EM PREPARAÇÃO
            </p>
            <p style={{ fontWeight: 600, color: 'var(--brand)', marginBottom: '0.4rem' }}>
              Guia do Culto Doméstico · Plano de Leitura Bíblica Familiar · Guia de Oração em Família
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif', marginBottom: '1.25rem' }}>
              Recursos gratuitos para download — disponíveis em breve.
            </p>
            <a href="#newsletter" style={{
              display: 'inline-block', background: 'var(--brand)', color: '#fff',
              padding: '0.55rem 1.5rem', borderRadius: 7, fontSize: '0.82rem',
              fontWeight: 700, fontFamily: 'system-ui, sans-serif', textDecoration: 'none',
            }}>
              Receber quando lançar
            </a>
          </div>
        </div>
      </section>

      {/* ── 9. Newsletter ────────────────────────────────────────── */}
      <section id="newsletter" style={{ background: 'var(--brand-surface)', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <p style={sectionLabel}>NEWSLETTER</p>
          <h2 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.6rem)', fontWeight: 700, marginBottom: '0.75rem' }}>
            Uma reflexão por semana para sua família.
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-2)', fontFamily: 'system-ui, sans-serif', marginBottom: '2rem', lineHeight: 1.7 }}>
            Toda quinta-feira: um artigo bíblico, uma passagem, uma aplicação. Curto. Sólido. Gratuito.
          </p>
          <NewsletterForm />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif', marginTop: '0.75rem' }}>
            Sem spam. Cancele quando quiser.
          </p>
        </div>
      </section>

      {/* ── 10. Chamada Final ────────────────────────────────────── */}
      <section style={{ background: 'var(--brand)', color: '#fff', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.3 }}>
            A formação começa em casa.
          </h2>
          <p style={{ fontSize: '0.9rem', opacity: 0.8, lineHeight: 1.75, fontFamily: 'system-ui, sans-serif', marginBottom: '2rem' }}>
            Deuteronômio 6 não é uma sugestão — é um mandato. Você não precisa esperar para começar.
          </p>
          <Link href="/trilhas" style={{
            display: 'inline-block', background: 'var(--accent)', color: '#fff',
            padding: '0.85rem 2.25rem', borderRadius: 8, fontWeight: 700,
            fontFamily: 'system-ui, sans-serif', fontSize: '0.95rem', textDecoration: 'none',
          }}>
            Ver trilhas de formação →
          </Link>
        </div>
      </section>

    </main>
  )
}

function NewsletterForm() {
  return (
    <form style={{ display: 'flex', gap: '0.5rem', maxWidth: 440, margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
      <input
        type="email"
        name="email"
        placeholder="seu@email.com"
        required
        style={{
          flex: 1, minWidth: 220, padding: '0.7rem 1rem', borderRadius: 7,
          border: '1px solid var(--border)', fontSize: '0.9rem', fontFamily: 'system-ui, sans-serif',
          background: 'var(--surface)', color: 'var(--text)', outline: 'none',
        }}
      />
      <button type="submit" style={{
        background: 'var(--brand)', color: '#fff', border: 'none', cursor: 'pointer',
        padding: '0.7rem 1.5rem', borderRadius: 7, fontWeight: 700, fontSize: '0.875rem',
        fontFamily: 'system-ui, sans-serif',
      }}>
        Quero receber
      </button>
    </form>
  )
}

function ArtigoCard({ artigo, featured }: { artigo: Record<string, unknown>; featured?: boolean }) {
  const area = artigo.area as Record<string, string> | null
  const date = artigo.publicado_em
    ? new Date(artigo.publicado_em as string).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })
    : null

  return (
    <Link href={`/artigos/${artigo.slug}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 10, padding: featured ? '1.5rem' : '1.1rem 1.25rem',
        height: '100%', display: 'flex', flexDirection: 'column',
      }}>
        {area && (
          <p style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', fontFamily: 'system-ui, sans-serif', marginBottom: '0.5rem' }}>
            {area.nome}
          </p>
        )}
        <p style={{ fontWeight: 700, fontSize: featured ? '1.05rem' : '0.9rem', lineHeight: 1.35, marginBottom: '0.5rem', color: 'var(--text)' }}>
          {artigo.titulo as string}
        </p>
        {!!artigo.resumo && (
          <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', lineHeight: 1.6, fontFamily: 'system-ui, sans-serif', flex: 1 }}>
            {(artigo.resumo as string).slice(0, 120)}{(artigo.resumo as string).length > 120 ? '…' : ''}
          </p>
        )}
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif', marginTop: '0.75rem' }}>
          {date}{artigo.tempo_leitura ? ` · ${artigo.tempo_leitura} min` : ''}
        </p>
      </div>
    </Link>
  )
}

const sectionLabel: React.CSSProperties = {
  fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.16em',
  textTransform: 'uppercase', color: 'var(--brand)',
  fontFamily: 'system-ui, sans-serif', marginBottom: '0.75rem',
}
