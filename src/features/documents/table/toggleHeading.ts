import { PayloadAction } from "@reduxjs/toolkit"
import { DocumentsState } from "../initialState"
import {
  ColumnsElement,
  DocContentComponent,
  TableElement,
  columnParam,
} from "../../../types"
import findElementFromState from "../../../functions/findElementFromState"
import replaceElementInArray from "../../../functions/replaceElementInArray"

const toggleHeadingAction = (
  state: DocumentsState,
  { payload }: PayloadAction<{ tableId: number; column: columnParam }>,
) => {
  state.disableElementsAdding = true

  const [targetTableEl, targetTableIdx] = findElementFromState(
    state.activeContent!.components,
    payload.tableId,
    payload.column,
    "table",
  ) as [TableElement | undefined, number]

  if (targetTableEl) {
    targetTableEl.heading = !targetTableEl.heading

    state.activeContent!.components = replaceElementInArray(
      targetTableEl,
      state.activeContent!.components,
      payload.column,
      targetTableIdx,
    ) as (DocContentComponent | ColumnsElement)[]
  }

  state.disableElementsAdding = false
}

export default toggleHeadingAction
