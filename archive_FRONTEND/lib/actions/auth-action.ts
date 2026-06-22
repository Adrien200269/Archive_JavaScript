import Cookies from 'js-cookie'
import api from '../api/axios'
import { ENDPOINTS } from '../api/endpoints'
import { LoginValues, RegisterValues, User } from '../types/auth'

// A normalized result so components can handle success/failure uniformly.
export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> }

// Pulls a clean message out of an axios error.
function toError(err: any) {
  const res = err?.response?.data
  return {
    ok: false as const,
    message: res?.message || 'Something went wrong. Please try again.',
    fieldErrors: res?.errors as Record<string, string[]> | undefined,
  }
}

// REGISTER: send only the fields the API expects.
export async function registerAction(
  values: RegisterValues
): Promise<ActionResult<User>> {
  try {
    const { data } = await api.post(ENDPOINTS.auth.register, {
      fullName: values.fullName,
      email: values.email,
      password: values.password,
    })
    return { ok: true, data: data.data as User }
  } catch (err) {
    return toError(err)
  }
}

// LOGIN: on success, store the token in a cookie and return the user.
export async function loginAction(
  values: LoginValues
): Promise<ActionResult<{ token: string; user: User }>> {
  try {
    const { data } = await api.post(ENDPOINTS.auth.login, values)
    const { token, user } = data.data

    // The backend already sets an httpOnly cookie; we also store a readable
    // cookie here so client-side code (e.g. the dashboard) can check auth state.
    Cookies.set('token', token, { expires: 7, sameSite: 'lax', path: '/' })
    Cookies.set('user', JSON.stringify(user), { expires: 7, sameSite: 'lax', path: '/' })

    return { ok: true, data: { token, user } }
  } catch (err) {
    return toError(err)
  }
}

export function logoutAction() {
  Cookies.remove('token')
  Cookies.remove('user')
  // fire-and-forget call to clear the httpOnly cookie too
  api.post(ENDPOINTS.auth.logout).catch(() => {})
}

export function getCurrentUser(): User | null {
  const raw = Cookies.get('user')
  if (!raw) return null
  try {
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}
