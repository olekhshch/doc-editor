import { PayloadAction } from "@reduxjs/toolkit"
import { DocumentsState } from "../initialState"
import {
  ColumnsElement,
  DocContentComponent,
  HeadingElement,
  columnParam,
} from "../../../types"
import addElementsToState from "../../../functions/addElementsToState"

const addHeadingAction = (
  state: DocumentsState,
  {
    payload,
  }: PayloadAction<{
    level: 1 | 2 | 3
    column: columnParam
    afterId?: number
  }>,
) => {
  state.disableElementsAdding = true
  //new heading element obj set up
  let content = "Main heading"
  switch (payload.level) {
    case 2:
      content = "Medium heading"
      break
    case 3:
    default:
      content = "Small heading"
      break
  }

  const _id = new Date().getTime()
  const newHeadingEl: HeadingElement = {
    _id,
    type: "heading",
    content,
    level: payload.level,
  }

  try {
    //identifying placement of a new heading
    //if afterIdx was given - using given afterIdx and column params, otherwise - taking it from the activeElementId
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
      newHeadingEl,
    ) as (DocContentComponent | ColumnsElement)[]

    state.activeElementId = column === null ? _id : [_id, ...column]
  } catch (err) {
    console.log("ERROR while adding new heading")
  }
  state.disableElementsAdding = false
}

export default addHeadingAction
