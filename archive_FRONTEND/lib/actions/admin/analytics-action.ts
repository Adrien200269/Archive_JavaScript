'use server'

import { getAnalytics, AnalyticsData } from '../../api/admin/analytics'

export async function handleGetAnalytics(): Promise<{ success: true; data: AnalyticsData } | { success: false; message: string }> {
  try {
    const result = await getAnalytics()
    if (result.success) {
      return { success: true as const, data: result.data }
    }
    return { success: false as const, message: result.message || 'Failed to fetch analytics' }
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error?.message || 'Failed to fetch analytics'
    return { success: false as const, message }
  }
}
