import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { initialState } from "./initialState"
import { ProjectInterface } from "../../types"
const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    createNewProject: (state) => {
      const _id = Math.round(Math.random() * 10000)
      const newProject: ProjectInterface = {
        _id,
        title: "New project",
        createdOn: Date(),
      }
      state.projects = [...state.projects, newProject]
    },
    deleteProject: (state, { payload }: PayloadAction<number>) => {
      state.projects = state.projects.filter(
        (project) => project._id !== payload,
      )
    },
    setEditTitleId: (state, { payload }: PayloadAction<number | null>) => {
      state.editTitleId = payload
    },
    renameProject: (state, { payload }: PayloadAction<string>) => {
      state.projects = state.projects.map((project) => {
        if (project._id === state.editTitleId) {
          return { ...project, title: payload }
        }
        return project
      })
    },
  },
})

export default projectsSlice.reducer
export const {
  createNewProject,
  deleteProject,
  setEditTitleId,
  renameProject,
} = projectsSlice.actions
