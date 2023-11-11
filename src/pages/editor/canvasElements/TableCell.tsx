import React from "react"
import styled from "styled-components"
import { TableCell, columnParam } from "../../../types"
import { MdOutlineDragIndicator } from "react-icons/md"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  insertColumnToTable,
  insertRowToTable,
} from "../../../features/documents/documentsSlice"

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

  //#TODO: Row and column deletion
  //#TODO: DnD row replacement
  //#TODO: DnD column replacement
  //#TODO: Remirror cell content (b, i , u, s)
  //#TODO: Header
  //#TODO: import from .csv

  const addRow = () => {
    dispatch(insertRowToTable({ tableId, column, rowIndexBefore: row }))
  }

  const addColumn = () => {
    dispatch(insertColumnToTable({ tableId, column, colIndexBefore: col }))
  }

  return (
    <>
      <StyledCell className="table-cell">
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
        </div>
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
          </div>
        )}
        <div className="cell-content">content {_id}</div>
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
`
