import { PayloadAction } from "@reduxjs/toolkit"
import { DocumentsState } from "../initialState"
import {
  ColumnsElement,
  DocContentComponent,
  TableElement,
  columnParam,
} from "../../../types"
import generateEmptyTableContent from "./generateEmptyTableContent"
import addElementsToState from "../../../functions/addElementsToState"

const addTableAction = (
  state: DocumentsState,
  {
    payload,
  }: PayloadAction<{
    rows: number
    columns: number
    column: columnParam
    afterId?: number
  }>,
) => {
  state.disableElementsAdding = true
  const _id = new Date().getTime()
  const generatedContent = generateEmptyTableContent(
    payload.rows,
    payload.columns,
  )

  const column_widths = []

  for (let i = 0; i < payload.columns; i++) {
    column_widths.push(null)
  }

  const newTableEl: TableElement = {
    _id,
    type: "table",
    content: generatedContent.content,
    lastCellId: generatedContent.lastCellId,
    column_widths,
  }

  try {
    let afterId = payload.afterId
    let column: columnParam = payload.column

    if (!afterId) {
      if (!Array.isArray(state.activeElementId)) {
        //if activeElementId is a number => inserting new heading as an ordinary element
        afterId = state.activeElementId!
        column = null
      } else {
        // if activeElementId is array => new heading will be a part of a column
        afterId = state.activeElementId[0]
        const colPar0 = state.activeElementId[1]
        const colPar1 = state.activeElementId[2]
        column = [colPar0, colPar1]
      }
    }

    state.activeContent!.components = addElementsToState(
      state.activeContent!.components,
      afterId!,
      column,
      newTableEl,
    ) as (DocContentComponent | ColumnsElement)[]

    state.activeElementId = column === null ? _id : [_id, ...column]
  } catch (err) {
    console.log("ERROR while adding new table element")
  }
  state.disableElementsAdding = false
}

export default addTableAction
