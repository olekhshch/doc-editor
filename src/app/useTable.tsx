import React, { useEffect, useRef, useState } from "react"
import useDebounce from "./useDebounce"
import { useAppDispatch } from "./hooks"
import {
  setTableColumnWidth,
  setTableColumnsWidths,
} from "../features/documents/documentsSlice"
import { columnParam } from "../types"
import { constantValues } from "../constants"

const useTable = (
  tableId: number,
  columnWidths: (null | number)[],
  column: columnParam,
) =>
  // row: number,
  // col: number,
  // colWidth: number | null,
  // tableId: number,
  // column: columnParam,
  {
    const dispatch = useAppDispatch()

    const tableRef = useRef<HTMLElement>(null)

    const [widths, setWidths] = useState(columnWidths)
    const [colNumber, setColNumber] = useState(columnWidths.length)
    const [resizeMode, setResizeMode] = useState(false)

    useEffect(() => {
      setColNumber(columnWidths.length)
    }, [columnWidths.length])

    useEffect(() => {
      const newWidths = widths.map((width, colIdx) => {
        if (width === null) {
          const cellRef = tableRef.current!.querySelector(
            `.table-cell[data-col="${colIdx}"]`,
          )
          const { clientWidth } = cellRef!
          return clientWidth
        }
        return width
      })
      setWidths(newWidths)
      dispatch(setTableColumnsWidths({ tableId, column, newWidths }))
    }, [JSON.stringify(widths)])

    const handleWidthChange = (e: React.MouseEvent, col_idx: number) => {
      const x0 = e.clientX

      const handleMouseMove = (ev: MouseEvent) => {
        const columnWidth = widths[col_idx]
        const nextColumnWidth = widths[col_idx + 1]
        if (columnWidth) {
          const x = ev.clientX
          const dif = x - x0
          const newWidths = [...widths]
          const targetWidth0 = columnWidth + dif

          const targetWidth = Math.max(
            targetWidth0,
            constantValues.cell_min_width,
          )
          newWidths[col_idx] = targetWidth
          if (nextColumnWidth) {
            if (Math.sign(dif) < 0) {
              const dif0 = targetWidth - targetWidth0 //extra dif to get rid off
              newWidths[col_idx + 1] = Math.max(
                nextColumnWidth - dif - dif0,
                constantValues.cell_min_width,
              )
              // setWidths(newWidths)
            } else {
              const nextWidth0 = nextColumnWidth - dif
              const nextWidth = Math.max(
                constantValues.cell_min_width,
                nextWidth0,
              )
              const dif0 = nextWidth0 - nextWidth
              newWidths[col_idx + 1] = Math.max(
                nextColumnWidth - dif - dif0,
                constantValues.cell_min_width,
              )
              newWidths[col_idx] = Math.max(
                constantValues.cell_min_width,
                targetWidth + dif0,
              )
              // setWidths(newWidths)
            }
          }
          setWidths(newWidths)
        }
      }

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", () => {
        document.removeEventListener("mousemove", handleMouseMove)
      })
    }

    const cellRef = useRef<HTMLDivElement>(null)

    // useEffect(() => {
    //   if (columnWidth === null && cellRef.current) {
    //     const { clientWidth } = cellRef.current
    //     setColumnWidth(clientWidth)
    //   }
    // }, [columnWidth, cellRef])

    // useEffect(() => {
    //   if (debouncedWidth !== null && debouncedWidth !== colWidth) {
    //     dispatch(
    //       setTableColumnWidth({
    //         tableId,
    //         column,
    //         columnIdx: col,
    //         width: debouncedWidth,
    //       }),
    //     )
    //   }
    // }, [col, colWidth, debouncedWidth, dispatch, tableId])

    return {
      tableRef,
      cellRef,
      handleWidthChange,
      widths,
      colNumber,
      resizeMode,
    }
  }

export default useTable
