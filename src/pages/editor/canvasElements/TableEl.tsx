import React, { useContext, useState, useEffect, useRef } from "react"
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
  const { _id, content, column_widths, heading } = tableElObj
  const { canvas_width } = useAppSelector((state) => state.styling.parameters)

  //#TODO: Adapt columns visibility when column width sum > table width
  const { maxWidth, getVerticalPosition, getDimensions } = useDocElements()
  const columnsContext = useContext(ColumnsElementContext)

  const tableWidth =
    column === null ? maxWidth : columnsContext[column[1]] ?? maxWidth

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
    deleteRow,
    addRow,
    addColumn,
    deleteColumn,
  } = useTable(_id, column_widths, column, tableWidth)

  const mouseOverHandler = (row: number, col: number) => {
    activateRow(row)
    activateColumn(col)
  }

  const mouseLeaveHandler = () => {
    disactivateRow()
    disactivateColumn()
  }

  const widthsSum = widths.reduce((acc, width) => {
    const sum = acc! + (width ?? 0)
    return sum
  }, 0)

  //STYLING
  const { gray, main } = useContext(CurrentThemeContext)

  //HEADING

  const [headingIsVisible, setHeadingIsVisible] = useState(true)
  const [headingHeight, setHeadingHeight] = useState(40)

  useEffect(() => {
    const scrollHandler = () => {
      if (tableRef.current) {
        const headingElement = tableRef.current.querySelector(
          '[data-row-idx="0"]',
        ) as HTMLDivElement
        const { clientHeight } = headingElement
        setHeadingHeight(clientHeight)
        const v_position = getVerticalPosition(tableRef)
        const { height } = getDimensions(tableRef)
        if (v_position < 10 && v_position + height > 40) {
          setHeadingIsVisible(false)
        } else {
          setHeadingIsVisible(true)
        }
      }
    }
    document.addEventListener("scroll", scrollHandler)

    return () => document.removeEventListener("scroll", scrollHandler)
  }, [getVerticalPosition, tableRef])

  return (
    <StyledTable
      ref={tableRef}
      $gray={gray}
      $main={main}
      style={{
        width:
          column === null ? `${maxWidth}px` : `${columnsContext[column[1]]}px`,
      }}
    >
      {!headingIsVisible && heading && (
        <div
          className="table-heading-placeholder"
          style={{ height: `${headingHeight}px` }}
        />
      )}
      {content.map((row, idx) => {
        return (
          <div
            key={idx}
            data-row-idx={idx}
            className={
              heading && idx === 0 && !headingIsVisible
                ? "table-row table-heading"
                : "table-row"
            }
            style={{
              maxWidth: `${widthsSum}px`,
            }}
          >
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
                isLast={i === row.length - 1}
                mouseOverHandler={mouseOverHandler}
                isActive={idx === activeRow || i === activeColumn}
                mouseLeaveHandler={mouseLeaveHandler}
                deleteRow={deleteRow}
                addRow={addRow}
                addColumn={addColumn}
                deleteColumn={deleteColumn}
                heading={heading}
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
  $main: string
}

const StyledTable = styled.section<styledProps>`
  border-top: 1px solid ${(pr) => pr.$gray};
  border-left: 1px solid ${(pr) => pr.$gray};
  box-sizing: border-box;
  width: fit-content;

  .table-row {
    display: flex;
  }

  .table-heading {
    position: fixed;
    top: 0;
    box-shadow: 0 4px 6px ${(pr) => pr.$gray};
  }

  .table-row:hover .left-cell-btns {
    opacity: 1;
  }

  .table-btn {
    border: none;
    background-color: transparent;
  }
`
