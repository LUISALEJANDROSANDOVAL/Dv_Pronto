import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from "sonner"

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Pronto Bolivia AI - Dashboard',
  description: 'Sistema inteligente de triaje y atención automatizada para WhatsApp',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark bg-background">
      <body className="font-sans antialiased min-h-screen bg-background">
        {children}
        <Toaster position="top-right" theme="dark" richColors />
      </body>
    </html>
  )
}
