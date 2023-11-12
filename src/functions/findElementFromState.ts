import {
  BasicComponent,
  ColumnsElement,
  ContentComponentType,
  columnParam,
} from "../types"

/**
 *Returns array with [foundElementObj, it's index in array]
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
) => [BasicComponent | undefined, number] = (
  elementArray: BasicComponent[],
  elementId: number,
  column: columnParam,
  elementType?: ContentComponentType,
) => {
  if (column === null) {
    const targetElement = elementArray.find((el) => {
      if (!elementType) {
        return el._id === elementId
      }

      return el._id === elementId && el.type === elementType
    })

    if (targetElement) {
      const targetIdx = elementArray.findIndex((el) => {
        if (!elementType) {
          return el._id === elementId
        }

        return el._id === elementId && el.type === elementType
      })

      return [targetElement, targetIdx]
    }
    return [undefined, -1]
  }

  const [columnId, columnSide] = column

  const [targetColumnsEl] = findElementFromState(
    elementArray,
    columnId,
    null,
    "columns",
  ) as [ColumnsElement | undefined, number]

  if (targetColumnsEl) {
    return findElementFromState(
      targetColumnsEl[columnSide],
      elementId,
      null,
      elementType,
    )
  }

  return [undefined, -1]
}

export default findElementFromState
