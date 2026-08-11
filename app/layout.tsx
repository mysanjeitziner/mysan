
import type { Metadata } from 'next'
import './globals.css'

import SiteHeader from '@/components/site-header'
import CookieBanner from '@/components/cookie-banner'

export const metadata: Metadata = {
  title: 'mySan Jeitziner GmbH',
  description:
    'Sanitär und Heizung – mySan Jeitziner GmbH in Gamsen.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de">
      <body>

        <SiteHeader />

        {children}

        <CookieBanner />

      </body>
    </html>
  )
}