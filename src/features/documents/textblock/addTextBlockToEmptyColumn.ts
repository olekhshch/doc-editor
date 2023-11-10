import { PayloadAction } from "@reduxjs/toolkit"
import { DocumentsState, initialParagraph } from "../initialState"
import { ColumnsElement } from "../../../types"

const addTextBlockToEmptyColumnAction = (
  state: DocumentsState,
  { payload }: PayloadAction<[number, "left" | "right"]>,
) => {
  try {
    const [columnId, columnSide] = payload

    const targetColumn = state.activeContent!.components.find(
      (el) => el._id === columnId && el.type === "columns",
    ) as ColumnsElement | undefined

    if (targetColumn && targetColumn[columnSide].length === 0) {
      const targetColumnIdx = state.activeContent!.components.findIndex(
        (el) => el._id === columnId && el.type === "columns",
      )

      const filledSide = [{ ...initialParagraph, _id: new Date().getTime() }]

      state.activeContent!.components[targetColumnIdx] = {
        ...targetColumn,
        [columnSide]: filledSide,
      }
    }
  } catch (err) {
    console.log("ERROR while adding text block to the empty column")
  }
}

export default addTextBlockToEmptyColumnAction
