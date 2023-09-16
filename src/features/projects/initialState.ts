import { ProjectInterface } from "../../types"

export interface ProjectsState {
  projects: ProjectInterface[]
  editTitleId: null | number
}

export const initialState: ProjectsState = {
  projects: [],
  editTitleId: null,
}
