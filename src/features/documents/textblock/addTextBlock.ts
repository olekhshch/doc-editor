import { PayloadAction } from "@reduxjs/toolkit"
import { DocumentsState } from "../initialState"
import {
  ColumnsElement,
  DocContentComponent,
  ParagraphElement,
  columnParam,
} from "../../../types"
import { initialParagraph } from "../initialState"
import addElementsToState from "../../../functions/addElementsToState"

const addTextBlockAction = (
  state: DocumentsState,
  { payload }: PayloadAction<{ afterId?: number; column: columnParam }>,
) => {
  state.disableElementsAdding = true

  try {
    const _id = Math.round(Math.random() * 10000)
    const newTextBlockEl: ParagraphElement = {
      ...initialParagraph,
      _id,
    }

    if (payload.afterId) {
      //text block will be inserted after specified in payload element
      state.activeContent!.components = addElementsToState(
        state.activeContent!.components,
        payload.afterId,
        payload.column,
        newTextBlockEl,
      ) as (DocContentComponent | ColumnsElement)[]

      state.activeElementId = _id
    } else {
      //text block will be inserted after the current active element
      if (state.activeElementId === null) {
        //no active element specified => adds text block at the end of canvas
        state.activeContent!.components = [
          ...state.activeContent!.components,
          newTextBlockEl,
        ]

        state.activeElementId = _id
      } else if (!Array.isArray(state.activeElementId)) {
        //activeId is a number => text block will be inserted as an ordinary DocContent element
        state.activeContent!.components = addElementsToState(
          state.activeContent!.components,
          state.activeElementId,
          null,
          newTextBlockEl,
        ) as (DocContentComponent | ColumnsElement)[]

        state.activeElementId = _id
      } else {
        //current active element is a part of a column
        const afterId = state.activeElementId[0]
        const column: columnParam = [
          state.activeElementId[1],
          state.activeElementId[2],
        ]

        state.activeContent!.components = addElementsToState(
          state.activeContent!.components,
          afterId,
          column,
          newTextBlockEl,
        ) as (DocContentComponent | ColumnsElement)[]

        state.activeElementId = [_id, ...column]
      }
    }
  } catch (err) {
    console.log("ERROR while adding new text block")
  }

  state.disableElementsAdding = false
}

export default addTextBlockAction
