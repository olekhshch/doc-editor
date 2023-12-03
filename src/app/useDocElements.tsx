import { useRef, useState, useEffect, useCallback } from "react"
import {
  addHeading,
  addImage,
  addParagraph,
  addSeparator,
  addTable,
} from "../features/documents/documentsSlice"
import { useAppDispatch, useAppSelector } from "./hooks"
import focusElementsContext from "./focusElementsContext"
import {
  ColumnsElement,
  HeadingElement,
  ParagraphElement,
  columnParam,
  focusable,
} from "../types"
import findElementFromState from "../functions/findElementFromState"

/**
 * Hook to add elements depending on current active element position
 */
const useDocElements = () => {
  const dispatch = useAppDispatch()
  const { disableElementsAdding, activeContent } = useAppSelector(
    (state) => state.documents,
  )
  const { canvas_width } = useAppSelector((state) => state.styling.parameters)
  const {
    parameters: { activeTheme },
  } = useAppSelector((state) => state.styling)

  const addHeadingElement = (
    e: React.MouseEvent | KeyboardEvent,
    level?: 1 | 2 | 3,
  ) => {
    if (!disableElementsAdding) {
      dispatch(addHeading({ level: level ?? 2, column: null }))
    }
    e.stopPropagation()
  }

  const addParagraphElement = (e?: React.MouseEvent | KeyboardEvent) => {
    if (!disableElementsAdding) {
      dispatch(addParagraph({ column: null }))
    }
    e?.stopPropagation()
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
        addTable({ rows: rows ?? 3, columns: columns ?? 2, column: null }),
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

  const getVerticalPosition = (ref?: React.RefObject<HTMLElement>) => {
    const { top } = (ref ?? elementRef).current!.getBoundingClientRect()
    return top
  }

  const getLeftEdgePosition = () => {
    const { left } = elementRef.current!.getBoundingClientRect()

    return left
  }

  const getDimensions = (ref?: React.RefObject<HTMLElement>) => {
    const { width, height } = (
      ref ?? elementRef
    ).current!.getBoundingClientRect()

    return { width, height }
  }

  //GLOBAL MAX WIDTH

  const widthRef = document.querySelector("#max-width-ref")

  const [maxWidth, setMaxWidth] = useState(
    widthRef?.clientWidth ?? canvas_width,
  )

  useEffect(() => {
    const ref = widthRef ?? document.querySelector("#max-width-ref")
    if (ref) {
      const { clientWidth } = ref
      setMaxWidth(clientWidth)
    }
  }, [canvas_width, widthRef])

  useEffect(() => {
    const handleResize = (e: Event) => {
      const ref = widthRef ?? document.querySelector("#max-width-ref")
      if (ref) {
        const { clientWidth } = ref
        setMaxWidth(clientWidth)
      }
    }
    window.addEventListener("resize", handleResize)

    // return () => window.removeEventListener("resize", handleResize)
  }, [])

  //FOCUS ELEMENTS

  const focusElement = useCallback((element: focusable) => {
    if (element.focus) {
      element.focus()
      if (element.position) {
        element.position("end")
      }
    }
  }, [])

  const focusFirst = () => {
    if (activeContent) {
      const firstFocusableEl = activeContent.components.find(
        (el) => el.type === "paragraph",
      ) as ParagraphElement

      focusElement(firstFocusableEl)
    }
  }

  const focusLast = () => {
    if (activeContent) {
      const lastFocusableEl = activeContent.components.findLast((el) =>
        ["paragraph", "heading"].includes(el.type),
      ) as ParagraphElement | HeadingElement

      focusElement(lastFocusableEl)
    }
  }

  const focusColumnLast = (column: columnParam) => {
    if (activeContent && column) {
      const [targetColumnsEl, targetIdx] = findElementFromState(
        activeContent.components,
        column[0],
        null,
        "columns",
      ) as [ColumnsElement, number]

      if (targetColumnsEl) {
        const lastElementInColumn = targetColumnsEl[column[1]].findLast((el) =>
          ["paragraph", "heading"].includes(el.type),
        ) as focusable

        focusElement(lastElementInColumn)
      }
    }
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
    maxWidth,
    focusFirst,
    focusLast,
    focusColumnLast,
  }
}

export default useDocElements
