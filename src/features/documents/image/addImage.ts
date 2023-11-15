import { PayloadAction } from "@reduxjs/toolkit"
import { DocumentsState } from "../initialState"
import {
  ColumnsElement,
  DocContentComponent,
  ImageElement,
  columnParam,
} from "../../../types"
import { insertElementIntoArray } from "../../../functions/insertElementIntoArray"
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
  const oldContent = state.activeContent
  const [maxLineWidth, maxColumnWidth] = [896, 448]
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

    if (!payload.afterElementId && state.activeElementId !== null) {
      if (!Array.isArray(state.activeElementId)) {
        newImageEl.width = Math.min(payload.width, maxLineWidth)

        state.activeContent!.components = addElementsToState(
          state.activeContent!.components,
          state.activeElementId,
          null,
          newImageEl,
        ) as (DocContentComponent | ColumnsElement)[]
      } else {
        newImageEl.width = Math.min(payload.width, maxColumnWidth)
        const colPar: columnParam = [
          state.activeElementId[1],
          state.activeElementId[2],
        ]

        state.activeContent!.components = addElementsToState(
          state.activeContent!.components,
          state.activeElementId[0],
          colPar,
          newImageEl,
        ) as (DocContentComponent | ColumnsElement)[]
      }
    } else if (payload.afterElementId) {
      newImageEl.width = Math.min(
        payload.width,
        payload.column === null ? maxLineWidth : maxColumnWidth,
      )

      state.activeContent!.components = addElementsToState(
        state.activeContent!.components,
        payload.afterElementId,
        payload.column,
        newImageEl,
      ) as (DocContentComponent | ColumnsElement)[]
    }

    // const insertAfterId = payload.afterElementId
    //   ? payload.afterElementId
    //   : state.activeElementId ?? 0

    // if (!Array.isArray(insertAfterId)) {
    //   const afterElement = state.activeContent!.components.find(
    //     (el) => el._id === insertAfterId,
    //   )

    //   state.activeContent!.components = insertElementIntoArray(
    //     newImageEl,
    //     state.activeContent!.components,
    //     afterElement?.orderIndex ?? 0,
    //   )
    // }
  } catch (err) {
    console.log({ err, text: "ERROR WHILE ADDING AN IMAGE" })
    state.activeContent = oldContent
  }
}

export default addImageAction
