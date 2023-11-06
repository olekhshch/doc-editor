import { PayloadAction } from "@reduxjs/toolkit"
import { DocumentsState } from "../initialState"
import { ColumnsElement, ImageElement } from "../../../types"

const setImageDescriptionAction = (
  state: DocumentsState,
  {
    payload,
  }: PayloadAction<{
    elementId: number
    column: null | [number, "left" | "right"]
    newDescription?: string
    newPosition: "top" | "bottom" | "left" | "right"
    showDescription?: boolean
  }>,
) => {
  if (payload.column !== null) {
    const [columnId, side] = payload.column
    const ColumnEl = state.activeContent!.components.find(
      (el) => el._id === columnId && el.type === "columns",
    ) as ColumnsElement

    const newSide = ColumnEl[side].map((element) => {
      if (element._id === payload.elementId && element.type === "image") {
        const description = payload.newDescription ?? element.description
        const decription_position =
          payload.newPosition ?? element.description_position
        const showDescription =
          payload.showDescription ?? element.showDescription
        return {
          ...element,
          description,
          decription_position,
          showDescription,
        }
      }
      return element
    })

    state.activeContent!.components = state.activeContent!.components.map(
      (el) => {
        if (el._id === columnId && el.type === "columns") {
          return { ...el, [side]: newSide }
        }
        return el
      },
    )
  } else {
    state.activeContent!.components = state.activeContent!.components.map(
      (el) => {
        if (el._id === payload.elementId && el.type === "image") {
          const description = payload.newDescription ?? el.description
          const description_position =
            payload.newPosition ?? el.description_position
          const showDescription = payload.showDescription ?? el.showDescription
          return {
            ...el,
            description,
            description_position,
            showDescription,
          } as ImageElement
        }
        return el
      },
    )
  }
}

export default setImageDescriptionAction
