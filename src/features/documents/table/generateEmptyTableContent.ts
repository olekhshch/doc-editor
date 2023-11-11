import { RemirrorJSON } from "remirror"
import { TableCell } from "../../../types"

/**
 * Generates empty table element content array with r rowns and c columns
 *
 * @param r number of rows
 * @param c number of columns
 */
export const initialCellContent: RemirrorJSON[] = [
  { type: "text", text: "cell text" },
]

const generateEmptyTableContent = (r: number, c: number) => {
  const content: TableCell[][] = []

  let idx = 0

  for (let i = 0; i < r; i++) {
    const rowContent: TableCell[] = []
    for (let j = 0; j < c; j++) {
      const _id = idx
      idx += 1
      const cellObj: TableCell = {
        _id,
        content: initialCellContent,
      }
      rowContent.push(cellObj)
    }
    content.push(rowContent)
  }

  return { content, lastCellId: idx }
}

export default generateEmptyTableContent
