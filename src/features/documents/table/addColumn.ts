import { PayloadAction } from "@reduxjs/toolkit"
import { DocumentsState } from "../initialState"
import {
  ColumnsElement,
  DocContentComponent,
  TableCell,
  TableElement,
  columnParam,
} from "../../../types"
import findElementFromState from "../../../functions/findElementFromState"
import { initialCellContent } from "./generateEmptyTableContent"
import replaceElementInArray from "../../../functions/replaceElementInArray"

const addColumnAction = (
  state: DocumentsState,
  {
    payload,
  }: PayloadAction<{
    tableId: number
    column: columnParam
    colIndexBefore: number
  }>,
) => {
  state.disableElementsAdding = true
  const [targetTableEl, targetTableIdx] = findElementFromState(
    state.activeContent!.components,
    payload.tableId,
    payload.column,
    "table",
  ) as [TableElement | undefined, number]

  if (targetTableEl) {
    let idx = targetTableEl.lastCellId
    const contentArray = [...targetTableEl.content]
    const colNum = contentArray[0].length

    //#TODO: Allow to create more but after a table viewer implementation
    //#TODO: New columns width array
    if (colNum < 8) {
      targetTableEl.column_widths.splice(payload.colIndexBefore + 1, 0, null)
      const updatedContent: TableCell[][] = contentArray.map((row) => {
        const _id = idx
        idx += 1
        const newCell: TableCell = {
          _id,
          content: initialCellContent,
        }
        row.splice(payload.colIndexBefore + 1, 0, newCell)

        return row
      })

      const updatedTable: TableElement = {
        ...targetTableEl,
        lastCellId: idx,
        content: updatedContent,
      }

      state.activeContent!.components = replaceElementInArray(
        updatedTable,
        state.activeContent!.components,
        payload.column,
        targetTableIdx,
      ) as (DocContentComponent | ColumnsElement)[]
    }
  }

  state.disableElementsAdding = false
}

export default addColumnAction
