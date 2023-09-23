export interface ProjectInterface {
  _id: number
  title: string
  createdOn: number
  isCollapsed: boolean
  isPinned: boolean
  orderIndex: number
}

export interface DocumentInterface {
  _id: number
  projectId: number
  title: string
  createdOn: Date
}
