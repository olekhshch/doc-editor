import { BasicComponent, ColumnsElement, columnParam } from "../types"
import findElementFromState from "./findElementFromState"

/**
 * Returns copy of an array with replaced element
 *
 * @param elementObj element that will be added to an array
 * @param elementsArray BasicComponent array (e.g. aciveContent.components or column's side array)
 * @param column column parameter
 * @param replacementIdx index of an element that will be replaced
 */
const replaceElementInArray: (
  elementObj: BasicComponent,
  elementsArray: BasicComponent[],
  column: columnParam,
  replacementIdx: number,
) => BasicComponent[] = (
  elementObj: BasicComponent,
  elementsArray: BasicComponent[],
  column: columnParam,
  replacementIdx: number,
) => {
  const arrayCopy = [...elementsArray]
  if (column === null) {
    arrayCopy[replacementIdx] = elementObj
  } else {
    const [columnId, columnSide] = column
    const [targetColumnsEl, targetColumnIdx] = findElementFromState(
      elementsArray,
      columnId,
      null,
      "columns",
    ) as [ColumnsElement | undefined, number]

    if (targetColumnsEl) {
      const upgratedSide = replaceElementInArray(
        elementObj,
        targetColumnsEl[columnSide],
        null,
        replacementIdx,
      )
      const newColumnsEl: ColumnsElement = {
        ...targetColumnsEl,
        [columnSide]: upgratedSide,
      }
      return replaceElementInArray(
        newColumnsEl,
        elementsArray,
        null,
        targetColumnIdx,
      )
    }
  }

  return arrayCopy
}

export default replaceElementInArray
