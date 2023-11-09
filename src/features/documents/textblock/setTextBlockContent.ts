import { PayloadAction } from "@reduxjs/toolkit"
import { ColumnsElement, ParagraphElement, columnParam } from "../../../types"
import { DocumentsState } from "../initialState"
import { RemirrorJSON } from "remirror"

const setTextBlockContentAction = (
  state: DocumentsState,
  {
    payload,
  }: PayloadAction<{
    newContentArray: RemirrorJSON[]
    elementId: number
    column: columnParam
  }>,
) => {
  try {
    if (payload.column === null) {
      const targetTB = state.activeContent!.components.find(
        (el) => el._id === payload.elementId && el.type === "paragraph",
      ) as ParagraphElement | undefined

      if (targetTB) {
        const targetIdx = state.activeContent!.components.findIndex(
          (el) => el._id === payload.elementId && el.type === "paragraph",
        )

        state.activeContent!.components[targetIdx] = {
          ...targetTB,
          content: payload.newContentArray,
        }
      }
    } else {
      const [columnId, side] = payload.column

      const targetColumn = state.activeContent!.components.find(
        (el) => el._id === columnId && el.type === "columns",
      ) as ColumnsElement | undefined

      if (targetColumn) {
        const targetColumnIdx = state.activeContent!.components.findIndex(
          (el) => el._id === columnId && el.type === "columns",
        )

        const newSide = targetColumn[side].map((el) => {
          if (el._id === payload.elementId && el.type === "paragraph") {
            return { ...el, content: payload.newContentArray }
          }
          return el
        })

        state.activeContent!.components[targetColumnIdx] = {
          ...targetColumn,
          [side]: newSide,
        }
      }
    }
  } catch (err) {
    console.log("ERROR while updating content of a text block")
  }
}

export default setTextBlockContentAction
