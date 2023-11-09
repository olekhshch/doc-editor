import { PayloadAction } from "@reduxjs/toolkit"
import { DocumentsState } from "../initialState"
import { ColumnsElement, DocContentComponent } from "../../../types"
import addElementsToState from "../../../functions/addElementsToState"

const deleteColumnSideAction = (
  state: DocumentsState,
  { payload }: PayloadAction<{ columnsElId: number; side: "left" | "right" }>,
) => {
  try {
    const targetColumnsEl = state.activeContent!.components.find(
      (el) => el._id === payload.columnsElId && el.type === "columns",
    ) as ColumnsElement | undefined

    if (targetColumnsEl) {
      const elementsOfremainingSide =
        targetColumnsEl[payload.side === "left" ? "right" : "left"]

      //adding elements to remain to the state copy
      const stateWithRemainingElements = addElementsToState(
        state.activeContent!.components,
        targetColumnsEl._id,
        null,
        ...elementsOfremainingSide,
      ) as (DocContentComponent | ColumnsElement)[]

      //removing target columns element
      state.activeContent!.components = stateWithRemainingElements.filter(
        (el) => el._id !== targetColumnsEl._id,
      )
    }
  } catch (err) {
    console.log("ERROR while deleting one of a column sides")
  }
}

export default deleteColumnSideAction
