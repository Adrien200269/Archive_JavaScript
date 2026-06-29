import Link from 'next/link'

const CARDS = [
  {
    href: '/admin/users',
    label: 'Users',
    desc: 'View, create, edit and delete user accounts.',
    icon: '👥',
  },
]

export default function AdminOverviewPage() {
  return (
    <div>
      <p className="admin-page-eyebrow">Admin</p>
      <h1 className="admin-page-title">Overview</h1>
      <p className="admin-page-subtitle">Manage your Archive Outfitters platform.</p>

      <div className="admin-overview-grid">
        {CARDS.map(({ href, label, desc, icon }) => (
          <Link key={href} href={href} className="admin-overview-card">
            <div className="admin-overview-card-icon">{icon}</div>
            <div className="admin-overview-card-title">{label}</div>
            <p className="admin-overview-card-desc">{desc}</p>
            <span className="admin-overview-card-cta">Manage →</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
