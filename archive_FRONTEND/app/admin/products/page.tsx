'use client'

import { useState, useEffect } from 'react'
import { productService, Product } from '@/lib/api/product'
import Modal from '../_components/Modal'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState<Product | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState('')

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await productService.getProducts()
      setProducts(data)
    } catch (err: any) {
      setError(err?.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    setSubmitting(true)
    try {
      await productService.addProduct(formData)
      showToast('Product added successfully')
      setShowForm(false)
      form.reset()
      loadProducts()
    } catch (err: any) {
      showToast(err?.response?.data?.message || err?.message || 'Failed to add product')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editTarget) return
    const form = e.currentTarget
    const formData = new FormData(form)
    setSubmitting(true)
    try {
      await productService.updateProduct(editTarget._id, formData)
      showToast('Product updated successfully')
      setEditTarget(null)
      loadProducts()
    } catch (err: any) {
      showToast(err?.response?.data?.message || err?.message || 'Failed to update product')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    const targetId = deleteTarget._id
    setProducts(prev => prev.filter(p => p._id !== targetId))
    setDeleteTarget(null)
    setSubmitting(true)
    try {
      await productService.deleteProduct(targetId)
      showToast('Product deleted successfully')
    } catch (err: any) {
      showToast(err?.response?.data?.message || err?.message || 'Failed to delete product')
      loadProducts()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p className="admin-page-eyebrow">Admin</p>
          <h1 className="admin-page-title">Products</h1>
          <p className="admin-page-subtitle">{products.length} product{products.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="admin-btn-primary">
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {showForm && (
        <div className="admin-form-card" style={{ marginBottom: '1.5rem', maxWidth: '100%' }}>
          <p className="admin-form-section-title">New Product</p>
          <form onSubmit={handleAdd} encType="multipart/form-data">
            <div className="admin-form-grid">
              <div className="admin-field">
                <label className="admin-label" htmlFor="name">Name</label>
                <input id="name" name="name" type="text" className="admin-input" required />
              </div>
              <div className="admin-field">
                <label className="admin-label" htmlFor="price">Price</label>
                <input id="price" name="price" type="number" step="0.01" className="admin-input" required />
              </div>
            </div>
            <div className="admin-field">
              <label className="admin-label" htmlFor="image">Image</label>
              <input id="image" name="image" type="file" className="admin-input" accept="image/*" required style={{ paddingTop: '0.5rem' }} />
            </div>
            <button type="submit" disabled={submitting} className="admin-form-submit">
              {submitting ? 'Adding…' : 'Add Product'}
            </button>
          </form>
        </div>
      )}

      <div className="admin-table-wrapper">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <div className="admin-spinner" />
          </div>
        ) : error ? (
          <div className="admin-state-box">
            <p className="admin-state-box-title">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="admin-state-box">
            <div className="admin-state-box-icon">📦</div>
            <p className="admin-state-box-title">No products yet</p>
            <p className="admin-state-box-desc">Add your first product to get started.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Favourite</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div className="admin-avatar-circle" style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden' }}>
                          <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <span style={{ fontWeight: 600, color: 'var(--black)' }}>{product.name}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>₹{product.price.toLocaleString()}</td>
                    <td>
                      <span className={`admin-badge ${product.isFavourite ? 'admin-badge--admin' : 'admin-badge--user'}`}>
                        {product.isFavourite ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td style={{ color: '#888', fontSize: '0.82rem' }}>
                      {new Date(product.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <button
                          onClick={() => setEditTarget(product)}
                          className="admin-table-action-link"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(product)}
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

      {/* Edit Modal */}
      <Modal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Edit Product"
      >
        <form onSubmit={handleEdit} encType="multipart/form-data">
          <div className="admin-field">
            <label className="admin-label" htmlFor="edit-name">Name</label>
            <input
              id="edit-name"
              name="name"
              type="text"
              className="admin-input"
              defaultValue={editTarget?.name || ''}
              required
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="edit-price">Price</label>
            <input
              id="edit-price"
              name="price"
              type="number"
              step="0.01"
              className="admin-input"
              defaultValue={editTarget?.price || ''}
              required
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="edit-image">Image (leave empty to keep current)</label>
            <input id="edit-image" name="image" type="file" className="admin-input" accept="image/*" style={{ paddingTop: '0.5rem' }} />
          </div>
          <div className="admin-modal-actions">
            <button type="button" onClick={() => setEditTarget(null)} className="admin-btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="admin-btn-primary">
              {submitting ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Product"
      >
        <p className="admin-modal-message">
          Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
        </p>
        <div className="admin-modal-actions">
          <button onClick={() => setDeleteTarget(null)} className="admin-btn-secondary">
            Cancel
          </button>
          <button onClick={handleDelete} disabled={submitting} className="admin-btn-danger">
            {submitting ? 'Deleting…' : 'Delete Product'}
          </button>
        </div>
      </Modal>

      {toast && <div className="admin-toast">{toast}</div>}
    </div>
  )
}
