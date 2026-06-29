// Server-side API functions for admin user management.
// Called exclusively from Server Actions (lib/actions/admin/user-action.ts).
// Reads the `token` cookie via next/headers and forwards it as Authorization.

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

export async function getAllUsers(params: {
  page?: number
  limit?: number
  search?: string
}) {
  const instance = await makeInstance()
  const response = await instance.get('/api/v1/admin/users', { params })
  return response.data
}

export async function getUserById(id: string) {
  const instance = await makeInstance()
  const response = await instance.get(`/api/v1/admin/users/${id}`)
  return response.data
}

export async function createUser(data: {
  fullName: string
  email: string
  password: string
  role: string
}) {
  const instance = await makeInstance()
  const response = await instance.post('/api/v1/admin/users', data)
  return response.data
}

export async function updateUser(
  id: string,
  data: { fullName?: string; email?: string; role?: string; password?: string }
) {
  const instance = await makeInstance()
  const response = await instance.put(`/api/v1/admin/users/${id}`, data)
  return response.data
}

export async function deleteUser(id: string) {
  const instance = await makeInstance()
  const response = await instance.delete(`/api/v1/admin/users/${id}`)
  return response.data
}
