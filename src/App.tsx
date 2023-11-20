import React, { useEffect, useState } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Root from "./pages/root/Root"
import Editor from "./pages/editor/Editor"
import NotFoundScreen from "./pages/editor/NotFoundScreen"
import ActiveDocRedirect from "./pages/editor/ActiveDocRedirect"
import { useAppDispatch, useAppSelector } from "./app/hooks"
import usePersist from "./app/usePersist"
import { setStylingTemplates } from "./features/styling/stylingSlice"

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

  // const templatesStringified = JSON.stringify(templates)

  const [checkedLS, setCheckedLS] = useState(false)

  useEffect(() => {
    //Checking if any styling templates are in the local storage on mount
    try {
      const styling_templates = appPersist.getStylingTemplates_LS()
      dispatch(setStylingTemplates(styling_templates))
      setCheckedLS(true)
    } catch (err) {
      console.log("ERROR while checking styling templates in LS")
    }
  }, [])

  useEffect(() => {
    //persisting styling templates to LS
    if (checkedLS) {
      appPersist.saveStylingTemplates_LS()
    }
  }, [templates, appPersist, checkedLS])

  // useEffect(() => {
  //   //checking if any styling templates were saved
  //   try {
  //     const styling_templates = appPersist.getStylingTemplates_LS()
  //     console.log({ styling_templates, templates })
  //     dispatch(setStylingTemplates(styling_templates))
  //   } catch (err) {
  //     console.log("error while checking styling templates in LS")
  //   }
  // }, [])
  return <RouterProvider router={router}></RouterProvider>
}

export default App
