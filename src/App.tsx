import React from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Root from "./pages/root/Root"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
])

const App = () => {
  return <RouterProvider router={router}></RouterProvider>
}

export default App
