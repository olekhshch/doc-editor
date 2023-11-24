import { PayloadAction } from "@reduxjs/toolkit"
import { DocumentsState } from "../initialState"
import {
  ColumnsElement,
  DocContentComponent,
  ImageElement,
  columnParam,
} from "../../../types"
import addElementsToState from "../../../functions/addElementsToState"

const addImageAction = (
  state: DocumentsState,
  {
    payload,
  }: PayloadAction<{
    afterElementId?: number
    column: columnParam
    src: string
    width: number
  }>,
) => {
  state.disableElementsAdding = true

  const oldContent = state.activeContent
  const [maxLineWidth, maxColumnWidth] = [1000, 500]

  try {
    const imageId = new Date().getTime()
    const newImageEl: ImageElement = {
      _id: imageId,
      type: "image",
      src: payload.src,
      description: "",
      description_position: "bottom",
      showDescription: false,
      width: payload.width,
      naturalWidth: payload.width,
      left_margin: 0,
    }
    let afterId = payload.afterElementId
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

    if (afterId) {
      state.activeContent!.components = addElementsToState(
        state.activeContent!.components,
        afterId!,
        column,
        newImageEl,
      ) as (DocContentComponent | ColumnsElement)[]
    } else {
      state.activeContent!.components = [
        ...state.activeContent!.components,
        newImageEl,
      ]
    }

    state.activeElementId = column === null ? imageId : [imageId, ...column]
    state.activeElementType = "image"
  } catch (err) {
    console.log({ err, text: "ERROR WHILE ADDING AN IMAGE" })
    state.activeContent = oldContent
  }

  state.disableElementsAdding = false
}

export default addImageAction
