import { createContext } from "react"
import { FocusType } from "remirror"

export type focusCallback = {
  elementId: number
  focus: () => void
  position: (f: FocusType) => void
}

interface focusState {
  callbacks: focusCallback[]
  addElementToContext: (fc: focusCallback) => void
}

/**
 * Context which stores focus callback for focusable elements (text blocks, headings etc.)
 */
const FocusContext = createContext<focusState>({
  callbacks: [],
  addElementToContext: (fc) => {},
})

export default FocusContext
