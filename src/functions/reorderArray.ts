import { BasicComponent } from "../types"

export const reoderArray = (
  array: BasicComponent[],
  elementId: number,
  placementIndex: number,
) => {
  const elementToMove = array.find((el) => el._id === elementId)

  if (elementToMove) {
    const filteredArray = array.filter((el) => el._id !== elementId)
    // const newPlaceIndex =
    //   elementToMove.orderIndex > placementIndex
    //     ? placementIndex
    //     : placementIndex - 1
    filteredArray.splice(placementIndex, 0, elementToMove)
    return filteredArray.map((el, idx) => ({ ...el, orderIndex: idx }))
  }
  return array
}
