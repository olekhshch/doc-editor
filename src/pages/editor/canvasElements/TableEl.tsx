import React, { useContext, useRef } from "react"
import { TableElement, columnParam } from "../../../types"
import styled from "styled-components"
import TableCellEl from "./TableCell"
import { CurrentThemeContext } from "../Editor"
import useTable from "../../../app/useTable"
import useDocElements from "../../../app/useDocElements"
import { useAppSelector } from "../../../app/hooks"
import { ColumnsElementContext } from "./ColumnsDocElement"

type props = {
  tableElObj: TableElement
  column: columnParam
}

const TableEl = ({ tableElObj, column }: props) => {
  const { _id, content, column_widths } = tableElObj
  const { canvas_width } = useAppSelector((state) => state.styling.parameters)

  const { maxWidth } = useDocElements()
  const columnsContext = useContext(ColumnsElementContext)

  const {
    tableRef,
    handleWidthChange,
    widths,
    colNumber,
    activeRow,
    activateRow,
    disactivateRow,
    activateColumn,
    activeColumn,
    disactivateColumn,
  } = useTable(_id, column_widths, column)

  const mouseOverHandler = (row: number, col: number) => {
    activateRow(row)
    activateColumn(col)
  }

  const mouseLeaveHandler = () => {
    disactivateRow()
    disactivateColumn()
  }

  //STYLING
  const { gray } = useContext(CurrentThemeContext)

  return (
    <StyledTable
      ref={tableRef}
      $gray={gray}
      style={{
        width:
          column === null ? `${maxWidth}px` : `${columnsContext[column[1]]}px`,
      }}
    >
      {content.map((row, idx) => {
        return (
          <div key={idx} className="table-row">
            {row.map((cell, i) => (
              <TableCellEl
                key={cell._id}
                cellObj={cell}
                row={idx}
                col={i}
                column={column}
                tableId={_id}
                width={widths[i]}
                widthChangeHandler={handleWidthChange}
                isLast={i === colNumber - 1}
                mouseOverHandler={mouseOverHandler}
                isActive={idx === activeRow || i === activeColumn}
                mouseLeaveHandler={mouseLeaveHandler}
              />
            ))}
          </div>
        )
      })}
    </StyledTable>
  )
}

export default TableEl

type styledProps = {
  $gray: string
}

const StyledTable = styled.section<styledProps>`
  border-top: 1px solid ${(pr) => pr.$gray};
  border-left: 1px solid ${(pr) => pr.$gray};

  .table-row {
    display: flex;
  }
`
