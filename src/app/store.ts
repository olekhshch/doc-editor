import {
  configureStore,
  ThunkAction,
  Action,
  createSerializableStateInvariantMiddleware,
  isPlain,
} from "@reduxjs/toolkit"
import projectsReducer from "../features/projects/projectsSlice"
import documentsReducer from "../features/documents/documentsSlice"
import stylingReducer from "../features/styling/stylingSlice"

const serizableMiddleware = createSerializableStateInvariantMiddleware({
  isSerializable: (v: any) => true,
})

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    documents: documentsReducer,
    styling: stylingReducer,
  },
  middleware: [serizableMiddleware],
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
