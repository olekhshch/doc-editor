import React from "react"
import { TableElement, columnParam } from "../../../types"
import styled from "styled-components"
import TableCellEl from "./TableCell"
import { useAppDispatch } from "../../../app/hooks"
import { setActiveElementId } from "../../../features/documents/documentsSlice"
type props = {
  tableElObj: TableElement
  column: columnParam
}

const TableEl = ({ tableElObj, column }: props) => {
  const { content, _id } = tableElObj
  const dispatch = useAppDispatch()

  const Btns = () => {
    return <div className="cell-btns-wrapper">btns</div>
  }

  const makeActive = () => {
    if (column === null) {
      dispatch(setActiveElementId(_id))
    } else {
      dispatch(setActiveElementId([_id, ...column]))
    }
  }
  return (
    <StyledTable className="table-el" onClick={makeActive}>
      {content.map((row, idx) => {
        return (
          <div className="table-row" key={idx}>
            {row.map((cell, i) => (
              <TableCellEl
                tableId={_id}
                cellObj={cell}
                col={i}
                row={idx}
                key={cell._id}
                column={column}
              />
            ))}
          </div>
        )
      })}
    </StyledTable>
  )
}

export default TableEl

const StyledTable = styled.section`
  display: flex;
  flex-direction: column;

  .table-row {
    display: flex;
  }

  .table-btn {
    margin: auto;
    background-color: transparent;
    border: none;
  }

  .dnd-handle {
    cursor: grab;
  }
`
