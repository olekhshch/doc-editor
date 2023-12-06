import { PayloadAction } from "@reduxjs/toolkit"
import { DocumentsState } from "../initialState"
import {
  ColumnsElement,
  DocContentComponent,
  SeparatorElement,
} from "../../../types"
import findElementFromState from "../../../functions/findElementFromState"
import replaceElementInArray from "../../../functions/replaceElementInArray"

const setSeparatorWidthAction = (
  state: DocumentsState,
  {
    payload,
  }: PayloadAction<{
    separatorId: number
    column: null | [number, "left" | "right"]
    newWidth: number
  }>,
) => {
  const { separatorId, newWidth, column } = payload

  state.disableElementsAdding = true

  try {
    const [targetElement, targetIdx] = findElementFromState(
      state.activeContent!.components,
      separatorId,
      column,
      "image",
    ) as [SeparatorElement, number]

    if (targetElement) {
      targetElement.width = newWidth

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
}

export default setSeparatorWidthAction
