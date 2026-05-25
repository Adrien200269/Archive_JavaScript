'use client'

import { useState, FormEvent, ChangeEvent, ReactNode } from 'react'
import Link from 'next/link'
import GoogleIcon from '../components/GoogleIcon'
import FacebookIcon from '../components/FacebookIcon'

/* ── Icon components ── */
const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
)

const IconCalendar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)

const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)

const IconShield = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)

const IconArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
)

/* ── Types ── */
interface FormState {
  fullName: string
  email: string
  dob: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  fullName?: string
  email?: string
  dob?: string
  password?: string
  confirmPassword?: string
}

interface FieldProps {
  id: string
  label: string
  icon: ReactNode
  children: ReactNode
  error?: string
}

/* ── Field wrapper ── */
const Field = ({ id, label, icon, children, error }: FieldProps) => (
  <div className="field">
    <div className="field-header">
      <label className="field-label" htmlFor={id}>{label}</label>
    </div>
    <div className="input-row">
      <span className="input-icon" aria-hidden="true">{icon}</span>
      {children}
    </div>
    {error && (
      <p style={{ color: '#c0392b', fontSize: '0.75rem', marginTop: '0.3rem' }}>{error}</p>
    )}
  </div>
)

export default function RegisterPage() {
  const [form, setForm] = useState<FormState>({
    fullName: '', email: '', dob: '', password: '', confirmPassword: '',
  })
  const [errors, setErrors]   = useState<FormErrors>({})
  const [loading, setLoading] = useState<boolean>(false)

  const validate = (): FormErrors => {
    const e: FormErrors = {}
    if (!form.fullName.trim())                     e.fullName        = 'Full name is required'
    if (!form.email)                               e.email           = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email))    e.email           = 'Enter a valid email'
    if (!form.password)                            e.password        = 'Password is required'
    else if (form.password.length < 8)             e.password        = 'Minimum 8 characters'
    if (!form.confirmPassword)                     e.confirmPassword = 'Please confirm your password'
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    return e
  }

  const handleChange =
    (field: keyof FormState) =>
    (ev: ChangeEvent<HTMLInputElement>) => {
      setForm(f => ({ ...f, [field]: ev.target.value }))
      setErrors(er => ({ ...er, [field]: '' }))
    }

  const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    await new Promise<void>(r => setTimeout(r, 1400))
    setLoading(false)
    alert('Account created! (demo)')
  }

  return (
    <main className="page" style={{ paddingTop: '2rem' }}>
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
        <form onSubmit={handleSubmit} noValidate>

          <Field id="fullName" label="Full Name" icon={<IconUser />} error={errors.fullName}>
            <input
              id="fullName" type="text" autoComplete="name"
              placeholder="Jane Doe"
              value={form.fullName} onChange={handleChange('fullName')}
            />
          </Field>

          <Field id="email" label="Email" icon={<IconMail />} error={errors.email}>
            <input
              id="email" type="email" autoComplete="email"
              placeholder="you@example.com"
              value={form.email} onChange={handleChange('email')}
            />
          </Field>

          <Field id="dob" label="Date of Birth" icon={<IconCalendar />} error={errors.dob}>
            <input
              id="dob" type="date"
              style={{ color: form.dob ? 'var(--black)' : '#bbb' }}
              value={form.dob} onChange={handleChange('dob')}
            />
          </Field>

          <Field id="password" label="Password" icon={<IconLock />} error={errors.password}>
            <input
              id="password" type="password" autoComplete="new-password"
              placeholder="Min. 8 characters"
              value={form.password} onChange={handleChange('password')}
            />
          </Field>

          <Field id="confirmPassword" label="Confirm Password" icon={<IconShield />} error={errors.confirmPassword}>
            <input
              id="confirmPassword" type="password" autoComplete="new-password"
              placeholder="Repeat your password"
              value={form.confirmPassword}
              onChange={handleChange('confirmPassword')}
              style={{
                borderColor:
                  form.confirmPassword && form.confirmPassword === form.password
                    ? '#27ae60'
                    : undefined,
              }}
            />
          </Field>

          <button
            type="submit"
            className="btn-register"
            disabled={loading}
            style={{ opacity: loading ? 0.75 : 1 }}
          >
            {loading ? 'Creating account…' : <><span>Create Account</span> <IconArrowRight /></>}
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
        Already have an account?{' '}
        <Link href="/login" className="blue">Log in</Link>
      </p>
    </main>
  )
}
