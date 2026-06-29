import { handleGetAllUsers } from '@/lib/actions/admin/user-action'
import UserTable from './_components/UserTable'

interface SearchParams {
  page?: string
  limit?: string
  search?: string
}

export const metadata = {
  title: 'Users – Admin | Archive Outfitters',
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const query = await searchParams
  const page = query.page ? parseInt(query.page, 10) : 1
  const limit = query.limit ? parseInt(query.limit, 10) : 10
  const search = query.search || ''

  const result = await handleGetAllUsers({ page, limit, search })

  if (!result.success) {
    return (
      <div className="admin-state-box">
        <div className="admin-state-box-icon">⚠️</div>
        <p className="admin-state-box-title">Failed to load users</p>
        <p className="admin-state-box-desc">{result.message}</p>
      </div>
    )
  }

  return (
    <UserTable
      data={result.data || []}
      pagination={result.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }}
      search={search}
    />
  )
}
