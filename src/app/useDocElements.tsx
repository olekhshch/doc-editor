import { useRef } from "react"
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

  const addHeadingElement = (
    e: React.MouseEvent | KeyboardEvent,
    level?: 1 | 2 | 3,
  ) => {
    if (!disableElementsAdding) {
      dispatch(addHeading({ level: level ?? 2, column: null }))
    }
    e.stopPropagation()
  }

  const addParagraphElement = (e: React.MouseEvent | KeyboardEvent) => {
    if (!disableElementsAdding) {
      dispatch(addParagraph({ column: null }))
    }
    e.stopPropagation()
  }

  const addSeparatorElement = (e: React.MouseEvent | KeyboardEvent) => {
    if (!disableElementsAdding) {
      dispatch(addSeparator({ currentTheme: activeTheme }))
    }
    e.stopPropagation()
  }

  const addTableElement = (
    e: React.MouseEvent | KeyboardEvent,
    rows?: number,
    columns?: number,
  ) => {
    if (!disableElementsAdding) {
      dispatch(
        addTable({ rows: rows ?? 2, columns: columns ?? 3, column: null }),
      )
    }
    e.stopPropagation()
  }

  const addImageElement = (src: string, width: number) => {
    if (!disableElementsAdding) {
      dispatch(
        addImage({
          src,
          column: null,
          width,
        }),
      )
    }
  }

  const elementRef = useRef<HTMLDivElement>(null)!

  const getVerticalPosition = () => {
    const { top } = elementRef.current!.getBoundingClientRect()
    return top
  }

  const getLeftEdgePosition = () => {
    const { left } = elementRef.current!.getBoundingClientRect()

    return left
  }

  const getDimensions = () => {
    const { width, height } = elementRef.current!.getBoundingClientRect()

    return { width, height }
  }

  return {
    addHeadingElement,
    addParagraphElement,
    addSeparatorElement,
    addTableElement,
    addImageElement,
    getVerticalPosition,
    getLeftEdgePosition,
    elementRef,
    getDimensions,
  }
}

export default useDocElements
