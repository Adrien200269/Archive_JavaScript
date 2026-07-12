'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import Cookies from 'js-cookie'
import api from '../../lib/api/axios'
import { ENDPOINTS } from '../../lib/api/endpoints'
import { User } from '../../lib/types/auth'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: User) => void
}

function getUserFromCookie(): User | null {
  const raw = Cookies.get('user')
  if (!raw) return null
  try {
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    let cancelled = false
    async function checkAuth() {
      try {
        const { data } = await api.get(ENDPOINTS.auth.whoami)
        if (data.success && data.data) {
          const loadedUser = data.data as User
          if (!cancelled) setUser(loadedUser)
          Cookies.set('user', JSON.stringify(loadedUser), { expires: 7, sameSite: 'lax', path: '/' })
          return
        }
      } catch {
        // API unavailable — fall through to cookie fallback
      } finally {
        if (!cancelled) {
          // Fallback: use user cookie if whoami failed
          const cookieUser = getUserFromCookie()
          if (cookieUser) {
            setUser(cookieUser)
          } else {
            setUser(null)
            Cookies.remove('user', { path: '/' })
            Cookies.remove('token', { path: '/' })
          }
          setLoading(false)
        }
      }
    }
    checkAuth()
    return () => { cancelled = true }
  }, [])

  const login = (userData: User, token: string) => {
    setUser(userData)
    Cookies.set('token', token, { expires: 7, sameSite: 'lax', path: '/' })
    Cookies.set('user', JSON.stringify(userData), { expires: 7, sameSite: 'lax', path: '/' })
  }

  const logout = async () => {
    try {
      await api.post(ENDPOINTS.auth.logout)
    } catch (e) {
      // Ignored
    }
    setUser(null)
    Cookies.remove('token', { path: '/' })
    Cookies.remove('user', { path: '/' })
  }

  const updateUser = (userData: User) => {
    setUser(userData)
    Cookies.set('user', JSON.stringify(userData), { expires: 7, sameSite: 'lax', path: '/' })
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
