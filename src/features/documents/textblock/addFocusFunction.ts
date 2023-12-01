import { DocumentsState } from "../initialState"
import {
  ColumnsElement,
  DocContentComponent,
  ParagraphElement,
  columnParam,
} from "../../../types"
import findElementFromState from "../../../functions/findElementFromState"
import replaceElementInArray from "../../../functions/replaceElementInArray"

const addFocusCb_textblock = (
  state: DocumentsState,

  payload: {
    elementId: number
    column: columnParam
    focus_cb: () => void
  },
) => {
  const { elementId, column, focus_cb } = payload
  state.disableElementsAdding = true
  try {
    const [targetEl, targetIdx] = findElementFromState(
      state.activeContent!.components,
      elementId,
      column,
      "paragraph",
    ) as [ParagraphElement, number]

    if (targetEl) {
      targetEl.focus = focus_cb

      state.activeContent!.components = replaceElementInArray(
        targetEl,
        state.activeContent!.components,
        column,
        targetIdx,
      ) as (DocContentComponent | ColumnsElement)[]
    }
  } catch (err) {
    console.log("ERROR while adding focus b to the text block")
  }

  state.disableElementsAdding = false
}

export default addFocusCb_textblock
