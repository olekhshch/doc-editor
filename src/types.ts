export interface ProjectInterface {
  _id: number
  title: string
  createdOn: number
  isCollapsed: boolean
  isPinned: boolean
  orderIndex: number
}
export interface DocumentPreviewInterface {
  _id: number
  projectId: number | null
  title: string
  createdOn: number
}
export interface DocumentInterface extends DocumentPreviewInterface {}

export interface DocumentContent {
  _id: number
  docId: number
  components: DocContentComponent[]
}

export type DocContentComponent = HeadingElement | ParapraphElement

export type ContentComponentType = "heading" | "paragraph" | "image"

export interface BasicComponent {
  id: number
  type: ContentComponentType
  orderIdx: number
}

export interface HeadingElement extends BasicComponent {
  type: "heading"
  level: 1 | 2 | 3
  content: string
}

export interface ParapraphElement extends BasicComponent {
  type: "paragraph"
  content: string
}
