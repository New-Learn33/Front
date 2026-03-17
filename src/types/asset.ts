export interface Asset {
  id: number
  name: string
  type: '이미지' | '영상' | '오디오' | '폰트'
  size: string
  url: string
  created_at: string
}

export interface AssetListResponse {
  assets: Asset[]
  total: number
  storage_used: string
  storage_limit: string
}
