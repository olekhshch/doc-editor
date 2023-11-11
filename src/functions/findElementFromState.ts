import {
  BasicComponent,
  ColumnsElement,
  ContentComponentType,
  columnParam,
} from "../types"

/**
 *
 * @param elementArray activeContent/columnsElContent array to look in
 * @param elementId _id of element we're looking for
 * @param column columnParameter
 * @param elementType optional type of element we're looking for
 */
const findElementFromState: (
  elementArray: BasicComponent[],
  elementId: number,
  column: columnParam,
  elementType?: ContentComponentType,
) => BasicComponent | undefined = (
  elementArray: BasicComponent[],
  elementId: number,
  column: columnParam,
  elementType?: ContentComponentType,
) => {
  console.log({ elementArray, elementId })
  if (column === null) {
    return elementArray.find((el) => {
      if (!elementType) {
        return el._id === elementId
      }

      return el._id === elementId && el.type === elementType
    })
  }

  const [columnId, columnSide] = column

  const targetColumnsEl = findElementFromState(
    elementArray,
    columnId,
    null,
    "columns",
  ) as ColumnsElement | undefined

  if (targetColumnsEl) {
    return findElementFromState(
      targetColumnsEl[columnSide],
      elementId,
      null,
      elementType,
    )
  }
}

export default findElementFromState
