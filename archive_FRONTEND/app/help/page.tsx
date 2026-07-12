'use client'

import { useLanguage } from '../../lib/i18n/context'
import Link from 'next/link'

export default function HelpPage() {
  const { t } = useLanguage()

  return (
    <main className="page" style={{ justifyContent: 'flex-start', paddingTop: '5rem', minHeight: '100vh' }}>
      <div className="blob-container">
        <div className="blob blob-tl" />
        <div className="blob blob-br" />
      </div>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1, width: '100%' }}>
        <Link
          href="/dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.8rem',
            color: 'var(--muted)',
            textDecoration: 'none',
            marginBottom: '1.5rem',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          {t('dashboard.backToDashboard')?.replace('← ', '') || 'Back'}
        </Link>

        <h1 className="logo" style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 700,
          fontSize: '2.8rem',
          textAlign: 'center',
          marginBottom: '0.5rem',
          color: 'var(--black)',
          letterSpacing: '-0.02em'
        }}>
          {t('helpCenter.title')}
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
          {t('helpCenter.subtitle')}
        </p>

        <h2 style={{
          fontSize: '1.2rem',
          fontWeight: 600,
          color: 'var(--black)',
          marginBottom: '1.25rem',
        }}>
          {t('helpCenter.faq')}
        </h2>

        {[1, 2, 3, 4, 5].map((i) => (
          <details
            key={i}
            style={{
              marginBottom: '0.75rem',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              overflow: 'hidden',
            }}
          >
            <summary style={{
              padding: '1rem 1.25rem',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '0.9rem',
              color: 'var(--black)',
              background: 'var(--input-bg)',
              userSelect: 'none',
            }}>
              {t(`helpCenter.faq${i}q`)}
            </summary>
            <p style={{
              padding: '0.75rem 1.25rem 1.25rem',
              margin: 0,
              fontSize: '0.85rem',
              lineHeight: '1.6',
              color: 'var(--muted)',
              background: 'var(--card-bg)',
            }}>
              {t(`helpCenter.faq${i}a`)}
            </p>
          </details>
        ))}

        <div style={{
          marginTop: '3rem',
          padding: '2rem',
          borderRadius: '12px',
          background: 'var(--input-bg)',
          border: '1px solid var(--border)',
          textAlign: 'center',
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--black)', marginBottom: '0.5rem' }}>
            {t('helpCenter.contactTitle')}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 0 }}>
            {t('helpCenter.contactDesc')}
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--blue)', marginTop: '0.75rem', marginBottom: 0 }}>
            support@archiveoutfitters.com
          </p>
        </div>
      </div>
    </main>
  )
}
