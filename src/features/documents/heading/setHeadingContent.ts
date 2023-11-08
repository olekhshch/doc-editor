import { PayloadAction } from "@reduxjs/toolkit"
import { DocumentsState } from "../initialState"
import { ColumnsElement, HeadingElement, columnParam } from "../../../types"

const setHeadingContentAction = (
  state: DocumentsState,
  {
    payload,
  }: PayloadAction<{
    headingId: number
    newContent: string
    column: columnParam
  }>,
) => {
  state.disableElementsAdding = true

  try {
    if (payload.column === null) {
      const targetHeading = state.activeContent!.components.find(
        (el) => el._id === payload.headingId && el.type === "heading",
      ) as HeadingElement | undefined

      if (targetHeading) {
        const targetIdx = state.activeContent!.components.findIndex(
          (el) => el._id === payload.headingId && el.type === "heading",
        )

        const updatedHeadingEl: HeadingElement = {
          ...targetHeading,
          content: payload.newContent,
        }

        state.activeContent!.components[targetIdx] = updatedHeadingEl
      }
    } else {
      const [columnId, columnSide] = payload.column

      const targetColumnsEl = state.activeContent!.components.find(
        (el) => el._id === columnId && el.type === "columns",
      ) as ColumnsElement | undefined

      if (targetColumnsEl) {
        const columnsIdx = state.activeContent!.components.findIndex(
          (el) => el._id === columnId && el.type === "columns",
        )

        const updatedSide = targetColumnsEl[columnSide].map((el) => {
          if (el._id === payload.headingId) {
            return { ...el, content: payload.newContent }
          }
          return el
        })

        const newColumnsEl: ColumnsElement = {
          ...targetColumnsEl,
          [columnSide]: updatedSide,
        }

        state.activeContent!.components[columnsIdx] = newColumnsEl
      }
    }
  } catch (err) {
    console.log("ERROR while changing content of a heading")
  }

  state.disableElementsAdding = false
}

export default setHeadingContentAction
