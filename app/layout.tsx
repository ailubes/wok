import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './index.css'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'

// 1. Manrope: Main UI font (Buttons, Nav, Headers) - Variable font
const manrope = localFont({
  src: './fonts/Manrope/Manrope-VariableFont_wght.ttf',
  variable: '--font-sans',
  display: 'swap',
})

// 2. Lora: For Law Text/Articles (Serif) - Variable font
const lora = localFont({
  src: './fonts/Lora/Lora-VariableFont_wght.ttf',
  variable: '--font-serif',
  display: 'swap',
})

// 3. IBM Plex Mono: For IDs, Dates, Code (Monospace) - Regular weight
const ibmPlexMono = localFont({
  src: './fonts/IBM_Plex_Mono/IBMPlexMono-Regular.ttf',
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Wok - Платформа для опрацювання законопроєктів',
  description: 'Колективне опрацювання законодавчих ініціатив',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk" suppressHydrationWarning className={`${manrope.variable} ${lora.variable} ${ibmPlexMono.variable}`}>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
