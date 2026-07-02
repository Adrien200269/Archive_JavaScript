'use client'

import { useState, useEffect, FormEvent, ChangeEvent, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../context/AuthContext'
import api from '../../../lib/api/axios'

interface FormErrors {
  fullName?: string
  email?: string
  avatar?: string
  form?: string
}

export default function ProfileUpdatePage() {
  const router = useRouter()
  const { user, loading, updateUser } = useAuth()

  const [fullName, setFullName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>('')
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [successMsg, setSuccessMsg] = useState<string>('')
  const [submitting, setSubmitting] = useState<boolean>(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '')
      setEmail(user.email || '')
      if (user.avatar) {
        setAvatarPreview(user.avatar)
      }
    }
  }, [user])

  if (loading) {
    return (
      <main className="page" style={{ justifyContent: 'center' }}>
        <div className="blob-container">
          <div className="blob blob-tl" />
          <div className="blob blob-br" />
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Loading session…</p>
      </main>
    )
  }

  if (!user) return null

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
      setErrors(prev => ({ ...prev, avatar: '' }))
    }
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})
    setSuccessMsg('')
    setSubmitting(true)

    // Quick client-side checks
    if (!fullName.trim()) {
      setErrors({ fullName: 'Full name is required' })
      setSubmitting(false)
      return
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: 'Please enter a valid email address' })
      setSubmitting(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append('fullName', fullName)
      formData.append('email', email)
      if (avatarFile) {
        formData.append('avatar', avatarFile)
      }

      const { data } = await api.put('/auth/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (data.success && data.data) {
        updateUser(data.data)
        setSuccessMsg('Profile updated successfully!')
        setAvatarFile(null)
      } else {
        setErrors({ form: data.message || 'Failed to update profile.' })
      }
    } catch (err: any) {
      const respData = err?.response?.data
      if (respData?.errors) {
        const fieldErrors: FormErrors = {}
        Object.keys(respData.errors).forEach(key => {
          fieldErrors[key as keyof FormErrors] = respData.errors[key][0]
        })
        setErrors(fieldErrors)
      } else {
        setErrors({ form: respData?.message || 'Something went wrong. Please try again.' })
      }
    } finally {
      setSubmitting(false)
    }
  }

  const initials = fullName
    ? fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U'

  return (
    <main className="page" style={{ justifyContent: 'center' }}>
      <div className="blob-container">
        <div className="blob blob-tl" />
        <div className="blob blob-br" />
      </div>

      <div className="logo fade-up d1">
        archive<br />outfitters
      </div>

      <div className="form-card fade-up d2" style={{ maxWidth: '400px' }}>
        <div className="form-title" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Update Profile</div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Avatar selector */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div 
              onClick={triggerFileSelect}
              style={{
                width: '96px',
                height: '96px',
                borderRadius: '50%',
                cursor: 'pointer',
                overflow: 'hidden',
                position: 'relative',
                border: '2px solid var(--border)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                backgroundColor: 'var(--input-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'opacity 0.2s',
              }}
              className="avatar-hover-layer"
            >
              {avatarPreview ? (
                <img 
                  src={avatarPreview} 
                  alt="Preview" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ fontSize: '1.8rem', fontWeight: '600', color: 'var(--black)' }}>
                  {initials}
                </div>
              )}
              {/* Overlay edit state */}
              <div 
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}
                className="overlay-edit"
              >
                Upload
              </div>
            </div>
            <button 
              type="button" 
              onClick={triggerFileSelect}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--blue)',
                fontSize: '0.8rem',
                fontWeight: '500',
                marginTop: '0.5rem',
                cursor: 'pointer'
              }}
            >
              Change Photo
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              style={{ display: 'none' }}
            />
            {errors.avatar && (
              <p style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '0.3rem' }}>
                {errors.avatar}
              </p>
            )}
          </div>

          {/* Full Name */}
          <div className="field">
            <div className="field-header">
              <label className="field-label" htmlFor="fullName">Full Name</label>
            </div>
            <div className="input-row">
              <span className="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value)
                  if (errors.fullName) setErrors(prev => ({ ...prev, fullName: '' }))
                }}
                placeholder="Your Name"
              />
            </div>
            {errors.fullName && (
              <p style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '0.3rem' }}>
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div className="field">
            <div className="field-header">
              <label className="field-label" htmlFor="email">Email Address</label>
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
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) setErrors(prev => ({ ...prev, email: '' }))
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

          {errors.form && (
            <p style={{ color: 'var(--error)', fontSize: '0.8rem', margin: '0.75rem 0', textAlign: 'center' }}>
              {errors.form}
            </p>
          )}

          {successMsg && (
            <p style={{ color: 'var(--success)', fontSize: '0.8rem', margin: '0.75rem 0', textAlign: 'center', fontWeight: '500' }}>
              {successMsg}
            </p>
          )}

          <button
            type="submit"
            className="btn-login"
            disabled={submitting}
            style={{ opacity: submitting ? 0.7 : 1, marginTop: '1.25rem' }}
          >
            {submitting ? 'Updating…' : 'Save Changes'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link href="/dashboard" style={{ fontSize: '0.85rem', color: 'var(--muted)', textDecoration: 'none', fontWeight: '500' }}>
            ← Back to Dashboard
          </Link>
        </div>
      </div>
      
      {/* Dynamic hover utility using simple CSS injection */}
      <style>{`
        .avatar-hover-layer:hover .overlay-edit {
          opacity: 1 !important;
        }
      `}</style>
    </main>
  )
}
