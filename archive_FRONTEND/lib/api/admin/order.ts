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

export async function getAllOrders() {
  const instance = await makeInstance()
  const response = await instance.get('/api/v1/admin/orders')
  return response.data
}

export async function updateOrderStatus(id: string, status: string) {
  const instance = await makeInstance()
  const response = await instance.patch(`/api/v1/admin/orders/${id}/status`, { status })
  return response.data
}
