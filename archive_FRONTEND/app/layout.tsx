import './globals.css'
import { Metadata } from 'next'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'

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
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
