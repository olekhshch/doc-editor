import {
  addHeading,
  addImage,
  addParagraph,
  addSeparator,
  addTable,
} from "../features/documents/documentsSlice"
import { useAppDispatch, useAppSelector } from "./hooks"

/**
 * Hook to add elements depending on current active element position
 */
const useDocElements = () => {
  const dispatch = useAppDispatch()
  const { disableElementsAdding } = useAppSelector((state) => state.documents)
  const { activeTheme } = useAppSelector((state) => state.styling)

  const addHeadingElement = (e: React.MouseEvent, level?: 1 | 2 | 3) => {
    if (!disableElementsAdding) {
      dispatch(addHeading({ level: level ?? 2, column: null }))
    }
    e.stopPropagation()
  }

  const addParagraphElement = (e: React.MouseEvent) => {
    dispatch(addParagraph({ column: null }))
    e.stopPropagation()
  }

  const addSeparatorElement = (e: React.MouseEvent) => {
    dispatch(addSeparator({ currentTheme: activeTheme }))
    e.stopPropagation()
  }

  const addTableElement = (
    e: React.MouseEvent,
    rows?: number,
    columns?: number,
  ) => {
    dispatch(addTable({ rows: rows ?? 2, columns: columns ?? 3, column: null }))
    e.stopPropagation()
  }

  const addImageElement = (src: string, width: number) => {
    dispatch(
      addImage({
        src,
        column: null,
        width,
      }),
    )
  }

  return {
    addHeadingElement,
    addParagraphElement,
    addSeparatorElement,
    addTableElement,
    addImageElement,
  }
}

export default useDocElements
