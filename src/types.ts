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

export type DocContentComponent = HeadingElement | ParagraphElement

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

export interface ParagraphElement extends BasicComponent {
  type: "paragraph"
  content: string
}
