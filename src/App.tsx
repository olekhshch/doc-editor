import React from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Root from "./pages/root/Root"
import Editor from "./pages/editor/Editor"
import EditorNewDoc from "./pages/editor/EditorNewDoc"

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
    element: <EditorNewDoc />,
  },
])

const App = () => {
  return <RouterProvider router={router}></RouterProvider>
}

export default App
