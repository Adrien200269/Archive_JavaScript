'use server'

import { revalidatePath } from 'next/cache'
import { getAllProducts, addProduct, updateProduct, deleteProduct } from '../../api/admin/product'

export async function handleGetAllProducts() {
  try {
    const result = await getAllProducts()
    if (result.success) {
      return { success: true as const, data: result.data }
    }
    return { success: false as const, message: result.message || 'Failed to fetch products' }
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error?.message || 'Failed to fetch products'
    return { success: false as const, message }
  }
}

export async function handleAddProduct(formData: FormData) {
  try {
    const result = await addProduct(formData)
    if (result.success) {
      revalidatePath('/admin/products')
      return { success: true as const, data: result.data, message: result.message }
    }
    return { success: false as const, message: result.message || 'Failed to add product' }
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error?.message || 'Failed to add product'
    return { success: false as const, message }
  }
}

export async function handleUpdateProduct(id: string, formData: FormData) {
  try {
    const result = await updateProduct(id, formData)
    if (result.success) {
      revalidatePath('/admin/products')
      return { success: true as const, data: result.data, message: result.message }
    }
    return { success: false as const, message: result.message || 'Failed to update product' }
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error?.message || 'Failed to update product'
    return { success: false as const, message }
  }
}

export async function handleDeleteProduct(id: string) {
  try {
    const result = await deleteProduct(id)
    if (result.success) {
      revalidatePath('/admin/products')
      return { success: true as const, message: result.message }
    }
    return { success: false as const, message: result.message || 'Failed to delete product' }
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error?.message || 'Failed to delete product'
    return { success: false as const, message }
  }
}
