import Link from 'next/link'
import UserForm from '../_components/UserForm'

export const metadata = {
  title: 'Create User – Admin | Archive Outfitters',
}

export default function CreateUserPage() {
  return (
    <div>
      <Link href="/admin/users" className="admin-back-link">
        ← Back to Users
      </Link>
      <p className="admin-page-eyebrow">Users</p>
      <h1 className="admin-page-title">New User</h1>
      <p className="admin-page-subtitle" style={{ marginBottom: '1.75rem' }}>
        Create a new user account.
      </p>
      <UserForm />
    </div>
  )
}
