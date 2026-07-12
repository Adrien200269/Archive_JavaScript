// Central place for endpoint paths so they aren't scattered as magic strings.
export const ENDPOINTS = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    logout: '/auth/logout',
    whoami: '/auth/whoami',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  admin: {
    users: {
      getAll: '/admin/users',
      getById: (id: string) => `/admin/users/${id}`,
      create: '/admin/users',
      update: (id: string) => `/admin/users/${id}`,
      delete: (id: string) => `/admin/users/${id}`,
    },
    orders: {
      getAll: '/admin/orders',
      updateStatus: (id: string) => `/admin/orders/${id}/status`,
    },
    analytics: '/admin/analytics',
  },
  products: {
    getAll: '/products',
    create: '/products',
    update: (id: string) => `/products/${id}`,
    delete: (id: string) => `/products/${id}`,
    toggleFavorite: (id: string) => `/products/${id}/favorite`,
  },
  orders: {
    create: '/orders',
    getMy: '/orders/my',
  },
  recommendations: {
    get: '/recommendations',
  },
}
