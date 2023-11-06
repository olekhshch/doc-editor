import { PayloadAction } from "@reduxjs/toolkit"
import { DocumentsState } from "../initialState"
import { ImageElement } from "../../../types"
import { insertElementIntoArray } from "../../../functions/insertElementIntoArray"

const addImageAction = (
  state: DocumentsState,
  {
    payload,
  }: PayloadAction<{
    afterElementId?: number | [number, number, "left" | "right"]
    src: string
  }>,
) => {
  const oldContent = state.activeContent
  try {
    const imageId = Math.round(Math.random() * 100000)
    const newImageEl: ImageElement = {
      _id: imageId,
      type: "image",
      src: payload.src,
      description: "",
      description_position: "bottom",
      showDescription: false,
      orderIndex: 10000,
      width: undefined,
      left_margin: 0,
    }

    const insertAfterId = payload.afterElementId
      ? payload.afterElementId
      : state.activeElementId ?? 0

    if (!Array.isArray(insertAfterId)) {
      const afterElement = state.activeContent!.components.find(
        (el) => el._id === insertAfterId,
      )

      state.activeContent!.components = insertElementIntoArray(
        newImageEl,
        state.activeContent!.components,
        afterElement?.orderIndex ?? 0,
      )
    }
  } catch (err) {
    console.log({ err, text: "ERROR WHILE ADDING AN IMAGE" })
    state.activeContent = oldContent
  }
}

export default addImageAction
