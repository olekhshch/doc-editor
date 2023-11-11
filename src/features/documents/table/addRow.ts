import { PayloadAction } from "@reduxjs/toolkit"
import { DocumentsState } from "../initialState"
import { TableCell, TableElement, columnParam } from "../../../types"
import findElementFromState from "../../../functions/findElementFromState"
import { initialCellContent } from "./generateEmptyTableContent"

const addRowAction = (
  state: DocumentsState,
  {
    payload,
  }: PayloadAction<{
    tableId: number
    column: columnParam
    rowIndexBefore: number
  }>,
) => {
  state.disableElementsAdding = true

  const targetTableEl = findElementFromState(
    state.activeContent!.components,
    payload.tableId,
    payload.column,
    "table",
  ) as TableElement | undefined

  if (targetTableEl) {
    let idx = targetTableEl.lastCellId
    const contentArray = [...targetTableEl.content]
    const numOfColumns = contentArray[0].length

    //new row creation
    const newEmptyRow: TableCell[] = []
    for (let i = 0; i < numOfColumns; i++) {
      const _id = idx
      idx += 1
      const cellContent: TableCell = {
        _id,
        content: initialCellContent,
      }
      newEmptyRow.push(cellContent)
    }

    contentArray.splice(payload.rowIndexBefore + 1, 0, newEmptyRow)

    const updatedTable: TableElement = {
      ...targetTableEl,
      content: contentArray,
      lastCellId: idx,
    }

    //#TODO: add fnctionality to update table which is part of a column
    state.activeContent!.components = state.activeContent!.components.map(
      (el) => {
        if (el._id === payload.tableId) {
          return updatedTable
        }
        return el
      },
    )
  }

  state.disableElementsAdding = false
}

export default addRowAction
