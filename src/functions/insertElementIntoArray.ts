export const insertElementIntoArray = (
  element: any,
  array: any[],
  insertAfterIdx: number,
) => {
  const arrayCopy = [...array]
  if (insertAfterIdx >= 0 && insertAfterIdx < arrayCopy.length) {
    arrayCopy.splice(insertAfterIdx, 0, element)
  }

  return arrayCopy
}
