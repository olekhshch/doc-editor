import { ColumnsElement, DocContentComponent } from "../types"

export function insertElementIntoArray<
  Type extends DocContentComponent | ColumnsElement,
>(element: Type, array: Type[], insertAfterIdx: number) {
  const arrayCopy = [...array]
  if (insertAfterIdx >= 0 && insertAfterIdx < arrayCopy.length) {
    arrayCopy.splice(insertAfterIdx + 1, 0, element)
  }

  return arrayCopy.map((el, idx) => ({ ...el, orderIndex: idx })) as Type[]
}
