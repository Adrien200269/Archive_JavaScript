import './globals.css'
import { Metadata } from 'next'
import { AuthProvider } from './context/AuthContext'

export const metadata: Metadata = {
  title: 'Archive Outfitters',
  description: 'Style Your Vibe',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
