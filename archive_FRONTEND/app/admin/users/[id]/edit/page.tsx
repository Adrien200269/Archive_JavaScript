import Link from 'next/link'
import { notFound } from 'next/navigation'
import { handleGetUserById } from '@/lib/actions/admin/user-action'
import UserFormEdit from '../../_components/UserFormEdit'

export const metadata = {
  title: 'Edit User – Admin | Archive Outfitters',
}

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await handleGetUserById(id)

  if (!result.success || !result.data) {
    notFound()
  }

  return (
    <div>
      <Link href={`/admin/users/${id}`} className="admin-back-link">
        ← Back to User
      </Link>
      <p className="admin-page-eyebrow">Users</p>
      <h1 className="admin-page-title">Edit User</h1>
      <p className="admin-page-subtitle" style={{ marginBottom: '1.75rem' }}>
        Update details for this account.
      </p>
      <UserFormEdit user={result.data} />
    </div>
  )
}
