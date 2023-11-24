import React, { useCallback, useContext, useState } from "react"
import { TableCell, columnParam } from "../../../types"
import styled from "styled-components"
import { CurrentThemeContext } from "../Editor"
import {
  EditorComponent,
  FloatingWrapper,
  Remirror,
  useRemirror,
} from "@remirror/react"
import { RemirrorJSON } from "remirror"
import {
  BoldExtension,
  ItalicExtension,
  StrikeExtension,
  TrailingNodeExtension,
  UnderlineExtension,
} from "remirror/extensions"
import useTable from "../../../app/useTable"

type props = {
  cellObj: TableCell
  tableId: number
  row: number
  col: number
  column: columnParam
  width: number | null
  widthChangeHandler: (e: React.MouseEvent, a: number) => void
  isLast?: boolean
  resizeMode: boolean
}
const TableCellEl = ({
  cellObj,
  tableId,
  row,
  col,
  column,
  width,
  widthChangeHandler,
  isLast,
  resizeMode,
}: props) => {
  const { content } = cellObj

  //REMIRROR SET UP
  const [cellContent, setCellContent] = useState<RemirrorJSON[]>(content)

  const extensions = useCallback(
    () => [
      new TrailingNodeExtension(),
      new BoldExtension(),
      new ItalicExtension(),
      new UnderlineExtension(),
      new StrikeExtension(),
    ],
    [],
  )

  const { manager, state } = useRemirror({
    extensions,
    content: {
      type: "doc",
      content: cellContent,
    },
  })

  //WIDTHS

  //STYLING
  const { main, gray } = useContext(CurrentThemeContext)

  return (
    <StyledCell
      className="table-cell"
      data-row={row}
      data-col={col}
      $main={main}
      $gray={gray}
      style={{ maxWidth: `${width}px` }}
    >
      <span className="table-cell-content">
        cell. {width}
        {/* <Remirror
          manager={manager}
          initialContent={state}
          onChange={(props) => {
            const { state } = props
            const docJSON: { doc: any } = state.toJSON()
            const newContent = docJSON.doc.content
            setCellContent(newContent)
          }}
        >
          <EditorComponent />
          <FloatingWrapper positioner={"selection"} placement="left">
            toolbar
          </FloatingWrapper>
        </Remirror> */}
      </span>
      <div
        className={isLast ? "table-cell-divider hidden" : "table-cell-divider"}
        onMouseDown={(e) => widthChangeHandler(e, col)}
      />
    </StyledCell>
  )
}

export default TableCellEl

type styledProps = {
  $main: string
  $gray: string
}

const StyledCell = styled.div<styledProps>`
  min-width: 110px;
  flex-grow: 1;
  display: flex;

  .table-cell-content {
    flex-grow: 1;
  }

  .table-cell-divider {
    width: 4px;
    background-color: ${(pr) => pr.$main};
    cursor: col-resize;
  }

  .hidden {
    background-color: transparent;
  }
`
