import React from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Root from "./pages/root/Root"
import Editor from "./pages/editor/Editor"
import NotFoundScreen from "./pages/editor/NotFoundScreen"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "docs/:docId",
    element: <Editor />,
  },
  {
    path: "docs",
    element: <Editor />,
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
