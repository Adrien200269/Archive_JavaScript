import api from './axios'
import { ENDPOINTS } from './endpoints'
import type { Product } from './product'

export const recommendationService = {
  async getRecommendations(limit = 8): Promise<Product[]> {
    const { data } = await api.get(ENDPOINTS.recommendations.get, {
      params: { limit },
    })
    return data.data
  },
}
