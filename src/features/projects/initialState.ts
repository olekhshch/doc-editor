import { ProjectInterface } from "../../types"
import { sortBy } from "./sorting"

export interface ProjectsState {
  projects: ProjectInterface[]
  editTitleId: null | number
  sortBy: sortBy
}

export const initialState: ProjectsState = {
  projects: [],
  editTitleId: null,
  sortBy: sortBy.DEFAULT,
}
