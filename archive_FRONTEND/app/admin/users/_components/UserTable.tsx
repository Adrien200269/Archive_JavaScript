'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Modal from '../../_components/Modal'
import { handleDeleteUser } from '@/lib/actions/admin/user-action'

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface User {
  id: string
  fullName: string
  email: string
  role: string
  createdAt: string
  avatar?: string
}

interface UserTableProps {
  data: User[]
  pagination: Pagination
  search: string
}

export default function UserTable({ data, pagination, search }: UserTableProps) {
  const router = useRouter()
  const params = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)
  const [toast, setToast] = useState('')

  const page = pagination?.page ?? 1
  const limit = pagination?.limit ?? 10
  const totalPages = pagination?.totalPages ?? 1
  const total = pagination?.total ?? 0

  // Push a new query string, keeping existing params
  const setQuery = (next: Record<string, string | number>) => {
    const q = new URLSearchParams(params.toString())
    Object.entries(next).forEach(([k, v]) => q.set(k, String(v)))
    router.push(`/admin/users?${q.toString()}`)
  }

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const value = (new FormData(e.currentTarget).get('search') as string) ?? ''
    setQuery({ search: value, page: 1 })
  }

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const onDelete = () => {
    if (!deleteTarget) return
    startTransition(async () => {
      const result = await handleDeleteUser(deleteTarget.id)
      setDeleteTarget(null)
      if (result.success) {
        showToast('User deleted successfully')
        router.refresh()
      } else {
        showToast(result.message || 'Failed to delete user')
      }
    })
  }

  // Generate visible page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | '...')[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (page > 3) pages.push('...')
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i)
      }
      if (page < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }

  const initials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

  return (
    <div>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p className="admin-page-eyebrow">Admin</p>
          <h1 className="admin-page-title">Users</h1>
          <p className="admin-page-subtitle">{total} total user{total !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/admin/users/create" className="admin-btn-primary">
          + New User
        </Link>
      </div>

      {/* Toolbar */}
      <div className="admin-toolbar">
        <form onSubmit={onSearch} className="admin-search-form">
          <input
            id="user-search"
            name="search"
            defaultValue={search}
            placeholder="Search by name or email…"
            className="admin-search-input"
            autoComplete="off"
          />
          <button type="submit" className="admin-search-btn">Search</button>
        </form>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#888' }}>
          Per page
          <select
            value={limit}
            onChange={(e) => setQuery({ limit: e.target.value, page: 1 })}
            className="admin-select"
            style={{ width: 'auto', height: '38px', paddingRight: '2rem' }}
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Table */}
      <div className="admin-table-wrapper">
        {data.length === 0 ? (
          <div className="admin-state-box">
            <div className="admin-state-box-icon">👤</div>
            <p className="admin-state-box-title">
              {search ? 'No users match your search' : 'No users yet'}
            </p>
            <p className="admin-state-box-desc">
              {search
                ? 'Try a different search term.'
                : 'Create your first user to get started.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div className="admin-avatar-circle" style={{ width: '36px', height: '36px', fontSize: '0.85rem' }}>
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.fullName} />
                          ) : (
                            initials(user.fullName)
                          )}
                        </div>
                        <span style={{ fontWeight: 600, color: 'var(--black)' }}>{user.fullName}</span>
                      </div>
                    </td>
                    <td style={{ color: '#666' }}>{user.email}</td>
                    <td>
                      <span className={`admin-badge admin-badge--${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ color: '#888', fontSize: '0.82rem' }}>
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="admin-table-action-link"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/users/${user.id}/edit`}
                          className="admin-table-action-link"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(user)}
                          className="admin-table-action-link admin-table-action-link--danger"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="admin-pagination">
          <span className="admin-pagination-info">
            Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
          </span>
          <div className="admin-pagination-controls">
            <button
              className="admin-page-btn"
              disabled={page <= 1}
              onClick={() => setQuery({ page: page - 1 })}
            >
              ‹
            </button>
            {getPageNumbers().map((p, i) =>
              p === '...' ? (
                <span key={`ellipsis-${i}`} style={{ padding: '0 0.25rem', color: '#aaa', fontSize: '0.8rem' }}>…</span>
              ) : (
                <button
                  key={p}
                  className={`admin-page-btn ${page === p ? 'admin-page-btn--active' : ''}`}
                  onClick={() => setQuery({ page: p })}
                >
                  {p}
                </button>
              )
            )}
            <button
              className="admin-page-btn"
              disabled={page >= totalPages}
              onClick={() => setQuery({ page: page + 1 })}
            >
              ›
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete User"
      >
        <p className="admin-modal-message">
          Are you sure you want to delete{' '}
          <strong>{deleteTarget?.fullName}</strong>?{' '}
          This action cannot be undone.
        </p>
        <div className="admin-modal-actions">
          <button
            onClick={() => setDeleteTarget(null)}
            className="admin-btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            disabled={isPending}
            className="admin-btn-danger"
          >
            {isPending ? 'Deleting…' : 'Delete User'}
          </button>
        </div>
      </Modal>

      {/* Toast notification */}
      {toast && <div className="admin-toast">{toast}</div>}
    </div>
  )
}
