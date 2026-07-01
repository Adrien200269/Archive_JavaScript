import { cookies } from 'next/headers'
import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

async function makeInstance() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
}

export async function getAllProducts() {
  const instance = await makeInstance()
  const response = await instance.get('/api/v1/products')
  return response.data
}

export async function addProduct(formData: FormData) {
  const instance = await makeInstance()
  const response = await instance.post('/api/v1/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export async function updateProduct(id: string, formData: FormData) {
  const instance = await makeInstance()
  const response = await instance.put(`/api/v1/products/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export async function deleteProduct(id: string) {
  const instance = await makeInstance()
  const response = await instance.delete(`/api/v1/products/${id}`)
  return response.data
}
