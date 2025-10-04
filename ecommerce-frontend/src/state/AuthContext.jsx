import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getMe } from '../lib/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('auth-user')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('auth-token')
    // Trust existing local user immediately to avoid redirect flicker
    setLoading(false)
    if (!token) return
    getMe()
      .then((res) => {
        const me = res?.data || null
        setUser(me)
        try { localStorage.setItem('auth-user', JSON.stringify(me)) } catch {}
      })
      .catch(() => {
        // Keep existing local user if present; do not force logout here
      })
  }, [])

  useEffect(() => {
    try {
      if (user) localStorage.setItem('auth-user', JSON.stringify(user))
      else localStorage.removeItem('auth-user')
    } catch {}
  }, [user])

  const value = useMemo(() => ({ user, setUser, loading }), [user, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


