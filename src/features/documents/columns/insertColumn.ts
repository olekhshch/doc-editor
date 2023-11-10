import { PayloadAction } from "@reduxjs/toolkit"
import { DocumentsState, initialParagraph } from "../initialState"
import { ColumnsElement, DocContentComponent } from "../../../types"

const insertColumnAction = (
  state: DocumentsState,
  { payload }: PayloadAction<{ elementId: number; side: "right" | "left" }>,
) => {
  try {
    const targetEl = state.activeContent!.components.find(
      (el) => el._id === payload.elementId && el.type !== "columns",
    ) as DocContentComponent | undefined

    if (targetEl) {
      const targetIdx = state.activeContent!.components.findIndex(
        (el) => el._id === payload.elementId && el.type !== "columns",
      )
      const _id = new Date().getTime()

      if (payload.side === "left") {
        const newColumnsEl: ColumnsElement = {
          _id,
          type: "columns",
          left: [targetEl],
          right: [{ ...initialParagraph, _id: new Date().getTime() + 10 }],
        }
        state.activeContent!.components[targetIdx] = newColumnsEl
      } else if (payload.side === "right") {
        const newColumnsEl: ColumnsElement = {
          _id,
          type: "columns",
          right: [targetEl],
          left: [{ ...initialParagraph, _id: new Date().getTime() - 10 }],
        }
        state.activeContent!.components[targetIdx] = newColumnsEl
      }
      // const newColumnsEl: ColumnsElement =
      //   payload.side === "left"
      //     ? {
      //         _id,
      //         type: "columns",
      //         left: [targetEl],
      //         right: [{ ...initialParagraph, _id: new Date().getTime() }],
      //       }
      //     : {
      //         _id,
      //         type: "columns",
      //         right: [targetEl],
      //         left: [
      //           {
      //             ...initialParagraph,
      //             _id:
      //               new Date().getTime() - Math.round(Math.random() * 100) + 1,
      //           },
      //         ],
      //       }
    }
  } catch (err) {
    console.log("ERROR while inserting a column")
  }
}

export default insertColumnAction
