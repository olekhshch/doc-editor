import { createContext } from "react"

interface focusContext {
  [key: number]: () => void
}

const focusFunctions = createContext<focusContext>({})

export default focusFunctions
