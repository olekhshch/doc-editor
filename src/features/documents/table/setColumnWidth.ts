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

const setTableColumnWidthAction = (
  state: DocumentsState,
  {
    payload: { tableId, column, columnIdx, width },
  }: PayloadAction<{
    tableId: number
    column: columnParam
    columnIdx: number
    width: number
  }>,
) => {
  state.disableElementsAdding = true

  const [targetTableEl, targetIdx] = findElementFromState(
    state.activeContent!.components,
    tableId,
    column,
    "table",
  ) as [TableElement | undefined, number]

  if (targetTableEl) {
    targetTableEl.column_widths[columnIdx] = width
    state.activeContent!.components = replaceElementInArray(
      targetTableEl,
      state.activeContent!.components,
      column,
      targetIdx,
    ) as (DocContentComponent | ColumnsElement)[]
  }

  state.disableElementsAdding = false
}

export default setTableColumnWidthAction
