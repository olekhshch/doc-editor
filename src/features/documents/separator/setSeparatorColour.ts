import { PayloadAction } from "@reduxjs/toolkit"
import { DocumentsState } from "../initialState"
import { SeparatorElement, SwatchesColour } from "../../../types"

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
      if (payload.column === null) {
        //separator is not a part of a column
        const targetSeparator = state.activeContent.components.find(
          (el) => el._id === payload.elementId && el.type === "separator",
        ) as SeparatorElement

        const newSeparator: SeparatorElement = {
          ...targetSeparator,
          colour: payload.newColour,
        }

        const { orderIndex } = targetSeparator
        state.activeContent.components[orderIndex] = newSeparator
      }
    } catch (e) {
      state.activeContent.components = oldElements
    }
  }
}

export default setSeparatorColour
