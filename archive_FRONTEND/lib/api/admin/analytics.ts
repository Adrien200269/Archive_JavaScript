import { cookies } from 'next/headers'
import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

async function makeInstance() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
}

export interface AnalyticsData {
  revenue: { '1d': number; '7d': number; '30d': number }
  orders: { '1d': number; '7d': number; '30d': number }
  totalUsers: number
  totalProducts: number
  revenueByDay: { date: string; revenue: number }[]
  ordersByStatus: Record<string, number>
}

export async function getAnalytics() {
  const instance = await makeInstance()
  const response = await instance.get('/api/v1/admin/analytics')
  return response.data
}
