export interface ProjectInterface {
  _id: number
  title: string
  createdOn: Date
}

export interface DocumentInterface {
  _id: number
  projectId: number
  title: string
  createdOn: Date
}
