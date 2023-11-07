import { PayloadAction } from "@reduxjs/toolkit"
import { DocumentsState } from "../initialState"
import { ColumnsElement, SeparatorElement } from "../../../types"
import { insertElementIntoArray } from "../../../functions/insertElementIntoArray"
import { ThemeName } from "../../styling/initialState"

const addSeparator = (
  state: DocumentsState,
  {
    payload,
  }: PayloadAction<{
    afterElementId?: number | [number, number, "left" | "right"]
    currentTheme: ThemeName
  }>,
) => {
  const oldElements = [...state.activeContent!.components]
  try {
    if (state.activeContent) {
      const separatorId = Math.round(Math.random() * 100000)
      const newSeparator: SeparatorElement = {
        _id: separatorId,
        type: "separator",
        width: 8,
        colour: payload.currentTheme,
        line: "normal",
        orderIndex: 1000,
      }
      if (!payload.afterElementId && state.activeElementId) {
        //adds separator after active element
        if (!Array.isArray(state.activeElementId)) {
          //insert as an ordinary element (not part of a column)
          const afterElement = state.activeContent.components.find(
            (el) => el._id === state.activeElementId,
          )

          if (afterElement) {
            state.activeContent.components = insertElementIntoArray(
              newSeparator,
              state.activeContent.components,
              afterElement.orderIndex,
            )
          }
        } else {
          //insert after the active element which is part of a column
          const [activeElId, columnId, side] = state.activeElementId
          const targetColumn = state.activeContent.components.find(
            (el) => el._id === columnId && el.type === "columns",
          ) as ColumnsElement
          const { orderIndex } = targetColumn[side].find(
            (el) => el._id === activeElId,
          )!
          const newSide = insertElementIntoArray(
            newSeparator,
            targetColumn[side],
            orderIndex,
          )
          state.activeContent.components = state.activeContent.components.map(
            (el) => {
              if (el._id === columnId && el.type === "columns") {
                return { ...el, [side]: newSide }
              }
              return el
            },
          )
        }
      }
    }
  } catch (err) {
    state.activeContent!.components = oldElements
  }
}

export default addSeparator
