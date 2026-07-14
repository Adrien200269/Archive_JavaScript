'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { chatService } from '@/lib/api/chat'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

interface Message {
  role: 'user' | 'bot'
  text: string
}

export default function ChatBot() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) return null
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Hi! I\'m your Archive Outfitters assistant. Ask me about our clothing, your orders, or your account!' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading) return

    setInput('')
    setMessages(prev => [...prev, { role: 'user', text }])
    setLoading(true)

    try {
      const reply = await chatService.sendMessage(text)
      setMessages(prev => [...prev, { role: 'bot', text: reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          border: 'none',
          background: isDark ? '#fff' : '#111',
          color: isDark ? '#111' : '#fff',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: isDark ? '0 4px 16px rgba(255,255,255,0.25)' : '0 4px 16px rgba(0,0,0,0.35)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s',
        }}
        title="Chat with us"
      >
        {open ? '✕' : '💬'}
      </button>

      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: '92px',
            right: '24px',
            width: '360px',
            height: '520px',
            background: isDark ? '#1a1a1a' : '#fff',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: isDark ? '1px solid #333' : '1px solid #e0e0e0',
          }}
        >
          <div
            style={{
              background: '#111',
              color: '#fff',
              padding: '16px 20px',
              fontWeight: 700,
              fontSize: '15px',
            }}
          >
            Archive Outfitters Assistant
            {user && (
              <span style={{ fontSize: '12px', fontWeight: 400, opacity: 0.8, display: 'block' }}>
                {user.fullName}
              </span>
            )}
          </div>

          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              background: isDark ? '#222' : '#f8f9fa',
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  padding: '10px 14px',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.role === 'user' ? '#111' : isDark ? '#2a2a2a' : '#fff',
                  color: msg.role === 'user' ? '#fff' : isDark ? '#eee' : '#222',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  maxWidth: '80%',
                  padding: '10px 14px',
                  borderRadius: '16px 16px 16px 4px',
                  background: isDark ? '#2a2a2a' : '#fff',
                  color: isDark ? '#eee' : '#222',
                  fontSize: '14px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                }}
              >
                <span style={{ display: 'inline-flex', gap: '4px' }}>
                  <span style={{ animation: 'chatDot 1.4s infinite both', animationDelay: '0s' }}>.</span>
                  <span style={{ animation: 'chatDot 1.4s infinite both', animationDelay: '0.2s' }}>.</span>
                  <span style={{ animation: 'chatDot 1.4s infinite both', animationDelay: '0.4s' }}>.</span>
                </span>
                <style>{`
                  @keyframes chatDot {
                    0%, 80%, 100% { opacity: 0; }
                    40% { opacity: 1; }
                  }
                `}</style>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div
            style={{
              display: 'flex',
              gap: '8px',
              padding: '12px',
              borderTop: isDark ? '1px solid #333' : '1px solid #e0e0e0',
              background: isDark ? '#1a1a1a' : '#fff',
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question…"
              disabled={loading}
              style={{
                flex: 1,
                border: isDark ? '1px solid #444' : '1px solid #ddd',
                borderRadius: '24px',
                padding: '10px 16px',
                fontSize: '14px',
                outline: 'none',
                background: isDark ? '#333' : '#f5f5f5',
                color: isDark ? '#eee' : '#222',
              }}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: 'none',
                background: loading || !input.trim() ? '#ccc' : '#111',
                color: '#fff',
                fontSize: '18px',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </>
  )
}
