'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/i18n/context'
import { handleGetAnalytics } from '@/lib/actions/admin/analytics-action'
import type { AnalyticsData } from '@/lib/api/admin/analytics'
import LoadingSpinner from '@/app/components/LoadingSpinner'

export default function AdminAnalyticsPage() {
  const { t, language } = useLanguage()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      const result = await handleGetAnalytics()
      if (result.success) {
        setData(result.data)
      } else {
        setError(result.message)
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <LoadingSpinner text={t('common.loading')} />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--error)', fontSize: '0.9rem' }}>{error || t('common.somethingWentWrong')}</p>
      </div>
    )
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat(language === 'en' ? 'en-IN' : language === 'es' ? 'es-ES' : language === 'pt' ? 'pt-BR' : language === 'ja' ? 'ja-JP' : 'ne-NP', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(n)

  const maxRevenue = Math.max(...data.revenueByDay.map((d) => d.revenue), 1)

  const periods = [
    { key: '1d', label: t('admin.last1d'), revenue: data.revenue['1d'], orders: data.orders['1d'] },
    { key: '7d', label: t('admin.last7d'), revenue: data.revenue['7d'], orders: data.orders['7d'] },
    { key: '30d', label: t('admin.last30d'), revenue: data.revenue['30d'], orders: data.orders['30d'] },
  ]

  const statusColors: Record<string, string> = {
    Pending: '#f59e0b',
    Shipped: '#3b82f6',
    Delivered: '#10b981',
    Cancelled: '#ef4444',
  }

  return (
    <div>
      <p className="admin-page-eyebrow">{t('admin.analytics')}</p>
      <h1 className="admin-page-title">{t('admin.analyticsTitle')}</h1>

      {/* Period Revenue + Order Cards */}
      <div className="admin-stats-grid">
        {periods.map((p) => (
          <div key={p.key} className="admin-stat-card" style={{ borderLeft: '4px solid var(--blue)' }}>
            <div className="admin-stat-label">{p.label}</div>
            <div className="admin-stat-value">{fmt(p.revenue)}</div>
            <div className="admin-stat-sub">
              {p.orders} {p.orders === 1 ? 'order' : 'orders'}
            </div>
          </div>
        ))}
      </div>

      {/* Totals Row */}
      <div className="admin-stats-grid" style={{ marginTop: '1rem' }}>
        <div className="admin-stat-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div className="admin-stat-label">{t('admin.totalUsers')}</div>
          <div className="admin-stat-value">{data.totalUsers}</div>
        </div>
        <div className="admin-stat-card" style={{ borderLeft: '4px solid #8b5cf6' }}>
          <div className="admin-stat-label">{t('admin.totalProducts')}</div>
          <div className="admin-stat-value">{data.totalProducts}</div>
        </div>
        <div className="admin-stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div className="admin-stat-label">{t('admin.ordersByStatus')}</div>
          <div className="admin-stat-value" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {Object.entries(data.ordersByStatus).map(([status, count]) => (
              <span key={status} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: statusColors[status] || '#999', display: 'inline-block' }} />
                {status}: {count}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Bar Chart */}
      <div className="admin-section-card" style={{ marginTop: '2rem' }}>
        <h2 className="admin-section-title">{t('admin.revenueChart')}</h2>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '200px', paddingTop: '1rem' }}>
          {data.revenueByDay.map((day) => {
            const height = day.revenue > 0 ? Math.max((day.revenue / maxRevenue) * 100, 4) : 2
            return (
              <div
                key={day.date}
                title={`${day.date}: ${fmt(day.revenue)}`}
                style={{
                  flex: 1,
                  height: `${height}%`,
                  background: 'linear-gradient(to top, var(--blue, #3b82f6), #60a5fa)',
                  borderRadius: '3px 3px 0 0',
                  minWidth: '4px',
                  opacity: day.revenue > 0 ? 1 : 0.3,
                  transition: 'height 0.3s ease',
                  position: 'relative',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.8'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = day.revenue > 0 ? '1' : '0.3'
                }}
              />
            )
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.65rem', color: 'var(--muted)' }}>
          <span>{data.revenueByDay[0]?.date?.slice(5) || ''}</span>
          <span>{data.revenueByDay[Math.floor(data.revenueByDay.length / 2)]?.date?.slice(5) || ''}</span>
          <span>{data.revenueByDay[data.revenueByDay.length - 1]?.date?.slice(5) || ''}</span>
        </div>
      </div>

      <style>{`
        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }
        .admin-stat-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 1.25rem;
        }
        .admin-stat-label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--muted);
          margin-bottom: 0.5rem;
        }
        .admin-stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--black);
        }
        .admin-stat-sub {
          font-size: 0.8rem;
          color: var(--muted);
          margin-top: 0.25rem;
        }
        .admin-section-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.5rem;
        }
        .admin-section-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--black);
          margin: 0 0 0.5rem;
        }
      `}</style>
    </div>
  )
}
