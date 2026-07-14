'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { editUserSchema, type EditUserFormData } from './schema'
import Avatar from '@/app/components/Avatar'
import { handleUpdateUser } from '@/lib/actions/admin/user-action'

interface UserData {
  id: string
  fullName: string
  email: string
  role: string
  avatar?: string
  createdAt: string
}

type FieldErrors = Partial<Record<keyof EditUserFormData, string>>

export default function UserFormEdit({ user }: { user: UserData }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [formError, setFormError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [successMsg, setSuccessMsg] = useState('')
  const [form, setForm] = useState<EditUserFormData>({
    fullName: user.fullName || '',
    email: user.email || '',
    role: (user.role as 'user' | 'admin') || 'user',
    password: '',
  })

  const set = (field: keyof EditUserFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    setSuccessMsg('')

    // Only send non-empty fields
    const payload: any = {}
    if (form.fullName) payload.fullName = form.fullName
    if (form.email) payload.email = form.email
    if (form.role) payload.role = form.role
    if (form.password && form.password.trim() !== '') payload.password = form.password

    // Client-side zod validation
    const parsed = editUserSchema.safeParse(payload)
    if (!parsed.success) {
      const errs: FieldErrors = {}
      parsed.error.errors.forEach((err) => {
        const field = err.path[0] as keyof EditUserFormData
        errs[field] = err.message
      })
      setFieldErrors(errs)
      return
    }

    startTransition(async () => {
      try {
        const result = await handleUpdateUser(user.id, parsed.data)
        if (!result.success) {
          setFormError(result.message || 'Failed to update user')
          return
        }
        setSuccessMsg('User updated successfully!')
        setTimeout(() => {
          router.push('/admin/users')
          router.refresh()
        }, 800)
      } catch (err: any) {
        setFormError(err?.message || 'Something went wrong')
      }
    })
  }

  return (
    <div className="admin-form-card">
      {/* Avatar preview */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <Avatar
          src={user.avatar}
          name={user.fullName}
          size={60}
        />
        <div>
          <p style={{ fontWeight: 700, color: 'var(--black)' }}>{user.fullName}</p>
          <p style={{ fontSize: '0.82rem', color: '#888' }}>{user.email}</p>
        </div>
      </div>

      <p className="admin-form-section-title">Edit Details</p>

      {formError && <div className="admin-form-error-banner">{formError}</div>}
      {successMsg && (
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          fontSize: '0.85rem',
          color: '#166534',
          marginBottom: '1.25rem',
        }}>
          {successMsg}
        </div>
      )}

      <form onSubmit={onSubmit} noValidate>
        {/* Full Name */}
        <div className="admin-field">
          <label htmlFor="ef-fullName" className="admin-label">Full Name</label>
          <input
            id="ef-fullName"
            type="text"
            className="admin-input"
            placeholder="Jane Doe"
            value={form.fullName}
            onChange={(e) => set('fullName', e.target.value)}
            autoComplete="name"
          />
          {fieldErrors.fullName && <span className="admin-error-text">{fieldErrors.fullName}</span>}
        </div>

        {/* Email */}
        <div className="admin-field">
          <label htmlFor="ef-email" className="admin-label">Email Address</label>
          <input
            id="ef-email"
            type="email"
            className="admin-input"
            placeholder="jane@example.com"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            autoComplete="email"
          />
          {fieldErrors.email && <span className="admin-error-text">{fieldErrors.email}</span>}
        </div>

        {/* Role */}
        <div className="admin-field">
          <label htmlFor="ef-role" className="admin-label">Role</label>
          <select
            id="ef-role"
            className="admin-select"
            value={form.role}
            onChange={(e) => set('role', e.target.value as 'user' | 'admin')}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          {fieldErrors.role && <span className="admin-error-text">{fieldErrors.role}</span>}
        </div>

        {/* Password (optional) */}
        <div className="admin-field">
          <label htmlFor="ef-password" className="admin-label">
            New Password{' '}
            <span style={{ fontWeight: 400, textTransform: 'none', fontSize: '0.72rem', color: '#bbb' }}>
              (leave blank to keep current)
            </span>
          </label>
          <input
            id="ef-password"
            type="password"
            className="admin-input"
            placeholder="Min. 8 characters"
            value={form.password}
            onChange={(e) => set('password', e.target.value)}
            autoComplete="new-password"
          />
          {fieldErrors.password && <span className="admin-error-text">{fieldErrors.password}</span>}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button
            type="button"
            className="admin-btn-secondary"
            style={{ flex: '0 0 auto' }}
            onClick={() => router.back()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="admin-form-submit"
            style={{ flex: 1 }}
            disabled={isPending}
          >
            {isPending ? 'Saving changes…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
