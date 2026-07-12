'use client'

import { useState, useEffect } from 'react'
import { productService, Product } from '@/lib/api/product'
import { useLanguage } from '@/lib/i18n/context'
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

  const { t } = useLanguage()

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await productService.getProducts()
      setProducts(data)
    } catch (err: any) {
      setError(err?.message || t('common.loadFailed') + ' ' + t('admin.products'))
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
      showToast(t('admin.productAdded'))
      setShowForm(false)
      form.reset()
      loadProducts()
    } catch (err: any) {
      showToast(err?.response?.data?.message || err?.message || t('common.somethingWentWrong'))
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
      showToast(t('admin.productUpdated'))
      setEditTarget(null)
      loadProducts()
    } catch (err: any) {
      showToast(err?.response?.data?.message || err?.message || t('common.somethingWentWrong'))
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
      showToast(t('admin.productDeleted'))
    } catch (err: any) {
      showToast(err?.response?.data?.message || err?.message || t('common.somethingWentWrong'))
      loadProducts()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p className="admin-page-eyebrow">{t('admin.panel')}</p>
          <h1 className="admin-page-title">{t('admin.products')}</h1>
          <p className="admin-page-subtitle">{products.length}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="admin-btn-primary">
          {showForm ? t('common.cancel') : '+ ' + t('admin.addProduct')}
        </button>
      </div>

      {showForm && (
        <div className="admin-form-card" style={{ marginBottom: '1.5rem', maxWidth: '100%' }}>
          <p className="admin-form-section-title">{t('admin.newProduct')}</p>
          <form onSubmit={handleAdd} encType="multipart/form-data">
            <div className="admin-form-grid">
              <div className="admin-field">
                <label className="admin-label" htmlFor="name">{t('admin.name')}</label>
                <input id="name" name="name" type="text" className="admin-input" required />
              </div>
              <div className="admin-field">
                <label className="admin-label" htmlFor="price">{t('admin.price')}</label>
                <input id="price" name="price" type="number" step="0.01" className="admin-input" required />
              </div>
            </div>
            <div className="admin-field">
              <label className="admin-label" htmlFor="image">{t('admin.image')}</label>
              <input id="image" name="image" type="file" className="admin-input" accept="image/*" required style={{ paddingTop: '0.5rem' }} />
            </div>
            <button type="submit" disabled={submitting} className="admin-form-submit">
              {submitting ? t('admin.adding') : t('admin.addProductBtn')}
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
            <p className="admin-state-box-title">{t('admin.noProducts')}</p>
            <p className="admin-state-box-desc">{t('admin.noProductsDesc')}</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t('admin.name')}</th>
                  <th>{t('admin.price')}</th>
                  <th>{t('admin.favourite')}</th>
                  <th>{t('admin.created')}</th>
                  <th>{t('admin.actions')}</th>
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
                        {product.isFavourite ? t('admin.yes') : t('admin.no')}
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
                          {t('common.edit')}
                        </button>
                        <button
                          onClick={() => setDeleteTarget(product)}
                          className="admin-table-action-link admin-table-action-link--danger"
                        >
                          {t('common.delete')}
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
        title={t('admin.editProduct')}
      >
        <form onSubmit={handleEdit} encType="multipart/form-data">
          <div className="admin-field">
            <label className="admin-label" htmlFor="edit-name">{t('admin.name')}</label>
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
            <label className="admin-label" htmlFor="edit-price">{t('admin.price')}</label>
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
            <label className="admin-label" htmlFor="edit-image">{t('admin.imageKeep')}</label>
            <input id="edit-image" name="image" type="file" className="admin-input" accept="image/*" style={{ paddingTop: '0.5rem' }} />
          </div>
          <div className="admin-modal-actions">
            <button type="button" onClick={() => setEditTarget(null)} className="admin-btn-secondary">
              {t('common.cancel')}
            </button>
            <button type="submit" disabled={submitting} className="admin-btn-primary">
              {submitting ? t('common.saving') : t('common.save')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title={t('admin.deleteProduct')}
      >
        <p className="admin-modal-message">
          {t('admin.confirmDeleteProduct', { name: deleteTarget?.name || '' })}
        </p>
        <div className="admin-modal-actions">
          <button onClick={() => setDeleteTarget(null)} className="admin-btn-secondary">
            {t('common.cancel')}
          </button>
          <button onClick={handleDelete} disabled={submitting} className="admin-btn-danger">
            {submitting ? t('admin.deleting') : t('admin.deleteProduct')}
          </button>
        </div>
      </Modal>

      {toast && <div className="admin-toast">{toast}</div>}
    </div>
  )
}
