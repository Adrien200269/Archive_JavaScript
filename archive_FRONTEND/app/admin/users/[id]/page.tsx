import Link from 'next/link'
import { notFound } from 'next/navigation'
import { handleGetUserById } from '@/lib/actions/admin/user-action'

export const metadata = {
  title: 'View User – Admin | Archive Outfitters',
}

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await handleGetUserById(id)

  if (!result.success || !result.data) {
    notFound()
  }

  const user = result.data

  const initials = (user.fullName || '')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const colors = ['#6b6bf0', '#a78bfa', '#f472b6', '#34d399', '#f59e0b', '#ef4444', '#06b6d4', '#10b981']
  const colorIdx = (user.fullName || '').split('').reduce((a: number, c: string) => a + c.charCodeAt(0), 0) % colors.length
  const letterAvatar = `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><rect width="60" height="60" rx="30" fill="${colors[colorIdx]}"/><text x="30" y="36" text-anchor="middle" font-size="24" font-weight="700" font-family="DM Sans, sans-serif" fill="white">${initials}</text></svg>`
  )}`

  const rows: [string, string][] = [
    ['Full Name', user.fullName],
    ['Email', user.email],
    ['Role', user.role],
    ['User ID', user.id],
    ['Member Since', user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'],
  ]

  return (
    <div>
      <Link href="/admin/users" className="admin-back-link">
        ← Back to Users
      </Link>

      {/* Header */}
      <div className="admin-detail-header">
        <div className="admin-avatar-circle">
          <img src={user.avatar || letterAvatar} alt={user.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ flex: 1 }}>
          <h1 className="admin-detail-name">{user.fullName}</h1>
          <p className="admin-detail-email">{user.email}</p>
        </div>
        <Link
          href={`/admin/users/${user.id}/edit`}
          className="admin-btn-secondary"
        >
          Edit User
        </Link>
      </div>

      {/* Detail table */}
      <div className="admin-detail-table">
        {rows.map(([label, value]) => (
          <div key={label} className="admin-detail-row">
            <dt className="admin-detail-label">{label}</dt>
            <dd className="admin-detail-value">
              {label === 'Role' ? (
                <span className={`admin-badge admin-badge--${value}`}>{value}</span>
              ) : (
                value || '—'
              )}
            </dd>
          </div>
        ))}
      </div>
    </div>
  )
}
