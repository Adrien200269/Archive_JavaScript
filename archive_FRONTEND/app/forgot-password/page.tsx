'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useLanguage } from '../../lib/i18n/context'
import api from '../../lib/api/axios'
import { ENDPOINTS } from '../../lib/api/endpoints'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { t } = useLanguage()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.post(ENDPOINTS.auth.forgotPassword, { email })
      setSent(true)
    } catch (err: any) {
      setError(err?.response?.data?.message || t('common.somethingWentWrong'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page">
      <div className="blob-container">
        <div className="blob blob-tl" />
        <div className="blob blob-br" />
      </div>

      <div className="logo fade-up d1">
        archive<br />outfitters
      </div>

      <div className="form-card fade-up d2">
        {sent ? (
          <>
            <div className="form-title" style={{ textAlign: 'center' }}>{t('auth.checkEmail')}</div>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', textAlign: 'center', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {t('auth.resetSent', { email })}
            </p>
            <Link
              href={`/reset-password?email=${encodeURIComponent(email)}`}
              className="btn-login"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
            >
              {t('auth.resetCode')}
            </Link>
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <Link href="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--muted)', textDecoration: 'none', fontWeight: 500 }}>
                {t('auth.tryDifferentEmail')}
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="form-title" style={{ textAlign: 'center' }}>{t('auth.forgotTitle')}</div>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              {t('auth.forgotDesc')}
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="field">
                <div className="field-header">
                  <label className="field-label" htmlFor="email">{t('auth.email')}</label>
                </div>
                <div className="input-row">
                  <span className="input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  </span>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError('') }}
                    placeholder={t('auth.emailPlaceholder')}
                    required
                  />
                </div>
              </div>

              {error && (
                <p style={{ color: 'var(--error)', fontSize: '0.8rem', marginBottom: '0.75rem', textAlign: 'center' }}>
                  {error}
                </p>
              )}

              <button type="submit" className="btn-login" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
                {loading ? t('auth.sending') : t('auth.sendCode')}
              </button>
            </form>
          </>
        )}

        <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
          <Link href="/login" style={{ fontSize: '0.85rem', color: 'var(--muted)', textDecoration: 'none', fontWeight: 500 }}>
            {t('auth.backToLogin')}
          </Link>
        </div>
      </div>
    </main>
  )
}
