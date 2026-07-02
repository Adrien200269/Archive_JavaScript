'use client'

import { useState, useEffect } from 'react'
import { recommendationService } from '@/lib/api/recommendation'
import type { Product } from '@/lib/api/product'

export default function RecommendationsSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const data = await recommendationService.getRecommendations(8)
        if (!cancelled) setProducts(data)
      } catch (err: any) {
        if (!cancelled) setError('Could not load recommendations')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  if (loading) return null
  if (error || products.length === 0) return null

  return (
    <div style={{ marginTop: '3rem' }}>
      <p className="admin-page-eyebrow">AI Powered</p>
      <h2 className="admin-page-title" style={{ fontSize: '1.1rem' }}>Recommended Products</h2>
      <p className="admin-page-subtitle">
        AI-driven suggestions based on order patterns and popular trends.
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '1rem',
          marginTop: '1rem',
        }}
      >
        {products.map((p) => (
          <div
            key={p._id}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              overflow: 'hidden',
              padding: '0.75rem',
            }}
          >
            <div
              style={{
                width: '100%',
                aspectRatio: '1',
                borderRadius: '8px',
                overflow: 'hidden',
                background: '#f5f5f5',
                marginBottom: '0.5rem',
              }}
            >
              <img
                src={p.imageUrl}
                alt={p.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <p style={{ fontWeight: 600, fontSize: '0.85rem', margin: 0 }}>{p.name}</p>
            <p style={{ color: '#888', fontSize: '0.8rem', margin: '0.2rem 0 0' }}>
              ₹{p.price.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
