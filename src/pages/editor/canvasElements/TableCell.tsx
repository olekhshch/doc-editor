import React, { useCallback, useContext, useEffect, useState } from "react"
import { TableCell, columnParam } from "../../../types"
import styled from "styled-components"
import { CurrentDocContext, CurrentThemeContext } from "../Editor"
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
import { MdOutlineDragIndicator } from "react-icons/md"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { TiDelete } from "react-icons/ti"
import {
  setActiveElementData,
  setTableCellContent,
  toggleTableHeading,
} from "../../../features/documents/documentsSlice"
import { constantValues } from "../../../constants"
import useDebounce from "../../../app/useDebounce"

type props = {
  cellObj: TableCell
  tableId: number
  row: number
  col: number
  column: columnParam
  width: number | null
  widthChangeHandler: (e: React.MouseEvent, a: number) => void
  mouseOverHandler: (r: number, c: number) => void
  mouseLeaveHandler: () => void
  isLast?: boolean
  isActive: boolean
  deleteRow: (r: number) => void
  addRow: (r: number) => void
  deleteColumn: (c: number) => void
  addColumn: (c: number) => void
  heading: boolean
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
  mouseOverHandler,
  isActive,
  mouseLeaveHandler,
  deleteRow,
  addRow,
  deleteColumn,
  addColumn,
  heading,
}: props) => {
  const { content } = cellObj
  const dispatch = useAppDispatch()
  const { readonly } = useContext(CurrentDocContext)!

  const { disableElementsAdding } = useAppSelector((state) => state.documents)

  //REMIRROR SET UP
  const [cellContent, setCellContent] = useState<RemirrorJSON[]>(content)

  const debouncedContent = useDebounce(cellContent, 500)

  useEffect(() => {
    dispatch(
      setTableCellContent({
        tableId,
        column,
        row,
        col,
        newContent: debouncedContent,
      }),
    )
  }, [col, debouncedContent, dispatch, row, tableId])

  //regular cell
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

  //HEADING AND MAIN COLUMN
  const toggleHeading = () => {
    dispatch(toggleTableHeading({ tableId, column }))
  }

  //STYLING
  const { main, gray } = useContext(CurrentThemeContext)

  const activateOnClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch(
      setActiveElementData({
        id: column === null ? tableId : [tableId, ...column],
        type: "table",
      }),
    )
  }

  return (
    <StyledCell
      className="table-cell"
      data-row={row}
      data-col={col}
      $main={main}
      $gray={gray}
      $isActive={isActive || (heading && row === 0)}
      style={{
        width: `${width}px`,
        // minWidth: `${constantValues.cell_min_width}px`,
        // flexGrow: isLast ? "1" : "0",
      }}
      onMouseOver={(e) => mouseOverHandler(row, col)}
      onMouseLeave={mouseLeaveHandler}
      onClick={activateOnClick}
    >
      {!readonly && (
        <>
          {col === 0 && (
            <div className="left-cell-btns cell-btns">
              <button
                className="table-btn"
                title="Insert row below"
                disabled={disableElementsAdding}
                onClick={() => addRow(row)}
              >
                +
              </button>
              {row === 0 && (
                <input
                  type="checkbox"
                  checked={heading}
                  onChange={toggleHeading}
                />
              )}
              <button
                className="table-btn"
                title="Delete row"
                onClick={() => deleteRow(row)}
              >
                <TiDelete />
              </button>
            </div>
          )}
          {row === 0 && (
            <div className="top-cell-btns cell-btns">
              <button className="table-btn cell-dnd-handle">
                <MdOutlineDragIndicator />
              </button>
              <button
                className="table-btn"
                title="Insert column to the right"
                disabled={disableElementsAdding}
                onClick={() => addColumn(col)}
              >
                +
              </button>
              <button
                className="table-btn"
                title="Delete column"
                onClick={() => deleteColumn(col)}
              >
                <TiDelete />
              </button>
            </div>
          )}
        </>
      )}
      <span
        className={
          heading && row === 0 ? "table-heading-wrapper" : "table-cell-wrapper"
        }
      >
        <Remirror
          manager={manager}
          initialContent={state}
          onChange={(props) => {
            const { state } = props
            const docJSON: { doc: any } = state.toJSON()
            const newContent = docJSON.doc.content
            setCellContent(newContent)
          }}
          editable={!readonly}
        >
          <EditorComponent />
          <FloatingWrapper positioner={"selection"} placement="left">
            toolbar
          </FloatingWrapper>
        </Remirror>
      </span>
      <div
        className={
          readonly ? "table-cell-divider hidden" : "table-cell-divider"
        }
        onMouseDown={(e) => {
          !readonly && widthChangeHandler(e, col)
        }}
      />
    </StyledCell>
  )
}

export default TableCellEl

type styledProps = {
  $main: string
  $gray: string
  $isActive: boolean
}

const StyledCell = styled.div<styledProps>`
  position: relative;
  min-width: 80px;
  box-sizing: border-box;
  /* flex-grow: 1; */
  display: flex;
  background-color: ${(pr) => (pr.$isActive ? pr.$gray : "transparent")};
  white-space: pre-wrap;

  .table-cell-wrapper,
  .table-heading-wrapper {
    margin: 2px 0 2px 4px;
    /* padding: 2px; */
    flex-grow: 1;
    white-space: pre-wrap;
    width: 90%;
    text-align: justify;
  }

  .table-heading-wrapper {
    font-weight: bold;
  }

  .table-cell-divider {
    width: 4px;
    height: 100%;
    background-color: ${(pr) => pr.$main};
    cursor: col-resize;
    opacity: 0;
  }

  &&:hover .table-cell-divider {
    opacity: 1;
  }
  .hidden {
    background-color: transparent;
    cursor: auto;
  }

  .cell-btns {
    padding: 4px 6px 2px;
    position: absolute;
    z-index: 100;
    display: flex;
    gap: 2px;
    background-color: white;
    border-radius: 8px;
    font-size: var(--small-size);
    opacity: 0;
  }

  &&:hover .cell-btns {
    opacity: 1;
  }

  .left-cell-btns {
    top: calc(50% - 16px);
    left: -16px;
    height: 24px;
  }

  .top-cell-btns {
    right: calc(50% - 28px);
    top: -12px;
    /* width: 48px; */
  }
`
