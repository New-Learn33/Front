import { useState, useEffect } from 'react'
import type { User } from '@/types/auth'
import { authApi } from '@/api/auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')

    if (!token) {
      setIsLoading(false)
      return
    }

    // /auth/me API로 현재 유저 정보 조회
    authApi.me()
      .then((res) => {
        const userData = res.data.data
        setUser(userData)
        setIsLoggedIn(true)
        localStorage.setItem('user', JSON.stringify(userData))
      })
      .catch(() => {
        // 토큰 만료 또는 유효하지 않은 경우
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
        setUser(null)
        setIsLoggedIn(false)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const logout = async () => {
    try {
      await authApi.logout()
    } catch {
      // 토큰 만료 등으로 실패해도 로컬은 정리
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      setUser(null)
      setIsLoggedIn(false)
      window.location.href = '/'
    }
  }

  return { user, isLoggedIn, isLoading, logout }
}
