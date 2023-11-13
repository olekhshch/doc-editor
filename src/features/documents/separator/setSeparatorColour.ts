import { PayloadAction } from "@reduxjs/toolkit"
import { DocumentsState } from "../initialState"
import {
  ColumnsElement,
  DocContentComponent,
  SeparatorElement,
  SwatchesColour,
} from "../../../types"
import findElementFromState from "../../../functions/findElementFromState"
import replaceElementInArray from "../../../functions/replaceElementInArray"

const setSeparatorColour = (
  state: DocumentsState,
  {
    payload,
  }: PayloadAction<{
    elementId: number
    column: null | [number, "left" | "right"]
    newColour: SwatchesColour
  }>,
) => {
  if (state.activeContent) {
    const oldElements = [...state.activeContent.components]

    try {
      const [targetSeparatorEl, targetSeparatorIdx] = findElementFromState(
        state.activeContent!.components,
        payload.elementId,
        payload.column,
        "separator",
      ) as [SeparatorElement | undefined, number]

      if (targetSeparatorEl) {
        targetSeparatorEl.colour = payload.newColour
        state.activeContent.components = replaceElementInArray(
          targetSeparatorEl,
          state.activeContent.components,
          payload.column,
          targetSeparatorIdx,
        ) as (DocContentComponent | ColumnsElement)[]
      }
      // if (payload.column === null) {
      //   //separator is not a part of a column
      //   const targetSeparator = state.activeContent.components.find(
      //     (el) => el._id === payload.elementId && el.type === "separator",
      //   ) as SeparatorElement

      //   const newSeparator: SeparatorElement = {
      //     ...targetSeparator,
      //     colour: payload.newColour,
      //   }

      //   const { orderIndex } = targetSeparator
      //   state.activeContent.components[orderIndex] = newSeparator
      // } else {
      //   //separator is a part of a column
      //   const [columnId, side] = payload.column
      //   const targetColumn = state.activeContent!.components.find(
      //     (el) => el._id === columnId && el.type === "columns",
      //   ) as ColumnsElement
      //   const newSide = targetColumn[side].map((el) => {
      //     if (el._id === payload.elementId && el.type === "separator") {
      //       return { ...el, colour: payload.newColour }
      //     }
      //     return el
      //   })
      //   state.activeContent.components = state.activeContent.components.map(
      //     (el) => {
      //       if (el._id === columnId) {
      //         return { ...el, [side]: newSide }
      //       }
      //       return el
      //     },
      //   )
      // }
    } catch (e) {
      state.activeContent.components = oldElements
    }
  }
}

export default setSeparatorColour
