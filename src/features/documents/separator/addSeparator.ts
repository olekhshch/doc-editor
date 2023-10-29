import { PayloadAction } from "@reduxjs/toolkit"
import { DocumentsState } from "../initialState"
import { SeparatorElement } from "../../../types"
import { insertElementIntoArray } from "../../../functions/insertElementIntoArray"

const addSeparator = (
  state: DocumentsState,
  {
    payload,
  }: PayloadAction<{
    afterElementId?: number | [number, number, "left" | "right"]
  }>,
) => {
  if (state.activeContent) {
    const separatorId = Math.round(Math.random() * 100000)
    const newSeparator: SeparatorElement = {
      _id: separatorId,
      type: "separator",
      width: 10,
      colour: "black",
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
      }
    }
  }
}

export default addSeparator
