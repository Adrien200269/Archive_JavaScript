'use server'

import { revalidatePath } from 'next/cache'
import { getAllOrders, updateOrderStatus } from '../../api/admin/order'

export async function handleGetAllOrders() {
  try {
    const result = await getAllOrders()
    if (result.success) {
      return { success: true as const, data: result.data }
    }
    return { success: false as const, message: result.message || 'Failed to fetch orders' }
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error?.message || 'Failed to fetch orders'
    return { success: false as const, message }
  }
}

export async function handleUpdateOrderStatus(id: string, status: string) {
  try {
    const result = await updateOrderStatus(id, status)
    if (result.success) {
      revalidatePath('/admin/orders')
      return { success: true as const, data: result.data, message: result.message }
    }
    return { success: false as const, message: result.message || 'Failed to update order status' }
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error?.message || 'Failed to update order status'
    return { success: false as const, message }
  }
}
