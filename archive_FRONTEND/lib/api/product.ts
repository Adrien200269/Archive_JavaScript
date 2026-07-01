import api from './axios'
import { ENDPOINTS } from './endpoints'

export interface Product {
  _id: string
  name: string
  price: number
  imageUrl: string
  isFavourite: boolean
  createdAt: string
  updatedAt: string
}

export const productService = {
  async getProducts(): Promise<Product[]> {
    const { data } = await api.get(ENDPOINTS.products.getAll)
    return data.data
  },

  async toggleFavorite(id: string): Promise<Product> {
    const { data } = await api.patch(ENDPOINTS.products.toggleFavorite(id))
    return data.data
  },

  async addProduct(formData: FormData): Promise<Product> {
    const { data } = await api.post(ENDPOINTS.products.create, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data.data
  },

  async updateProduct(id: string, formData: FormData): Promise<Product> {
    const { data } = await api.put(ENDPOINTS.products.update(id), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data.data
  },

  async deleteProduct(id: string): Promise<void> {
    await api.delete(ENDPOINTS.products.delete(id))
  },
}
