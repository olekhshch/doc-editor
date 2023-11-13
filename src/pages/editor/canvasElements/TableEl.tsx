import React from "react"
import { TableElement, columnParam } from "../../../types"
import styled from "styled-components"
import TableCellEl from "./TableCell"
import { useAppDispatch } from "../../../app/hooks"
import { setActiveElementId } from "../../../features/documents/documentsSlice"
import { MdOutlineDragIndicator } from "react-icons/md"
import { DnDTypes } from "../../../DnDtypes"
import { useDrag } from "react-dnd"
type props = {
  tableElObj: TableElement
  column: columnParam
}

const TableEl = ({ tableElObj, column }: props) => {
  const { content, _id } = tableElObj
  const dispatch = useAppDispatch()

  //#TODO: DnD handle when part of a column

  const makeActive = () => {
    if (column === null) {
      dispatch(setActiveElementId(_id))
    } else {
      dispatch(setActiveElementId([_id, ...column]))
    }
  }

  //DnD handle when part of a column
  const [{ isDragging }, dragHandle, dragPreview] = useDrag({
    type: DnDTypes.ELEMENT,
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
    item: { _id, columnSource: column },
  })

  return (
    <StyledTable className="table-el" onClick={makeActive}>
      {column !== null && (
        <div className="toolbar-section">
          <button className="dnd-handle" ref={dragHandle}>
            <MdOutlineDragIndicator />
          </button>
        </div>
      )}
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

  .table-row:hover .left-cell-btns {
    opacity: 1;
  }

  .table-btn {
    margin: auto;
    background-color: transparent;
    border: none;
  }

  .dnd-handle {
    cursor: grab;
  }

  .toolbar-section {
    position: absolute;
    top: -18px;
    left: -6px;
    background-color: white;
    height: fit-content;
    border-radius: 4px;
    opacity: 0;
  }

  &&:hover .toolbar-section {
    opacity: 1;
  }
`
