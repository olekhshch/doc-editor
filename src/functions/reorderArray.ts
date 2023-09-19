export const reoderArray = (
  array: { _id: number }[],
  elementId: number,
  afterIndex: number,
) => {
  const elementToMove = array.find((element) => element._id)
  const arrayWithoutElement = array.filter((el) => el._id !== elementId)
  if (elementToMove) {
    const newArray = arrayWithoutElement.splice(afterIndex, 0, elementToMove)
    return newArray
  }
  return array
}
