import { BasicComponent, ColumnsElement, columnParam } from "../types"

/**
 * returns a copy of a state.activeContent.components array with elements inserted after the element with specific id
 *
 * @param elementsToAdd document elements that should be added one after each other
 * @param elementsArray state.activeContent.components array where elements will be added
 * @param afterId id of the element after which new elements will be inserted
 * @param column param to identify if lements should be inserted in a column or as an ordinary doc elements
 */
function addElementsToState(
  elementsArray: BasicComponent[],
  afterId: number,
  column: columnParam,
  ...elementsToAdd: BasicComponent[]
) {
  const elementsArrayCopy = [...elementsArray]

  if (column === null) {
    //elements are not a part of a column

    const afterIdx = elementsArray.findIndex((el) => el._id === afterId)
    const startIdx = afterIdx >= 0 ? afterIdx + 1 : elementsArrayCopy.length

    elementsArrayCopy.splice(startIdx, 0, ...elementsToAdd)
  } else {
    //elements will be inserted in a column
    const [columnId, columnSide] = column
    const targetColumnsEl = elementsArrayCopy.find(
      (el) => el._id === columnId && el.type === "columns",
    ) as ColumnsElement | undefined

    if (targetColumnsEl) {
      const targetSide = targetColumnsEl[columnSide]
      const columnIdx = elementsArrayCopy.findIndex(
        (el) => el._id === columnId && el.type === "columns",
      ) as number

      // const afterIdx = targetSide.findIndex((el) => el._id === afterId)
      // const startIdx = afterIdx >= 0 ? afterIdx + 1 : targetSide.length

      const sideWithElementsAdded = addElementsToState(
        targetSide,
        afterId,
        null,
        ...elementsToAdd,
      )

      const newColumnsElement: ColumnsElement = {
        ...targetColumnsEl,
        [columnSide]: sideWithElementsAdded,
      }

      elementsArrayCopy[columnIdx] = newColumnsElement
    }
  }

  return elementsArrayCopy.map((el, idx) => ({ ...el, orderIndex: idx }))
}

export default addElementsToState
