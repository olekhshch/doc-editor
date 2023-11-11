import { PayloadAction } from "@reduxjs/toolkit"
import { DocumentsState } from "../initialState"
import { TableCell, TableElement, columnParam } from "../../../types"
import findElementFromState from "../../../functions/findElementFromState"
import { initialCellContent } from "./generateEmptyTableContent"

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
  const targetTableEl = findElementFromState(
    state.activeContent!.components,
    payload.tableId,
    payload.column,
    "table",
  ) as TableElement

  if (targetTableEl) {
    let idx = targetTableEl.lastCellId
    const contentArray = [...targetTableEl.content]
    const colNum = contentArray[0].length

    if (colNum < 8) {
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

      if (payload.column === null) {
        state.activeContent!.components = state.activeContent!.components.map(
          (el) => {
            if (el._id === payload.tableId) {
              return updatedTable
            }
            return el
          },
        )
      }
    }
  }

  state.disableElementsAdding = false
}

export default addColumnAction
