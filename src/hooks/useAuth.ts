import { useState, useEffect } from 'react'
import type { User } from '@/types/auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const savedUser = localStorage.getItem('user')

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser))
        setIsLoggedIn(true)
      } catch {
        setUser(null)
        setIsLoggedIn(false)
      }
    }
  }, [])

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    setUser(null)
    setIsLoggedIn(false)
    window.location.href = '/'
  }

  return { user, isLoggedIn, logout }
}
