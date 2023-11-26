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

const deleteColumnAction = (
  state: DocumentsState,
  {
    payload,
  }: PayloadAction<{ tableId: number; colIdx: number; column: columnParam }>,
) => {
  state.disableElementsAdding = true

  const [targetTableEl, targetTableIdx] = findElementFromState(
    state.activeContent!.components,
    payload.tableId,
    payload.column,
    "table",
  ) as [TableElement | undefined, number]

  if (targetTableEl && targetTableEl.content[0].length > 1) {
    targetTableEl.content = targetTableEl.content.map((row) =>
      row.filter((cell, colIndex) => colIndex !== payload.colIdx),
    )

    targetTableEl.column_widths.splice(payload.colIdx, 1)

    state.activeContent!.components = replaceElementInArray(
      targetTableEl,
      state.activeContent!.components,
      payload.column,
      targetTableIdx,
    ) as (DocContentComponent | ColumnsElement)[]
  }

  state.disableElementsAdding = false
}

export default deleteColumnAction
