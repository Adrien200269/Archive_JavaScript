import api from './axios'
import { ENDPOINTS } from './endpoints'

export interface KhaltiResponse {
  orderId: string
  paymentUrl: string
  pidx: string
}

export const paymentService = {
  async initiateKhaltiPayment(
    items: { productId: string; quantity: number }[],
    delivery: { name: string; address: string; phone: string }
  ): Promise<KhaltiResponse> {
    const { data } = await api.post(ENDPOINTS.payments.create, {
      items,
      delivery,
      paymentMethod: 'khalti',
    })
    return data.data
  },

  async verifyKhaltiPayment(pidx: string): Promise<void> {
    await api.post(ENDPOINTS.payments.verify, { pidx })
  },
}
