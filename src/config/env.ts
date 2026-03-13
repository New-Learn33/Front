function getFallbackApiBaseUrl() {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }

  return 'http://localhost:8000'
}

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || getFallbackApiBaseUrl()).replace(/\/+$/, '')
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

export function resolveApiUrl(path?: string | null) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}
