'use server'

import { revalidatePath } from 'next/cache'
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../../api/admin/user'

// ── Get all users (paginated + search) ──────────────────────────────────────
export async function handleGetAllUsers({
  page = 1,
  limit = 10,
  search = '',
}: {
  page?: number
  limit?: number
  search?: string
}) {
  try {
    const result = await getAllUsers({ page, limit, search })
    if (result.success) {
      return { success: true, data: result.data, pagination: result.meta }
    }
    return { success: false as const, message: result.message || 'Failed to fetch users' }
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error?.message || 'Failed to fetch users'
    return { success: false as const, message }
  }
}

// ── Get single user ──────────────────────────────────────────────────────────
export async function handleGetUserById(id: string) {
  try {
    const result = await getUserById(id)
    if (result.success) {
      return { success: true as const, data: result.data }
    }
    return { success: false as const, message: result.message || 'Failed to fetch user' }
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error?.message || 'Failed to fetch user'
    return { success: false as const, message }
  }
}

// ── Create user ──────────────────────────────────────────────────────────────
export async function handleCreateUser(data: {
  fullName: string
  email: string
  password: string
  role: string
}) {
  try {
    const result = await createUser(data)
    if (result.success) {
      revalidatePath('/admin/users')
      return { success: true as const, data: result.data, message: result.message }
    }
    return { success: false as const, message: result.message || 'Failed to create user' }
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error?.message || 'Failed to create user'
    return { success: false as const, message }
  }
}

// ── Update user ──────────────────────────────────────────────────────────────
export async function handleUpdateUser(
  id: string,
  data: { fullName?: string; email?: string; role?: string; password?: string }
) {
  try {
    const result = await updateUser(id, data)
    if (result.success) {
      revalidatePath('/admin/users')
      revalidatePath(`/admin/users/${id}`)
      return { success: true as const, data: result.data, message: result.message }
    }
    return { success: false as const, message: result.message || 'Failed to update user' }
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error?.message || 'Failed to update user'
    return { success: false as const, message }
  }
}

// ── Delete user ──────────────────────────────────────────────────────────────
export async function handleDeleteUser(id: string) {
  try {
    const result = await deleteUser(id)
    if (result.success) {
      revalidatePath('/admin/users')
      return { success: true as const, message: result.message }
    }
    return { success: false as const, message: result.message || 'Failed to delete user' }
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error?.message || 'Failed to delete user'
    return { success: false as const, message }
  }
}
