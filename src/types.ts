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
