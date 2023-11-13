import React, { useCallback, useEffect, useState } from "react"
import styled from "styled-components"
import { TableCell, columnParam } from "../../../types"
import { MdOutlineDragIndicator } from "react-icons/md"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  deleteTableColumn,
  deleteTableRow,
  insertColumnToTable,
  insertRowToTable,
  setTableCellContent,
} from "../../../features/documents/documentsSlice"
import { RemirrorJSON } from "remirror"
import {
  EditorComponent,
  FloatingToolbar,
  FloatingWrapper,
  Remirror,
  useActive,
  useRemirror,
} from "@remirror/react"
import {
  BoldExtension,
  ItalicExtension,
  StrikeExtension,
  TrailingNodeExtension,
  UnderlineExtension,
} from "remirror/extensions"
import { TiDelete } from "react-icons/ti"
import useDebounce from "../../../app/useDebounce"

type props = {
  cellObj: TableCell
  tableId: number
  row: number
  col: number
  column: columnParam
}
const TableCellEl = ({ cellObj, col, row, column, tableId }: props) => {
  const { disableElementsAdding } = useAppSelector((state) => state.documents)
  const { content, _id } = cellObj

  const dispatch = useAppDispatch()

  //#TODO: DnD row replacement
  //#TODO: DnD column replacement
  //#TODO: Remirror link extension
  //#TODO: Header
  //#TODO: import from .csv
  //#TODO: column btns to be visible when hover over whole column
  //#TODO: Sorting in columns
  //#TODO: Table Columns width

  //Remirror set up
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

  const addRow = () => {
    dispatch(insertRowToTable({ tableId, column, rowIndexBefore: row }))
  }

  const addColumn = () => {
    dispatch(insertColumnToTable({ tableId, column, colIndexBefore: col }))
  }

  const deleteRow = () => {
    dispatch(deleteTableRow({ tableId, rowIdx: row, column }))
  }

  const deleteColumn = () => {
    dispatch(deleteTableColumn({ tableId, colIdx: col, column }))
  }

  const TextToolbar = () => {
    // const active = useActive()
    return (
      <div
        className="cell-toolbar"
        style={{ display: state.selection.visible ? "block" : "none" }}
      >
        <button title="Bold">B</button>
        <button title="Italic">I</button>
        <button title="Underline">U</button>
        <button title="Strike">S</button>
      </div>
    )
  }

  return (
    <>
      <StyledCell className="table-cell">
        {row === 0 && (
          <div className="top-cell-btns cell-btns">
            <button className="table-btn cell-dnd-handle">
              <MdOutlineDragIndicator />
            </button>
            <button
              className="table-btn"
              title="Insert column to the right"
              disabled={disableElementsAdding}
              onClick={addColumn}
            >
              +
            </button>
            <button
              className="table-btn"
              title="Delete column"
              onClick={deleteColumn}
            >
              <TiDelete />
            </button>
          </div>
        )}
        {col === 0 && (
          <div className="left-cell-btns  cell-btns">
            <button
              className="table-btn cell-dnd-handle"
              disabled={disableElementsAdding}
            >
              <MdOutlineDragIndicator />
            </button>
            <button
              className="table-btn"
              title="Insert row bellow"
              onClick={addRow}
            >
              +
            </button>
            <button
              className="table-btn"
              title="Delete row"
              onClick={deleteRow}
            >
              <TiDelete />
            </button>
          </div>
        )}
        <div className="cell-content">
          <Remirror
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
              <TextToolbar />
            </FloatingWrapper>
          </Remirror>
        </div>
      </StyledCell>
    </>
  )
}

export default TableCellEl

const StyledCell = styled.div`
  flex-basis: 120px;
  flex-grow: 1;
  position: relative;

  .cell-btns {
    padding: 4px 6px 2px;
    position: absolute;
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

  .top-cell-btns {
    right: calc(50% - 28px);
    top: -12px;
    width: 48px;
  }

  .left-cell-btns {
    top: calc(50% - 12px);
    left: -16px;
    height: 24px;
  }

  .cell-content {
    padding: 4px 4px 4px 16px;
    /* height: 56px; */
  }

  .cell-toolbar {
    padding: 2px 4px;
    background-color: white;
    border-radius: 4px;
  }
`
