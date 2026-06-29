'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createUserSchema, type CreateUserFormData } from './schema'
import { handleCreateUser } from '@/lib/actions/admin/user-action'

type FieldErrors = Partial<Record<keyof CreateUserFormData, string>>

export default function UserForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [formError, setFormError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [form, setForm] = useState<CreateUserFormData>({
    fullName: '',
    email: '',
    password: '',
    role: 'user',
  })

  const set = (field: keyof CreateUserFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    // Client-side zod validation
    const parsed = createUserSchema.safeParse(form)
    if (!parsed.success) {
      const errs: FieldErrors = {}
      parsed.error.errors.forEach((err) => {
        const field = err.path[0] as keyof CreateUserFormData
        errs[field] = err.message
      })
      setFieldErrors(errs)
      return
    }

    startTransition(async () => {
      try {
        const result = await handleCreateUser(parsed.data)
        if (!result.success) {
          setFormError(result.message || 'Failed to create user')
          return
        }
        router.push('/admin/users')
        router.refresh()
      } catch (err: any) {
        setFormError(err?.message || 'Something went wrong')
      }
    })
  }

  return (
    <div className="admin-form-card">
      <p className="admin-form-section-title">User Details</p>

      {formError && <div className="admin-form-error-banner">{formError}</div>}

      <form onSubmit={onSubmit} noValidate>
        {/* Full Name */}
        <div className="admin-field">
          <label htmlFor="cf-fullName" className="admin-label">Full Name</label>
          <input
            id="cf-fullName"
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
          <label htmlFor="cf-email" className="admin-label">Email Address</label>
          <input
            id="cf-email"
            type="email"
            className="admin-input"
            placeholder="jane@example.com"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            autoComplete="email"
          />
          {fieldErrors.email && <span className="admin-error-text">{fieldErrors.email}</span>}
        </div>

        {/* Password */}
        <div className="admin-field">
          <label htmlFor="cf-password" className="admin-label">Password</label>
          <input
            id="cf-password"
            type="password"
            className="admin-input"
            placeholder="Min. 8 characters"
            value={form.password}
            onChange={(e) => set('password', e.target.value)}
            autoComplete="new-password"
          />
          {fieldErrors.password && <span className="admin-error-text">{fieldErrors.password}</span>}
        </div>

        {/* Role */}
        <div className="admin-field">
          <label htmlFor="cf-role" className="admin-label">Role</label>
          <select
            id="cf-role"
            className="admin-select"
            value={form.role}
            onChange={(e) => set('role', e.target.value as 'user' | 'admin')}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          {fieldErrors.role && <span className="admin-error-text">{fieldErrors.role}</span>}
        </div>

        <button
          type="submit"
          className="admin-form-submit"
          disabled={isPending}
        >
          {isPending ? 'Creating user…' : 'Create User'}
        </button>
      </form>
    </div>
  )
}
