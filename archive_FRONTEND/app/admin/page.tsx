'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/context'
import RecommendationsSection from './_components/RecommendationsSection'

export default function AdminOverviewPage() {
  const { t } = useLanguage()

  const CARDS = [
    {
      href: '/admin/analytics',
      label: t('admin.analytics'),
      desc: t('admin.analyticsDesc'),
      icon: '📊',
    },
    {
      href: '/admin/products',
      label: t('admin.products'),
      desc: t('admin.productDesc'),
      icon: '📦',
    },
    {
      href: '/admin/orders',
      label: t('admin.orders'),
      desc: t('admin.orderDesc'),
      icon: '📋',
    },
    {
      href: '/admin/users',
      label: t('admin.users'),
      desc: t('admin.userDesc'),
      icon: '👥',
    },
  ]

  return (
    <div>
      <p className="admin-page-eyebrow">{t('admin.panel')}</p>
      <h1 className="admin-page-title">{t('admin.overview')}</h1>
      <p className="admin-page-subtitle">{t('admin.platformDesc')}</p>

      <div className="admin-overview-grid">
        {CARDS.map(({ href, label, desc, icon }) => (
          <Link key={href} href={href} className="admin-overview-card">
            <div className="admin-overview-card-icon">{icon}</div>
            <div className="admin-overview-card-title">{label}</div>
            <p className="admin-overview-card-desc">{desc}</p>
            <span className="admin-overview-card-cta">{t('admin.manage')} →</span>
          </Link>
        ))}
      </div>

      <RecommendationsSection />
    </div>
  )
}
