import { createContext } from "react"

export type RootWindow = "rename-doc" | "create-project"

export interface WindowContextInterface {
  isOpen: boolean
  setIsopen: (a: boolean) => void
  windowType: RootWindow
  setWindowType: (wt: RootWindow) => void
  windowCoordinates: { top: number; left: number }
  setWindowCoordinates: (newCoord: { top: number; left: number }) => void
  renameDocId: number | null
  setRenameDocId: (id: number) => void
  renameDocTitle: string
  setRenameDocTitle: (newTitle: string) => void
}
const defaultValue: WindowContextInterface = {
  isOpen: false,
  setIsopen: (a) => {},
  windowType: "create-project",
  setWindowType: (wt) => {},
  windowCoordinates: { top: 100, left: 100 },
  setWindowCoordinates: (newCoord) => {},
  renameDocId: null,
  setRenameDocId: (a) => {},
  renameDocTitle: "",
  setRenameDocTitle: (a) => {},
}

const WindowContext = createContext(defaultValue)
export default WindowContext
