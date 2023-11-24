import { createContext } from "react"

export const ColumnsElementContext = createContext<{
  left: null | number
  right: null | number
}>({
  left: null,
  right: null,
})
