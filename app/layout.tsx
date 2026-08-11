import type { Metadata } from 'next'
import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'mySan Jeitziner – Sanitär & Heizung im Wallis',
  description:
    'mySan Jeitziner – Ihr Ansprechpartner für Sanitär und Heizung im Wallis.',
  icons: {
    icon: '/icon.jpg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-white text-neutral-900 antialiased">
        <SiteHeader />

        <main className="min-h-screen">
          {children}
        </main>

        <SiteFooter />
      </body>
    </html>
  )
}