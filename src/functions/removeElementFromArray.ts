import { BasicComponent, DocContentComponent } from "../types"

export function removeElementFromArray<Type extends BasicComponent[]>(
  elementId: number,
  array: Type,
) {
  const arrayCopy = [...array]

  return arrayCopy.filter((el) => el._id !== elementId)
}
