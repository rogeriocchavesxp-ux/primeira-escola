import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default:  'Primeira Escola',
    template: '%s · Primeira Escola',
  },
  description: 'Recursos bíblicos e reformados para a família cristã.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://primeiraescola.com.br'),
  openGraph: {
    type:   'website',
    locale: 'pt_BR',
    siteName: 'Primeira Escola',
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        <div style={{ minHeight: 'calc(100vh - 60px)' }}>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}
