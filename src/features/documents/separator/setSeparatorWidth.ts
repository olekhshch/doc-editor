import { PayloadAction } from "@reduxjs/toolkit"
import { DocumentsState } from "../initialState"
import { ColumnsElement, SeparatorElement } from "../../../types"

const setSeparatorWidthAction = (
  state: DocumentsState,
  {
    payload,
  }: PayloadAction<{
    separatorId: number
    column: null | [number, "left" | "right"]
    newWidth: number
  }>,
) => {
  if (state.activeContent) {
    const oldElements = [...state.activeContent.components]

    try {
      if (payload.column === null) {
        //separator is not a part of a column
        const targetSeparator = state.activeContent.components.find(
          (el) => el._id === payload.separatorId && el.type === "separator",
        ) as SeparatorElement

        const newSeparator: SeparatorElement = {
          ...targetSeparator,
          width: payload.newWidth,
        }

        const { orderIndex } = targetSeparator
        state.activeContent.components[orderIndex] = newSeparator
      } else {
        //separator is a part of a column
        const [columnId, side] = payload.column
        const targetColumn = state.activeContent!.components.find(
          (el) => el._id === columnId && el.type === "columns",
        ) as ColumnsElement
        const newSide = targetColumn[side].map((el) => {
          if (el._id === payload.separatorId && el.type === "separator") {
            return { ...el, width: payload.newWidth }
          }
          return el
        })
        state.activeContent.components = state.activeContent.components.map(
          (el) => {
            if (el._id === columnId) {
              return { ...el, [side]: newSide }
            }
            return el
          },
        )
      }
    } catch (e) {
      state.activeContent.components = oldElements
    }
  }
}

export default setSeparatorWidthAction
