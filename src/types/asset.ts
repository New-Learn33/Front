export interface Asset {
  id: string
  name: string
  image_url: string
  category_id: string
  category_hint?: string
  character_name?: string
  gender?: string
  appearance?: Record<string, string>
  outfit?: Record<string, string>
  style_keywords?: string[]
  forbidden_changes?: string[]
  custom_tags?: string[]
  file_size?: number
  created_at?: string
}

export interface AssetListResponse {
  success: boolean
  message: string
  data: Asset[]
}
