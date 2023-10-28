import { DocContentComponent } from "../types"

export function removeElementFromArray<
  Type extends { _id: number; orderIndex: number }[],
>(elementId: number, array: Type) {
  const arrayCopy = [...array]

  return arrayCopy
    .filter((el) => el._id !== elementId)
    .map((el, idx) => ({ ...el, orderIndex: idx }))
}
