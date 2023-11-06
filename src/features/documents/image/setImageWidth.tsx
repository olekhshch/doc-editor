import { PayloadAction } from "@reduxjs/toolkit"
import { DocumentsState } from "../initialState"
import { ColumnsElement } from "../../../types"

const setImageWidthAction = (
  state: DocumentsState,
  {
    payload,
  }: PayloadAction<{
    imageElId: number
    newWidth?: number
    newLeftMargin?: number
    column: null | [number, "left" | "right"]
  }>,
) => {
  if (payload.column !== null) {
    const [columnId, side] = payload.column
    const ColumnEl = state.activeContent!.components.find(
      (el) => el._id === columnId && el.type === "columns",
    ) as ColumnsElement

    const newSide = ColumnEl[side].map((element) => {
      if (element._id === payload.imageElId && element.type === "image") {
        return {
          ...element,
          width: payload.newWidth,
          left_margin: payload.newLeftMargin ?? element.left_margin,
        }
      }
      return element
    })

    state.activeContent!.components = state.activeContent!.components.map(
      (el) => {
        if (el._id === columnId && el.type === "columns") {
          return { ...el, [side]: newSide }
        }
        return el
      },
    )
  } else {
    state.activeContent!.components = state.activeContent!.components.map(
      (el) => {
        if (el._id === payload.imageElId && el.type === "image") {
          return {
            ...el,
            width: payload.newWidth,
            left_margin: payload.newLeftMargin ?? el.left_margin,
          }
        }
        return el
      },
    )
  }
}

export default setImageWidthAction
