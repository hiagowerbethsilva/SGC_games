import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { AuthUser } from '../types'

const STORAGE_KEY = 'sgc_auth'
const TOKEN_KEY = 'sgc_token'

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (user: AuthUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function loadStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => loadStoredUser())

  const login = (authUser: AuthUser) => {
    setUser(authUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser))
    if (authUser.token) {
      localStorage.setItem(TOKEN_KEY, authUser.token)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(TOKEN_KEY)
  }

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token && user?.token) {
      localStorage.setItem(TOKEN_KEY, user.token)
    }
  }, [user])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}
