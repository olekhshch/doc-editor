import { PayloadAction } from "@reduxjs/toolkit"
import {
  ColumnsElement,
  DocContentComponent,
  columnParam,
} from "../../../types"
import { DocumentsState } from "../initialState"
import findElementFromState from "../../../functions/findElementFromState"
import replaceElementInArray from "../../../functions/replaceElementInArray"

const setColumnsElDevisationAction = (
  state: DocumentsState,
  {
    payload,
  }: PayloadAction<{
    elementId: number
    newDeviation: number
    column: columnParam
  }>,
) => {
  const { column, elementId, newDeviation } = payload
  state.disableElementsAdding = true
  const [targetElement, targetIdx] = findElementFromState(
    state.activeContent!.components,
    elementId,
    column,
    "columns",
  ) as [ColumnsElement, number]

  if (targetElement) {
    targetElement.deviation = newDeviation

    state.activeContent!.components = replaceElementInArray(
      targetElement,
      state.activeContent!.components,
      column,
      targetIdx,
    ) as (DocContentComponent | ColumnsElement)[]
  }
  state.disableElementsAdding = false
}

export default setColumnsElDevisationAction
