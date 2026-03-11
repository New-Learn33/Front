export interface GenerationRequest {
  category_id: number
  prompt: string
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
