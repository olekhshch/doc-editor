import { PayloadAction } from "@reduxjs/toolkit"
import { DocumentsState } from "../initialState"
import {
  ColumnsElement,
  DocContentComponent,
  SeparatorElement,
} from "../../../types"
import { insertElementIntoArray } from "../../../functions/insertElementIntoArray"
import { ThemeName } from "../../styling/initialState"
import addElementsToState from "../../../functions/addElementsToState"

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
      const separatorId = new Date().getTime()
      const newSeparator: SeparatorElement = {
        _id: separatorId,
        type: "separator",
        width: 8,
        colour: payload.currentTheme,
        line: "normal",
        margin_bottom: 4,
        margin_top: 4,
      }
      if (!payload.afterElementId && state.activeElementId) {
        //adds separator after active element
        if (!Array.isArray(state.activeElementId)) {
          //insert as an ordinary element (not part of a column)
          state.activeContent.components = addElementsToState(
            state.activeContent.components,
            state.activeElementId,
            null,
            newSeparator,
          ) as (DocContentComponent | ColumnsElement)[]

          state.activeElementId = separatorId
        } else {
          //insert after the active element which is part of a column
          const [activeElId, columnId, side] = state.activeElementId

          state.activeContent.components = addElementsToState(
            state.activeContent.components,
            activeElId,
            [columnId, side],
            newSeparator,
          ) as (DocContentComponent | ColumnsElement)[]

          state.activeElementId = [separatorId, columnId, side]
        }
      } else if (!payload.afterElementId && state.activeElementId === null) {
        //pushes new separator at the end of the canvas
        state.activeContent.components = [
          ...state.activeContent.components,
          newSeparator,
        ]

        state.activeElementId = separatorId
      } else {
      }
    }
  } catch (err) {
    state.activeContent!.components = oldElements
  }
}

export default addSeparator
