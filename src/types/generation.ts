export interface GenerationRequest {
  category_id: number
  prompt: string
  art_style?: string
  genre?: string
  image_quality?: string
  motion_intensity?: string
}

export interface SceneItem {
  scene_order: number
  dialogue: string
  subtitle_text: string
}

export interface ImageItem {
  scene_order: number
  image_url: string
}

export interface SelectedTemplateImage {
  id: number
  name: string
  image_url: string
}

export interface GenerationData {
  job_id: number
  title: string
  category_id: number
  selected_template_image: SelectedTemplateImage
  scenes: SceneItem[]
  images: ImageItem[]
}

export interface GenerationResponse {
  success: boolean
  message: string
  data: GenerationData
}

// 자막 합성
export interface SubtitleRenderRequest {
  job_id: number
  images: ImageItem[]
  scenes: SceneItem[]
}

export interface SubtitleImageItem {
  scene_order: number
  image_url: string
}

export interface SubtitleRenderResponse {
  success: boolean
  message: string
  data: {
    job_id: number
    subtitle_images: SubtitleImageItem[]
  }
}

// 영상 렌더링
export interface VideoRenderRequest {
  job_id: number
  subtitle_images: {
    scene_order: number
    image_url: string
    duration: number
  }[]
}

export interface VideoRenderResponse {
  success: boolean
  message: string
  data: {
    job_id: number
    video_url: string
  }
}
