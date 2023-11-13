import { PayloadAction } from "@reduxjs/toolkit"
import { DocumentsState } from "../initialState"
import {
  ColumnsElement,
  DocContentComponent,
  TableElement,
  columnParam,
} from "../../../types"
import findElementFromState from "../../../functions/findElementFromState"
import { RemirrorJSON } from "remirror"
import replaceElementInArray from "../../../functions/replaceElementInArray"

const setCellContentAction = (
  state: DocumentsState,
  {
    payload,
  }: PayloadAction<{
    tableId: number
    column: columnParam
    row: number
    col: number
    newContent: RemirrorJSON[]
  }>,
) => {
  const [targetTableEl, targetTableIdx] = findElementFromState(
    state.activeContent!.components,
    payload.tableId,
    payload.column,
    "table",
  ) as [TableElement | undefined, number]

  if (targetTableEl) {
    const targetCell = targetTableEl.content[payload.row][payload.col]
    targetTableEl.content[payload.row][payload.col] = {
      ...targetCell,
      content: payload.newContent,
    }

    state.activeContent!.components = replaceElementInArray(
      targetTableEl,
      state.activeContent!.components,
      payload.column,
      targetTableIdx,
    ) as (DocContentComponent | ColumnsElement)[]
  }
}

export default setCellContentAction
