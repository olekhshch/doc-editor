import { PayloadAction } from "@reduxjs/toolkit"
import {
  ColumnsElement,
  DocContentComponent,
  TableElement,
  columnParam,
} from "../../../types"
import findElementFromState from "../../../functions/findElementFromState"
import { DocumentsState } from "../initialState"
import TableEl from "../../../pages/editor/canvasElements/TableEl"
import replaceElementInArray from "../../../functions/replaceElementInArray"

const setTableWidthsArrayAction = (
  state: DocumentsState,
  {
    payload,
  }: PayloadAction<{
    tableId: number
    column: columnParam
    newWidths: (null | number)[]
  }>,
) => {
  const { tableId, column, newWidths } = payload
  const [targetTable, targetIdx] = findElementFromState(
    state.activeContent!.components,
    tableId,
    column,
    "table",
  ) as [TableElement, number]

  if (targetTable) {
    targetTable.column_widths = newWidths
    state.activeContent!.components = replaceElementInArray(
      targetTable,
      state.activeContent!.components,
      column,
      targetIdx,
    ) as (DocContentComponent | ColumnsElement)[]
  }
}

export default setTableWidthsArrayAction
