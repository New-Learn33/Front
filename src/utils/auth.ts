import { resolveApiUrl } from '@/config/env'
import type { User } from '@/types/auth'

export function normalizeUser(user: User): User {
  return {
    ...user,
    profile_image_url: resolveApiUrl(user.profile_image_url),
    avatar_url: resolveApiUrl(user.avatar_url),
  }
}
