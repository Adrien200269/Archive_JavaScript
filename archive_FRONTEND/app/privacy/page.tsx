'use client'

import { useLanguage } from '../../lib/i18n/context'
import Link from 'next/link'

export default function PrivacyPage() {
  const { t, language } = useLanguage()

  const sections = [
    { key: 'intro' },
    { key: 'infoCollect', titleKey: 'infoCollectTitle' },
    { key: 'infoUse', titleKey: 'infoUseTitle' },
    { key: 'cookies', titleKey: 'cookiesTitle' },
    { key: 'dataSecurity', titleKey: 'dataSecurityTitle' },
  ]

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
          {t('privacyPolicy.title')}
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: '2rem', fontSize: '0.85rem' }}>
          {t('privacyPolicy.lastUpdated')} {new Date().toLocaleDateString(language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : language === 'pt' ? 'pt-BR' : language === 'ja' ? 'ja-JP' : 'ne-NP', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        {sections.map(({ key, titleKey }) => (
          <div key={key} style={{ marginBottom: '2rem' }}>
            {titleKey && (
              <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--black)', marginBottom: '0.75rem' }}>
                {t(`privacyPolicy.${titleKey}`)}
              </h2>
            )}
            <p style={{ fontSize: '0.88rem', lineHeight: '1.7', color: 'var(--muted)', margin: 0 }}>
              {t(`privacyPolicy.${key}`)}
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}
