import React, { useContext, useState, useEffect, useRef } from "react"
import { TableElement, columnParam } from "../../../types"
import styled from "styled-components"
import TableCellEl from "./TableCell"
import { CurrentThemeContext, MenuState } from "../Editor"
import useTable from "../../../app/useTable"
import useDocElements from "../../../app/useDocElements"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { ColumnsElementContext } from "./ColumnsDocElement"
import { HiDuplicate } from "react-icons/hi"
import { FaTrash } from "react-icons/fa"
import {
  deleteElement,
  duplicateElement,
} from "../../../features/documents/documentsSlice"
import { screenwidth_editor } from "../../../screenwidth_treshholds"
import { MdOutlineDragIndicator } from "react-icons/md"
import { useDrag } from "react-dnd"
import { DnDTypes } from "../../../DnDtypes"

type props = {
  tableElObj: TableElement
  column: columnParam
}

const TableEl = ({ tableElObj, column }: props) => {
  const dispatch = useAppDispatch()
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
  const [topPosition, setTopPosition] = useState(0)

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

  //DnD
  const [{ isDragging }, dragHandle, dragPreview] = useDrag({
    type: DnDTypes.ELEMENT,
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
    item: { _id, columnSource: column },
  })

  const TableToolbar = () => {
    const handleDelete = () => {
      dispatch(deleteElement({ column, elementId: _id }))
    }

    const handleDuplicate = () => {
      dispatch(duplicateElement({ elementId: _id, column }))
    }

    return (
      <section className="table-toolbar">
        {column !== null && (
          <div className="toolbar-section">
            <button className="dnd-handle element-toolbar-btn" ref={dragHandle}>
              <MdOutlineDragIndicator />
            </button>
          </div>
        )}
        <button
          className="element-toolbar-btn"
          onClick={handleDuplicate}
          title="Duplicate"
        >
          <HiDuplicate />
        </button>
        <button
          className="element-toolbar-btn delete-btn"
          onClick={handleDelete}
          title="Remove component"
        >
          <FaTrash />
        </button>
      </section>
    )
  }

  return (
    <StyledWrapper $main={main} $gray={gray}>
      <StyledTable
        ref={tableRef}
        $gray={gray}
        $main={main}
        style={{
          maxWidth:
            column === null
              ? `${maxWidth}px`
              : `${columnsContext[column[1]]}px`,
        }}
      >
        {!headingIsVisible && heading && (
          <div
            className="table-heading-placeholder"
            style={{
              height: `${headingHeight}px`,
              top: `${topPosition}px`,
              maxWidth:
                column === null
                  ? `${maxWidth}px`
                  : `${columnsContext[column[1]]}px`,
            }}
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
      <TableToolbar />
    </StyledWrapper>
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
    z-index: 500;
    top: ${window.innerWidth < screenwidth_editor.only_one_sb ? 70 : 0}px;
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

const StyledWrapper = styled.div<styledProps>`
  display: flex;

  .table-toolbar {
    padding: 4px;
    position: absolute;
    right: -32px;
    top: 0;
    z-index: 300;

    display: none;
    flex-direction: column;
    gap: 2px;
    min-width: 24px;
    min-height: 12px;
    background-color: transparent;
  }

  &&:hover .table-toolbar {
    display: flex;
  }

  .table-toolbar .element-toolbar-btn {
    padding: 2px;
    border: none;
    min-width: 16px;
    font-size: var(--small-size);
    text-align: center;
    font-weight: bold;
  }

  .element-toolbar-btn:hover,
  .active {
    background-color: ${(props) => props.$main};
    color: var(--white);
  }
`
