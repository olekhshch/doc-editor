import { ProjectInterface } from "../../types"

export interface ProjectsState {
  projects: ProjectInterface[]
  editTitleId: null | number
  sortBy: sortingOption
  viewMode: "lists" | "papers"
}

export type sortingOption =
  | "DEFAULT"
  | "DATE_OLDEST"
  | "DATE_NEWEST"
  | "ALPHABET"

export type sortingOptions = {
  [key in keyof sortingOption as sortingOption]: string
}

export const initialState: ProjectsState = {
  projects: [],
  editTitleId: null,
  sortBy: "DEFAULT",
  viewMode: "lists",
}
