import axios from 'axios'

// All requests go to /api/* which Next.js proxies to the backend (see next.config.js).
// withCredentials lets the browser send/receive the httpOnly auth cookie.
const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

export default api
