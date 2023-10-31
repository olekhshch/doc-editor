import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import projectsReducer from "../features/projects/projectsSlice"
import documentsReducer from "../features/documents/documentsSlice"
import stylingReducer from "../features/styling/stylingSlice"

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    documents: documentsReducer,
    styling: stylingReducer,
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
