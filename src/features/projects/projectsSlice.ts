import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { initialState, sortingOption } from "./initialState"
import { ProjectInterface } from "../../types"
import { reoderArray } from "../../functions/reorderArray"
import { sortBy } from "./sorting"

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    createNewProject: (state) => {
      const _id = Math.round(Math.random() * 10000)
      const newProject: ProjectInterface = {
        _id,
        title: "New project",
        createdOn: new Date().getTime(),
        isCollapsed: false,
        isPinned: false,
        orderIndex: state.projects.length,
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
    collapseProject: (state, { payload }: PayloadAction<number>) => {
      console.log(payload)
      state.projects = state.projects.map((project) => {
        if (project._id === payload) {
          return { ...project, isCollapsed: true }
        }
        return project
      })
    },
    expandProject: (state, { payload }: PayloadAction<number>) => {
      state.projects = state.projects.map((project) => {
        if (project._id === payload) {
          return { ...project, isCollapsed: false }
        }
        return project
      })
    },
    setSortBy: (state, { payload }: PayloadAction<sortingOption>) => {
      state.sortBy = payload
    },
    moveProject: (
      state,
      {
        payload,
      }: PayloadAction<{ elementToMoveId: number; newPlacementIndex: number }>,
    ) => {
      const oldProjects = [...state.projects]
      const newProjects = reoderArray(
        oldProjects,
        payload.elementToMoveId,
        payload.newPlacementIndex,
      ) as ProjectInterface[]
      state.projects = newProjects
    },
  },
})

export default projectsSlice.reducer
export const {
  createNewProject,
  deleteProject,
  setEditTitleId,
  renameProject,
  moveProject,
  setSortBy,
  collapseProject,
  expandProject,
} = projectsSlice.actions
