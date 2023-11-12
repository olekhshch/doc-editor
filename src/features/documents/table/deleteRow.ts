import { PayloadAction } from "@reduxjs/toolkit"
import { DocumentsState } from "../initialState"
import findElementFromState from "../../../functions/findElementFromState"
import {
  ColumnsElement,
  DocContentComponent,
  TableElement,
  columnParam,
} from "../../../types"
import replaceElementInArray from "../../../functions/replaceElementInArray"

const deleteRowAction = (
  state: DocumentsState,
  {
    payload,
  }: PayloadAction<{ tableId: number; rowIdx: number; column: columnParam }>,
) => {
  const [targetTableEl, targetTableIdx] = findElementFromState(
    state.activeContent!.components,
    payload.tableId,
    payload.column,
    "table",
  ) as [TableElement | undefined, number]

  if (targetTableEl && targetTableEl.content.length > 1) {
    targetTableEl.content = targetTableEl.content.filter(
      (row, rowIndex) => rowIndex !== payload.rowIdx,
    )

    state.activeContent!.components = replaceElementInArray(
      targetTableEl,
      state.activeContent!.components,
      payload.column,
      targetTableIdx,
    ) as (DocContentComponent | ColumnsElement)[]
  }
}

export default deleteRowAction
