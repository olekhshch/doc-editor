import { PayloadAction } from "@reduxjs/toolkit"
import { DocumentsState } from "../initialState"

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

export default setImageWidthAction
