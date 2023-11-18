import React from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Root from "./pages/root/root"
import Editor from "./pages/editor/Editor"
import NotFoundScreen from "./pages/editor/NotFoundScreen"
import ActiveDocRedirect from "./pages/editor/ActiveDocRedirect"

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
  return <RouterProvider router={router}></RouterProvider>
}

export default App
