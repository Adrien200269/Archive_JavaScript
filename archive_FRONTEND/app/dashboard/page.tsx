'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { productService, Product } from '../../lib/api/product'
import { orderService, Order } from '../../lib/api/order'

interface CartItem {
  product: Product
  quantity: number
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading: authLoading, logout } = useAuth()
  
  // Navigation tabs: 'home' | 'orders' | 'profile'
  const [activeTab, setActiveTab] = useState<'home' | 'orders' | 'profile'>('home')
  
  // Products states
  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [productError, setProductError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  
  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutMessage, setCheckoutMessage] = useState('')

  // Delivery form state
  const [deliveryName, setDeliveryName] = useState(user?.fullName || '')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [deliveryPhone, setDeliveryPhone] = useState('')

  // Orders state
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [ordersError, setOrdersError] = useState('')

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  // Fetch products
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoadingProducts(true)
        const data = await productService.getProducts()
        setProducts(data)
      } catch (err: any) {
        setProductError(err?.message || 'Failed to load products')
      } finally {
        setLoadingProducts(false)
      }
    }
    if (activeTab === 'home') {
      loadProducts()
    }
  }, [activeTab])

  // Fetch orders
  useEffect(() => {
    async function loadOrders() {
      try {
        setLoadingOrders(true)
        const data = await orderService.getMyOrders()
        setOrders(data)
      } catch (err: any) {
        setOrdersError(err?.message || 'Failed to load orders')
      } finally {
        setLoadingOrders(false)
      }
    }
    if (activeTab === 'orders') {
      loadOrders()
    }
  }, [activeTab])

  // Toggle favorite in database and state
  const handleToggleFavorite = async (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const updatedProduct = await productService.toggleFavorite(id)
      setProducts(prev =>
        prev.map(p => (p._id === id ? { ...p, isFavourite: updatedProduct.isFavourite } : p))
      )
    } catch (err) {
      console.error('Failed to toggle favorite:', err)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.replace('/login')
  }

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product._id === product._id)
      if (existing) {
        return prev.map(item =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
    setCartOpen(true)
  }

  const updateQuantity = (productId: string, delta: number) => {
    setCartItems(prev =>
      prev
        .map(item =>
          item.product._id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter(item => item.quantity > 0)
    )
  }

  const handleCheckout = async () => {
    if (cartItems.length === 0) return
    if (!deliveryName.trim() || !deliveryAddress.trim() || !deliveryPhone.trim()) {
      setCheckoutMessage('Please fill in delivery details')
      setTimeout(() => setCheckoutMessage(''), 3000)
      return
    }
    setCheckoutLoading(true)
    setCheckoutMessage('')
    try {
      const items = cartItems.map(item => ({
        productId: item.product._id,
        quantity: item.quantity,
      }))
      await orderService.createOrder(items, {
        name: deliveryName.trim(),
        address: deliveryAddress.trim(),
        phone: deliveryPhone.trim(),
      })
      setCartItems([])
      setCartOpen(false)
      setCheckoutMessage('Order placed successfully!')
      setTimeout(() => setCheckoutMessage(''), 3000)
    } catch (err: any) {
      setCheckoutMessage(err?.response?.data?.message || err?.message || 'Checkout failed')
      setTimeout(() => setCheckoutMessage(''), 3000)
    } finally {
      setCheckoutLoading(false)
    }
  }

  if (authLoading) {
    return (
      <main className="page" style={{ justifyContent: 'center' }}>
        <div className="blob-container">
          <div className="blob blob-tl" />
          <div className="blob blob-br" />
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Loading session…</p>
      </main>
    )
  }

  if (!user) return null

  // Generate initials for avatar fallback
  const initials = user.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U'

  // Filter products by search query and favorite status
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFavorite = !favoritesOnly || product.isFavourite
    return matchesSearch && matchesFavorite
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#fcfcfc', color: 'var(--black)' }}>
      
      {/* ── TOP HEADER BAR ── */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #eaeaea',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem'
      }}>
        {/* Left Heart Icon (Wishlist Filter Toggle) */}
        <button
          onClick={() => setFavoritesOnly(!favoritesOnly)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: favoritesOnly ? '#e74c3c' : 'var(--black)',
            transition: 'color 0.2s ease, transform 0.2s ease',
            transform: favoritesOnly ? 'scale(1.1)' : 'scale(1)'
          }}
          title={favoritesOnly ? "Show All Products" : "Show Favorites Only"}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill={favoritesOnly ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>

        {/* Center Search Input with Icon */}
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '380px',
          margin: '0 1rem'
        }}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              height: '38px',
              padding: '0 1rem 0 2.5rem',
              borderRadius: '20px',
              border: '1px solid #dcdcdc',
              fontSize: '0.9rem',
              outline: 'none',
              fontFamily: 'inherit',
              transition: 'border-color 0.2s ease',
              backgroundColor: '#fafafa'
            }}
          />
          <span style={{
            position: 'absolute',
            left: '0.85rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#888888',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
        </div>

        {/* Right Cart Icon */}
        <button style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0.5rem',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--black)'
        }}
        onClick={() => setCartOpen(true)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          {cartCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              backgroundColor: '#e74c3c',
              color: '#fff',
              fontSize: '0.65rem',
              fontWeight: 700,
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
            }}>
              {cartCount}
            </span>
          )}
        </button>
      </header>

      {/* ── MAIN CONTENT AREA ── */}
      <main style={{ flex: 1, padding: '2rem 1.5rem 6rem', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
        
        {/* TAB 1: PRODUCT CATALOG */}
        {activeTab === 'home' && (
          <div>
            <h1 className="logo" style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 700,
              fontSize: '2.5rem',
              textAlign: 'left',
              marginBottom: '1.5rem',
              color: 'var(--black)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1
            }}>
              {favoritesOnly ? "Favourites" : "Most Selling"}
            </h1>

            {loadingProducts ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Loading products…</p>
              </div>
            ) : productError ? (
              <div style={{
                backgroundColor: '#fdf2f2',
                border: '1px solid #f5c6c6',
                color: '#c0392b',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem'
              }}>
                {productError}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                backgroundColor: '#ffffff',
                border: '1px solid #eaeaea',
                borderRadius: '12px',
                color: 'var(--muted)'
              }}>
                <p style={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--black)' }}>No products found</p>
                <p style={{ fontSize: '0.85rem' }}>Try altering your search query or wishlist filters.</p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '1.5rem'
              }}>
                {filteredProducts.map((product) => (
                  <div key={product._id} className="fade-up" style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #ebebeb',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    position: 'relative'
                  }}>
                    {/* Image Container */}
                    <div style={{
                      position: 'relative',
                      backgroundColor: '#f6f6f6',
                      paddingTop: '100%', // Square image container
                      overflow: 'hidden'
                    }}>
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease'
                        }}
                      />
                      
                      {/* Heart (Favorite Toggle Button) */}
                      <button
                        onClick={(e) => handleToggleFavorite(product._id, e)}
                        style={{
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          border: 'none',
                          borderRadius: '50%',
                          width: '36px',
                          height: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          color: product.isFavourite ? '#e74c3c' : '#bbbbbb',
                          transition: 'transform 0.2s ease, color 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill={product.isFavourite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </button>
                    </div>

                    {/* Description Details */}
                    <div style={{
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                      flexGrow: 1
                    }}>
                      <h3 style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: 'var(--black)',
                        margin: 0,
                        lineHeight: 1.2
                      }}>
                        {product.name}
                      </h3>
                      <p style={{
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        color: 'var(--black)',
                        margin: 0
                      }}>
                        ₹ {product.price.toLocaleString()}
                      </p>

                      {/* Add to Cart button */}
                      <button
                        onClick={() => addToCart(product)}
                        style={{
                          marginTop: '0.8rem',
                          width: '100%',
                          height: '36px',
                          backgroundColor: 'var(--black)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="9" cy="21" r="1"/>
                          <circle cx="20" cy="21" r="1"/>
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                        </svg>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ORDER HISTORY */}
        {activeTab === 'orders' && (
          <div className="fade-up">
            <h1 className="logo" style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 700,
              fontSize: '2.5rem',
              textAlign: 'left',
              marginBottom: '1.5rem',
              color: 'var(--black)',
              letterSpacing: '-0.02em'
            }}>
              Order History
            </h1>

            {loadingOrders ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Loading orders…</p>
              </div>
            ) : ordersError ? (
              <div style={{
                backgroundColor: '#fdf2f2',
                border: '1px solid #f5c6c6',
                color: '#c0392b',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem'
              }}>
                {ordersError}
              </div>
            ) : orders.length === 0 ? (
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #eaeaea',
                borderRadius: '16px',
                padding: '3rem 2rem',
                textAlign: 'center',
                color: 'var(--muted)'
              }}>
                <p style={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--black)' }}>No orders yet</p>
                <p style={{ fontSize: '0.85rem' }}>Start shopping to see your orders here.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {orders.map((order) => (
                  <div key={order._id} style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #eaeaea',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '1rem',
                    }}>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--black)' }}>
                          Order #{order._id.slice(-6).toUpperCase()}
                        </p>
                        <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '0.15rem' }}>
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric',
                          })}
                          {order.delivery?.name ? ` · ${order.delivery.name}` : ''}
                        </p>
                      </div>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: order.status === 'Delivered' ? '#27ae60' : order.status === 'Shipped' ? '#2b2be0' : order.status === 'Cancelled' ? '#888888' : '#f39c12',
                        backgroundColor: order.status === 'Delivered' ? '#e8f8f0' : order.status === 'Shipped' ? '#eaeafe' : order.status === 'Cancelled' ? '#f2f2f2' : '#fef9e7',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '4px',
                        whiteSpace: 'nowrap',
                      }}>
                        {order.status}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {order.items.map((item, i) => (
                        <div key={i} style={{
                          display: 'flex',
                          gap: '0.75rem',
                          alignItems: 'center',
                        }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            backgroundColor: '#f6f6f6',
                            flexShrink: 0,
                          }}>
                            <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--black)' }}>{item.name}</p>
                            <p style={{ fontSize: '0.78rem', color: '#888' }}>Qty: {item.quantity}</p>
                          </div>
                          <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--black)', whiteSpace: 'nowrap' }}>
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>

                    {order.delivery && (
                      <div style={{
                        marginTop: '0.75rem',
                        paddingTop: '0.75rem',
                        borderTop: '1px solid #f0f0ee',
                        fontSize: '0.78rem',
                        color: '#888',
                      }}>
                        Deliver to: {order.delivery.address} · {order.delivery.phone}
                      </div>
                    )}

                    <div style={{
                      marginTop: '0.75rem',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid #f0f0ee',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <span style={{ fontSize: '0.82rem', color: '#888' }}>Total</span>
                      <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--black)' }}>
                        ₹{order.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: USER PROFILE SETTINGS (ORIGINAL DASHBOARD VIEW) */}
        {activeTab === 'profile' && (
          <div className="fade-up" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <h1 className="logo" style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 700,
              fontSize: '2.5rem',
              textAlign: 'center',
              marginBottom: '1.5rem',
              color: 'var(--black)',
              letterSpacing: '-0.02em'
            }}>
              Account Settings
            </h1>

            <div className="form-card" style={{ textAlign: 'center', position: 'relative', width: '100%', maxWidth: '380px' }}>
              {/* Profile Avatar display */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    style={{
                      width: '84px',
                      height: '84px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid var(--border)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '84px',
                      height: '84px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--input-bg)',
                      color: 'var(--black)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      fontWeight: '600',
                      letterSpacing: '0.05em',
                      border: '1px solid var(--border)'
                    }}
                  >
                    {initials}
                  </div>
                )}
              </div>

              <div className="form-title" style={{ marginBottom: '0.5rem' }}>Welcome, {user.fullName} 👋</div>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Logged in as <strong>{user.email}</strong>
              </p>

              {/* Navigation Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                <Link href="/dashboard/profile" className="btn-register" style={{ height: '44px', textDecoration: 'none' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Update Profile
                </Link>

                <Link href="/dashboard/password" className="btn-register" style={{ height: '44px', textDecoration: 'none', backgroundColor: '#555' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  Change Password
                </Link>

                {user.role === 'admin' && (
                  <Link href="/admin" className="btn-register" style={{ height: '44px', textDecoration: 'none', backgroundColor: '#1a1a1a' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7"/>
                      <rect x="14" y="3" width="7" height="7"/>
                      <rect x="14" y="14" width="7" height="7"/>
                      <rect x="3" y="14" width="7" height="7"/>
                    </svg>
                    Admin Panel
                  </Link>
                )}

                <button type="button" className="btn-login" onClick={handleLogout} style={{ height: '44px', marginTop: '0.5rem' }}>
                  Log out
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── CART DRAWER ── */}
      {cartOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2000,
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
          }} onClick={() => setCartOpen(false)} />
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '400px',
            height: '100%',
            backgroundColor: '#ffffff',
            boxShadow: '-4px 0 20px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideInRight 0.25s ease',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid #eaeaea',
            }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--black)', margin: 0 }}>
                Cart ({cartCount})
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.25rem',
                  color: '#888',
                  padding: '0.25rem',
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
              {cartItems.length === 0 ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: 'var(--muted)',
                  textAlign: 'center',
                }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"/>
                    <circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>Your cart is empty</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {cartItems.map((item) => (
                    <div key={item.product._id} style={{
                      display: 'flex',
                      gap: '0.75rem',
                      paddingBottom: '1rem',
                      borderBottom: '1px solid #f0f0ee',
                    }}>
                      <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        backgroundColor: '#f6f6f6',
                        flexShrink: 0,
                      }}>
                        <img src={item.product.imageUrl} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--black)', marginBottom: '0.2rem' }}>
                          {item.product.name}
                        </p>
                        <p style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--black)', marginBottom: '0.5rem' }}>
                          ₹{item.product.price.toLocaleString()}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <button
                            onClick={() => updateQuantity(item.product._id, -1)}
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '6px',
                              border: '1px solid #ddd',
                              background: '#fff',
                              cursor: 'pointer',
                              fontSize: '1rem',
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--black)',
                              lineHeight: 1,
                            }}
                          >
                            −
                          </button>
                          <span style={{ fontWeight: 600, fontSize: '0.9rem', minWidth: '20px', textAlign: 'center' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product._id, 1)}
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '6px',
                              border: '1px solid #ddd',
                              background: '#fff',
                              cursor: 'pointer',
                              fontSize: '1rem',
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--black)',
                              lineHeight: 1,
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--black)', whiteSpace: 'nowrap' }}>
                        ₹{(item.product.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div style={{
                borderTop: '1px solid #eaeaea',
                padding: '1.25rem 1.5rem',
              }}>
                <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#555', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Delivery Details
                </p>
                <div className="admin-field" style={{ marginBottom: '0.6rem' }}>
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="admin-input"
                    value={deliveryName}
                    onChange={e => setDeliveryName(e.target.value)}
                    style={{ height: '36px', fontSize: '0.82rem' }}
                    required
                  />
                </div>
                <div className="admin-field" style={{ marginBottom: '0.6rem' }}>
                  <input
                    type="text"
                    placeholder="Phone Number"
                    className="admin-input"
                    value={deliveryPhone}
                    onChange={e => setDeliveryPhone(e.target.value)}
                    style={{ height: '36px', fontSize: '0.82rem' }}
                    required
                  />
                </div>
                <div className="admin-field" style={{ marginBottom: '0.8rem' }}>
                  <textarea
                    placeholder="Delivery Address"
                    className="admin-input"
                    value={deliveryAddress}
                    onChange={e => setDeliveryAddress(e.target.value)}
                    style={{ height: '56px', fontSize: '0.82rem', paddingTop: '0.5rem', resize: 'none' }}
                    required
                  />
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                }}>
                  <span style={{ fontSize: '0.9rem', color: '#888' }}>Total</span>
                  <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--black)' }}>
                    ₹{cartTotal.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  style={{
                    width: '100%',
                    height: '46px',
                    backgroundColor: 'var(--black)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: checkoutLoading ? 'not-allowed' : 'pointer',
                    opacity: checkoutLoading ? 0.6 : 1,
                    transition: 'opacity 0.2s',
                  }}
                >
                  {checkoutLoading ? 'Placing Order…' : 'Checkout'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── CHECKOUT MESSAGE TOAST ── */}
      {checkoutMessage && (
        <div style={{
          position: 'fixed',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3000,
          backgroundColor: checkoutMessage.includes('successfully') ? '#e8f8f0' : '#fdf2f2',
          color: checkoutMessage.includes('successfully') ? '#27ae60' : '#c0392b',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          fontSize: '0.85rem',
          fontWeight: 600,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}>
          {checkoutMessage}
        </div>
      )}

      {/* ── STICKY BOTTOM NAVIGATION TAB BAR ── */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '64px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #eaeaea',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 1000,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.03)'
      }}>
        {/* Tab 1: Orders (Clipboard icon) */}
        <button
          onClick={() => setActiveTab('orders')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: activeTab === 'orders' ? 'var(--blue)' : 'var(--muted)',
            transition: 'color 0.2s ease',
            padding: '0.4rem'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
            <line x1="9" y1="9" x2="15" y2="9"/>
            <line x1="9" y1="13" x2="15" y2="13"/>
            <line x1="9" y1="17" x2="14" y2="17"/>
          </svg>
        </button>

        {/* Tab 2: Home (House icon) */}
        <button
          onClick={() => setActiveTab('home')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: activeTab === 'home' ? 'var(--blue)' : 'var(--muted)',
            transition: 'color 0.2s ease',
            padding: '0.4rem'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill={activeTab === 'home' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </button>

        {/* Tab 3: Profile (User icon) */}
        <button
          onClick={() => setActiveTab('profile')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: activeTab === 'profile' ? 'var(--blue)' : 'var(--muted)',
            transition: 'color 0.2s ease',
            padding: '0.4rem'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill={activeTab === 'profile' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </button>
      </nav>

    </div>
  )
}
