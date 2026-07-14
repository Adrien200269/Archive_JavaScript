import './globals.css'
import { Metadata } from 'next'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from '../lib/i18n/context'
import ChatBot from './components/ChatBot'

export const metadata: Metadata = {
  title: 'Archive Outfitters',
  description: 'Style Your Vibe',
  icons: {
    icon: '/abc.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              {children}
              <ChatBot />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
