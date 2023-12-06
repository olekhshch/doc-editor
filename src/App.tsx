import React, { useEffect, useState } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Root from "./pages/root/Root"
import Editor from "./pages/editor/Editor"
import NotFoundScreen from "./pages/editor/NotFoundScreen"
import ActiveDocRedirect from "./pages/editor/ActiveDocRedirect"
import { useAppDispatch, useAppSelector } from "./app/hooks"
import usePersist from "./app/usePersist"
import { setStylingTemplates } from "./features/styling/stylingSlice"
import {
  cacheActiveDoc,
  cacheDocuments,
} from "./features/documents/documentsSlice"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "docs/:docId",
    element: <Editor />,
    errorElement: <NotFoundScreen />,
  },
  {
    path: "docs/docs/",
    element: <Editor />,
    errorElement: <NotFoundScreen />,
  },
  {
    path: "docs",
    element: <ActiveDocRedirect />,
  },
  {
    path: "not-found",
    element: <NotFoundScreen />,
  },
])

const App = () => {
  const appPersist = usePersist()
  const dispatch = useAppDispatch()

  const { templates } = useAppSelector((state) => state.styling)
  const { documents, activeDocumentInfo, activeContent } = useAppSelector(
    (state) => state.documents,
  )

  // const templatesStringified = JSON.stringify(templates)

  const [checkedLS, setCheckedLS] = useState(false)

  useEffect(() => {
    // Checking if any styling templates and docs are in the local storage on mount
    try {
      const styling_templates = appPersist.getStylingTemplates_LS()
      dispatch(setStylingTemplates(styling_templates))

      const cached_documents = appPersist.getCachedDocuments_LS()
      dispatch(cacheDocuments(cached_documents))

      setCheckedLS(true)
    } catch (err) {
      console.log("ERROR while checking styling templates in LS")
    }
  }, [])

  useEffect(() => {
    // persisting styling templates to LS
    try {
      if (checkedLS) {
        appPersist.saveStylingTemplates_LS()
      }
    } catch (err) {
      console.log("ERROR while saving styling templates")
    }
  }, [templates, appPersist, checkedLS])

  // CHECKING ACTIVE DOC CHANGES
  // useEffect(() => {
  //   try {
  //     //autosaving every 30 sec
  //     setInterval(() => {
  //       if (activeContent && activeDocumentInfo && checkedLS) {
  //         dispatch(cacheActiveDoc())
  //         console.log("doc cached")
  //         appPersist.saveAllDocuments_LS()
  //       }
  //     }, 30000)
  //   } catch (err) {
  //     console.log("ERROR while saving documents to LS")
  //   }
  // }, [activeContent, activeDocumentInfo, checkedLS, dispatch])

  useEffect(() => {
    dispatch(cacheActiveDoc())
    if (checkedLS) {
      appPersist.saveAllDocuments_LS()
    }
  }, [dispatch, activeContent?.components, documents.length])

  return <RouterProvider router={router}></RouterProvider>
}

export default App
