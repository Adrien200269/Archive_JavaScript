'use client'

import { useState, useEffect, useTransition } from 'react'
import { handleGetAllOrders, handleUpdateOrderStatus } from '@/lib/actions/admin/order-action'

interface OrderItem {
  product: string
  name: string
  price: number
  imageUrl: string
  quantity: number
}

interface Order {
  _id: string
  user: { _id: string; fullName: string; email: string }
  items: OrderItem[]
  totalPrice: number
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled'
  createdAt: string
}

const STATUSES = ['Pending', 'Shipped', 'Delivered', 'Cancelled'] as const

const STATUS_COLORS: Record<string, string> = {
  Pending: '#f39c12',
  Shipped: '#2b2be0',
  Delivered: '#27ae60',
  Cancelled: '#888888',
}

const STATUS_BG: Record<string, string> = {
  Pending: '#fef9e7',
  Shipped: '#eaeafe',
  Delivered: '#e8f8f0',
  Cancelled: '#f2f2f2',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const [toast, setToast] = useState('')

  useEffect(() => {
    startTransition(async () => {
      const result = await handleGetAllOrders()
      if (result.success) {
        setOrders(result.data)
      } else {
        setError(result.message)
      }
      setLoading(false)
    })
  }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleStatusChange = (orderId: string, newStatus: string) => {
    startTransition(async () => {
      const result = await handleUpdateOrderStatus(orderId, newStatus)
      if (result.success) {
        showToast(`Order status updated to ${newStatus}`)
        setOrders(prev =>
          prev.map(o => (o._id === orderId ? { ...o, status: newStatus as Order['status'] } : o))
        )
      } else {
        showToast(result.message || 'Failed to update order status')
      }
    })
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <p className="admin-page-eyebrow">Admin</p>
        <h1 className="admin-page-title">Orders</h1>
        <p className="admin-page-subtitle">{orders.length} total order{orders.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="admin-table-wrapper">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <div className="admin-spinner" />
          </div>
        ) : error ? (
          <div className="admin-state-box">
            <p className="admin-state-box-title">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="admin-state-box">
            <div className="admin-state-box-icon">📋</div>
            <p className="admin-state-box-title">No orders yet</p>
            <p className="admin-state-box-desc">Orders will appear here once customers start purchasing.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#888' }}>
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--black)' }}>{order.user?.fullName || 'Unknown'}</div>
                      <div style={{ fontSize: '0.78rem', color: '#888' }}>{order.user?.email || ''}</div>
                    </td>
                    <td style={{ fontSize: '0.82rem' }}>
                      {(order.items ?? []).map((item, i) => (
                        <div key={i}>
                          {item.name ?? 'Item'} x{item.quantity ?? 0}
                        </div>
                      ))}
                    </td>
                    <td style={{ fontWeight: 700 }}>₹{(order.totalPrice ?? 0).toLocaleString()}</td>
                    <td style={{ color: '#888', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                      {order.createdAt ? formatDate(order.createdAt) : '-'}
                    </td>
                    <td>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: STATUS_COLORS[order.status] ?? '#888',
                        backgroundColor: STATUS_BG[order.status] ?? '#f2f2f2',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '4px',
                      }}>
                        {order.status ?? 'Pending'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <select
                          value={order.status ?? 'Pending'}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          disabled={isPending}
                          className="admin-select"
                          style={{ width: 'auto', height: '34px', fontSize: '0.75rem', paddingRight: '1.8rem' }}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {toast && <div className="admin-toast">{toast}</div>}
    </div>
  )
}
