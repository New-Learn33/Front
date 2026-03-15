export interface AssetAppearance {
  hair_color?: string
  hair_style?: string
  eye_color?: string
  skin_tone?: string
  body_type?: string
  face_shape?: string
  distinguishing_features?: string[]
}

export interface AssetOutfit {
  top?: string
  bottom?: string
  shoes?: string
  accessories?: string[]
  overall_style?: string
}

export interface Asset {
  id: string
  name: string
  image_url: string
  category_id?: string
  gender?: string
  appearance?: AssetAppearance
  outfit?: AssetOutfit
  style_keywords?: string[]
  custom_tags?: string[]
}

export interface AssetListResponse {
  success: boolean
  data: Asset[]
}

export interface AssetUploadResponse {
  success: boolean
  message: string
  data: Asset
}
