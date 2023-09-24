import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import projectsReducer from "../features/projects/projectsSlice"
import documentsReducer from "../features/documents/documentsSlice"
export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    documents: documentsReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
