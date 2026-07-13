import api from './axios'
import { ENDPOINTS } from './endpoints'

export interface OrderItem {
  product: string | { _id: string; name: string }
  name: string
  price: number
  imageUrl: string
  quantity: number
}

export interface Delivery {
  name: string
  address: string
  phone: string
}

export interface Order {
  _id: string
  user: string | { _id: string; fullName: string; email: string }
  items: OrderItem[]
  totalPrice: number
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled'
  delivery: Delivery
  paymentMethod: 'cod' | 'khalti'
  paymentStatus: 'pending' | 'paid' | 'failed'
  createdAt: string
  updatedAt: string
}

export const orderService = {
  async createOrder(
    items: { productId: string; quantity: number }[],
    delivery: Delivery,
    paymentMethod?: 'cod' | 'khalti'
  ): Promise<Order> {
    const { data } = await api.post(ENDPOINTS.orders.create, {
      items,
      delivery,
      paymentMethod: paymentMethod || 'cod',
    })
    return data.data
  },

  async getMyOrders(): Promise<Order[]> {
    const { data } = await api.get(ENDPOINTS.orders.getMy)
    return data.data
  },
}
