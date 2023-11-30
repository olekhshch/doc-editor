import { PayloadAction } from "@reduxjs/toolkit"
import { DocumentsState } from "../initialState"
import {
  ColumnsElement,
  DocContentComponent,
  SeparatorElement,
  columnParam,
} from "../../../types"
import findElementFromState from "../../../functions/findElementFromState"
import replaceElementInArray from "../../../functions/replaceElementInArray"

const setMarginsAction = (
  state: DocumentsState,
  {
    payload,
  }: PayloadAction<{
    elementId: number
    column: columnParam
    margin_top?: number
    margin_bottom?: number
  }>,
) => {
  const { elementId, column, margin_bottom, margin_top } = payload
  state.disableElementsAdding = true

  const [targetEl, targetIdx] = findElementFromState(
    state.activeContent!.components,
    elementId,
    column,
    "separator",
  ) as [SeparatorElement, number]

  if (targetEl) {
    targetEl.margin_top = margin_top ?? targetEl.margin_top
    targetEl.margin_bottom = margin_bottom ?? targetEl.margin_bottom

    state.activeContent!.components = replaceElementInArray(
      targetEl,
      state.activeContent!.components,
      column,
      targetIdx,
    ) as (DocContentComponent | ColumnsElement)[]
  }

  state.disableElementsAdding = false
}

export default setMarginsAction
