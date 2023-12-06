import { PayloadAction } from "@reduxjs/toolkit"
import { DocumentsState } from "../initialState"
import findElementFromState from "../../../functions/findElementFromState"
import {
  ColumnsElement,
  DocContentComponent,
  ImageElement,
} from "../../../types"
import replaceElementInArray from "../../../functions/replaceElementInArray"

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
  const { imageElId, newWidth, newLeftMargin, column } = payload

  state.disableElementsAdding = true

  try {
    const [targetElement, targetIdx] = findElementFromState(
      state.activeContent!.components,
      imageElId,
      column,
      "image",
    ) as [ImageElement, number]

    if (targetElement) {
      targetElement.width = newWidth ?? targetElement.width
      targetElement.left_margin = newLeftMargin ?? targetElement.left_margin

      state.activeContent!.components = replaceElementInArray(
        targetElement,
        state.activeContent!.components,
        column,
        targetIdx,
      ) as (DocContentComponent | ColumnsElement)[]
    }
  } catch (err) {
    console.log("ERROR couldnt change image width")
  } finally {
    state.disableElementsAdding = false
  }

  // if (payload.column !== null) {
  //   const [columnId, side] = payload.column
  //   const ColumnEl = state.activeContent!.components.find(
  //     (el) => el._id === columnId && el.type === "columns",
  //   ) as ColumnsElement

  //   const newSide = ColumnEl[side].map((element) => {
  //     if (element._id === payload.imageElId && element.type === "image") {
  //       return {
  //         ...element,
  //         width: payload.newWidth,
  //         left_margin: payload.newLeftMargin ?? element.left_margin,
  //       }
  //     }
  //     return element
  //   })

  //   state.activeContent!.components = state.activeContent!.components.map(
  //     (el) => {
  //       if (el._id === columnId && el.type === "columns") {
  //         return { ...el, [side]: newSide }
  //       }
  //       return el
  //     },
  //   )
  // } else {
  //   state.activeContent!.components = state.activeContent!.components.map(
  //     (el) => {
  //       if (el._id === payload.imageElId && el.type === "image") {
  //         return {
  //           ...el,
  //           width: payload.newWidth,
  //           left_margin: payload.newLeftMargin ?? el.left_margin,
  //         }
  //       }
  //       return el
  //     },
  //   )
  // }
}

export default setImageWidthAction
