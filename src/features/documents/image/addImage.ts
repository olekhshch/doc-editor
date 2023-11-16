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
  const oldContent = state.activeContent
  const [maxLineWidth, maxColumnWidth] = [896, 448]
  console.log("tried")
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

        state.activeElementId = imageId
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

        state.activeElementId = [imageId, ...colPar]
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

      state.activeElementId =
        payload.column === null ? imageId : [imageId, ...payload.column]
    } else if (!payload.afterElementId && state.activeElementId === null) {
      //no active element and no specific element id is given => image is inserted at the end of document
      state.activeContent!.components = [
        ...state.activeContent!.components,
        newImageEl,
      ]

      state.activeElementId = imageId
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
