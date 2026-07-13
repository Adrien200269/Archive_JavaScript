'use client'

import { useState, FormEvent, ChangeEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import GoogleIcon from '../components/GoogleIcon'
import { LoginSchema } from '../../lib/types/auth'
import { loginAction } from '../../lib/actions/auth-action'
import { useLanguage } from '../../lib/i18n/context'
import { useAuth } from '../context/AuthContext'

interface FormErrors {
  email?: string
  password?: string
  form?: string
}

export default function LoginPage() {
  const { t } = useLanguage()
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail]       = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPw, setShowPw]     = useState<boolean>(false)
  const [errors, setErrors]     = useState<FormErrors>({})
  const [loading, setLoading]   = useState<boolean>(false)
  const [resetSuccess, setResetSuccess] = useState<string>('')
  const [oauthError, setOauthError] = useState<string>('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('reset') === 'success') {
      setResetSuccess(t('auth.codeSent'))
      window.history.replaceState({}, '', '/login')
    }
    if (params.get('oauth') === 'failed') {
      setOauthError(t('auth.oauthFailed'))
      window.history.replaceState({}, '', '/login')
    }
  }, [])

  const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    setErrors({})

    // 1. Validate with Zod
    const result = LoginSchema.safeParse({ email, password })
    if (!result.success) {
      const f = result.error.flatten().fieldErrors
      setErrors({ email: f.email?.[0], password: f.password?.[0] })
      return
    }

    // 2. Call the action (which calls the API + sets the cookie)
    setLoading(true)
    const res = await loginAction(result.data)
    setLoading(false)

    // 3. Handle the result
    if (!res.ok) {
      setErrors({ form: res.message })
      return
    }

    // 4. Update AuthContext and redirect based on role
    login(res.data.user, res.data.token)
    router.push(res.data.user.role === 'admin' ? '/admin' : '/dashboard')
  }

  const clearError = (field: keyof FormErrors) =>
    setErrors(prev => ({ ...prev, [field]: '' }))

  return (
    <main className="page">
      {/* Background blobs */}
      <div className="blob-container">
        <div className="blob blob-tl" />
        <div className="blob blob-br" />
      </div>

      {/* Logo */}
      <div className="logo fade-up d1">
        archive<br />outfitters
      </div>

      {/* Card */}
      <div className="form-card fade-up d2">
        <div className="form-title">{t('auth.welcomeBack')}</div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="field">
            <div className="field-header">
              <label className="field-label" htmlFor="email">{t('auth.email')}</label>
            </div>
            <div className="input-row">
              <span className="input-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </span>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value)
                  clearError('email')
                }}
                placeholder={t('auth.emailPlaceholder')}
              />
            </div>
            {errors.email && (
              <p style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '0.3rem' }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="field">
            <div className="field-header">
              <label className="field-label" htmlFor="password">{t('auth.password')}</label>
              <Link href="/forgot-password" className="field-forgot">{t('auth.forgotPassword')}</Link>
            </div>
            <div className="input-row">
              <span className="input-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                id="password"
                type={showPw ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value)
                  clearError('password')
                }}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="eye-toggle"
                onClick={() => setShowPw(s => !s)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '0.3rem' }}>
                {errors.password}
              </p>
            )}
          </div>

          {resetSuccess && (
            <p style={{ color: 'var(--success)', fontSize: '0.8rem', marginBottom: '0.75rem', textAlign: 'center', fontWeight: 500 }}>
              {resetSuccess}
            </p>
          )}

          {oauthError && (
            <p style={{ color: 'var(--error)', fontSize: '0.8rem', marginBottom: '0.75rem', textAlign: 'center' }}>
              {oauthError}
            </p>
          )}

          {errors.form && (
            <p style={{ color: 'var(--error)', fontSize: '0.8rem', marginBottom: '0.75rem', textAlign: 'center' }}>
              {errors.form}
            </p>
          )}

          <button
            type="submit"
            className="btn-login"
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? t('auth.signIn') : t('auth.login')}
          </button>
        </form>

        <div className="or-divider">{t('auth.orContinueWith')}</div>
        <div className="social-row">
          <a href="/api/v1/auth/google" className="btn-social btn-google" style={{ textDecoration: 'none' }}>
            <GoogleIcon /> Google
          </a>

        </div>
      </div>

      <p className="nav-text fade-up d4">
        {t('auth.noAccount')}{' '}
        <Link href="/register">{t('auth.signUp')}</Link>
      </p>
    </main>
  )
}
