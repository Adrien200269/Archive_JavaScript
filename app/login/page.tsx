'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import Link from 'next/link'
import GoogleIcon from '../components/GoogleIcon'
import FacebookIcon from '../components/FacebookIcon'

interface FormErrors {
  email?: string
  password?: string
}

export default function LoginPage() {
  const [email, setEmail]       = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPw, setShowPw]     = useState<boolean>(false)
  const [errors, setErrors]     = useState<FormErrors>({})
  const [loading, setLoading]   = useState<boolean>(false)

  const validate = (): FormErrors => {
    const e: FormErrors = {}
    if (!email)                            e.email    = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email    = 'Enter a valid email'
    if (!password)                         e.password = 'Password is required'
    return e
  }

  const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    await new Promise<void>(r => setTimeout(r, 1200))
    setLoading(false)
    alert('Logged in! (demo)')
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
        <div className="form-title">Welcome Back</div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="field">
            <div className="field-header">
              <label className="field-label" htmlFor="email">Email Address</label>
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
                placeholder="you@example.com"
              />
            </div>
            {errors.email && (
              <p style={{ color: '#c0392b', fontSize: '0.75rem', marginTop: '0.3rem' }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="field">
            <div className="field-header">
              <label className="field-label" htmlFor="password">Password</label>
              <button type="button" className="field-forgot">Forgot?</button>
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
              <p style={{ color: '#c0392b', fontSize: '0.75rem', marginTop: '0.3rem' }}>
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn-login"
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Signing in…' : 'Login'}
          </button>
        </form>

        <div className="or-divider">or continue with</div>
        <div className="social-row">
          <button type="button" className="btn-social btn-google">
            <GoogleIcon /> Google
          </button>
          <button type="button" className="btn-social btn-facebook">
            <FacebookIcon /> Facebook
          </button>
        </div>
      </div>

      <p className="nav-text fade-up d4">
        Don&apos;t have an account?{' '}
        <Link href="/register">Sign up</Link>
      </p>
    </main>
  )
}
