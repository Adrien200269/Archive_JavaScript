// Central place for endpoint paths so they aren't scattered as magic strings.
export const ENDPOINTS = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    logout: '/auth/logout',
    whoami: '/auth/whoami',
  },
  admin: {
    users: {
      getAll: '/admin/users',
      getById: (id: string) => `/admin/users/${id}`,
      create: '/admin/users',
      update: (id: string) => `/admin/users/${id}`,
      delete: (id: string) => `/admin/users/${id}`,
    },
  },
}
