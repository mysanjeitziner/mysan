import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'mySan Jeitziner – Sanitär & Heizung im Wallis',
  description:
    'mySan Jeitziner – Ihr Ansprechpartner für Sanitär und Heizung im Wallis.',
  icons: {
    icon: '/icon.jpg',
    shortcut: '/icon.jpg',
    apple: '/icon.jpg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  )
}