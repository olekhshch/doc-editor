import {
  configureStore,
  ThunkAction,
  Action,
  createSerializableStateInvariantMiddleware,
  createListenerMiddleware,
} from "@reduxjs/toolkit"
import projectsReducer from "../features/projects/projectsSlice"
import documentsReducer from "../features/documents/documentsSlice"
import stylingReducer from "../features/styling/stylingSlice"

// const serizableMiddleware = createSerializableStateInvariantMiddleware({
//   isSerializable: (v: any) => true,
// })

/**Listens to doc content change and saves it to documents array*/
const contentListenerMiddleware = createListenerMiddleware()

contentListenerMiddleware.startListening({
  predicate: (action, currentState, prevState) => {
    return (
      (currentState as RootState).documents.activeContent !==
      (prevState as RootState).documents.activeContent
    )
  },
  effect: (action) => {
    console.log({ action })
  },
})

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    documents: documentsReducer,
    styling: stylingReducer,
  },
  // middleware: (getDefault) =>
  //   getDefault().prepend(contentListenerMiddleware.middleware),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
