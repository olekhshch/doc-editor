import React, { useEffect, useRef, useState } from "react"
import useDebounce from "./useDebounce"
import { useAppDispatch } from "./hooks"
import {
  deleteTableColumn,
  deleteTableRow,
  insertColumnToTable,
  insertRowToTable,
  setTableColumnWidth,
  setTableColumnsWidths,
} from "../features/documents/documentsSlice"
import { columnParam } from "../types"
import { constantValues } from "../constants"

const useTable = (
  tableId: number,
  columnWidths: (null | number)[],
  column: columnParam,
  tableWidth: number,
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

    const debouncedWidths = useDebounce(widths, 500)

    useEffect(() => {
      dispatch(
        setTableColumnsWidths({ tableId, column, newWidths: debouncedWidths }),
      )
    }, [debouncedWidths])

    const getSumOfWidths = (widths: number[]) => {
      return widths.reduce((acc, width) => {
        return (acc += width)
      }, 0)
    }

    useEffect(() => {
      const newColumnNumber = columnWidths.length
      setColNumber(newColumnNumber)
      //on mount - if no width specified sets width of cell element on canvas given by flex

      // const newWidths = columnWidths.map((width, colIdx) => {
      //   if (width === null) {
      //     const cellRef = tableRef.current!.querySelector(
      //       `.table-cell[data-col="${colIdx}"]`,
      //     )
      //     const { clientWidth } = cellRef!
      //     return clientWidth
      //   }
      //   return width
      // })
      // //checking if sum = table width
      // const sum = newWidths.reduce((acc, width) => {
      //   return (acc += width)
      // }, 0)
      // if (sum < tableWidth) {
      //   newWidths[newColumnNumber - 1] =
      //     newWidths[newColumnNumber - 1] + (tableWidth - sum)
      // }
      // const sum = getSumOfWidths(columnWidths as number[])
      setWidths(columnWidths)
    }, [columnWidths])

    const handleWidthChange = (e: React.MouseEvent, col_idx: number) => {
      const targetWidth = [...widths][col_idx]

      if (targetWidth) {
        const x0 = e.clientX

        const handleMouseMove = (ev: MouseEvent) => {
          const x = ev.clientX
          const dif = x0 - x
          const newTargetWidth = Math.max(
            targetWidth - dif,
            constantValues.cell_min_width,
          )
          const newWidths = [...widths] as number[]
          newWidths[col_idx] = newTargetWidth
          if (col_idx < colNumber - 1) {
            newWidths[col_idx + 1] = Math.max(
              newWidths[col_idx + 1] + dif,
              constantValues.cell_min_width,
            )
          }
          const sum = getSumOfWidths(newWidths)
          if (sum > tableWidth) {
            const extra = sum - tableWidth
            if (newWidths[col_idx] > constantValues.cell_min_width) {
              newWidths[col_idx] = newWidths[col_idx] - extra
            } else if (col_idx < colNumber - 1) {
              newWidths[col_idx + 1] = newWidths[col_idx] - extra
            }
          }

          setWidths(newWidths)
        }

        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", () => {
          document.removeEventListener("mousemove", handleMouseMove)
        })
      }
    }
    // useEffect(() => {
    //   const newWidths = widths.map((width, colIdx) => {
    //     if (width === null) {
    //       const cellRef = tableRef.current!.querySelector(
    //         `.table-cell[data-col="${colIdx}"]`,
    //       )
    //       const { clientWidth } = cellRef!
    //       return clientWidth
    //     }
    //     return width
    //   })

    //   setWidths(newWidths)
    //   dispatch(setTableColumnsWidths({ tableId, column, newWidths }))
    // }, [columnWidths.length])

    // useEffect(() => {
    //   setColNumber(columnWidths.length)
    // }, [columnWidths.length])

    // useEffect(() => {
    //   const newWidths = widths.map((width, colIdx) => {
    //     if (width === null) {
    //       const cellRef = tableRef.current!.querySelector(
    //         `.table-cell[data-col="${colIdx}"]`,
    //       )
    //       const { clientWidth } = cellRef!
    //       return clientWidth
    //     }
    //     return width
    //   })
    //   setWidths(newWidths)
    //   dispatch(setTableColumnsWidths({ tableId, column, newWidths }))

    //   setColNumber(newWidths.length)

    //   console.log({ columnWidths })
    // }, [JSON.stringify(widths), columnWidths.length])

    // const handleWidthChange = (e: React.MouseEvent, col_idx: number) => {
    //   const x0 = e.clientX

    //   const handleMouseMove = (ev: MouseEvent) => {
    //     const columnWidth = widths[col_idx]
    //     const nextColumnWidth = widths[col_idx + 1]

    //     if (columnWidth) {
    //       const x = ev.clientX
    //       const dif = x - x0
    //       const newWidths = [...widths]
    //       const targetWidth0 = columnWidth + dif

    //       const targetWidth = Math.max(
    //         targetWidth0,
    //         constantValues.cell_min_width,
    //       )
    //       newWidths[col_idx] = targetWidth
    //       setWidths(newWidths)
    //       if (nextColumnWidth) {
    //         if (Math.sign(dif) < 0) {
    //           const dif0 = targetWidth - targetWidth0 //extra dif to get rid off
    //           newWidths[col_idx + 1] = Math.max(
    //             nextColumnWidth - dif - dif0,
    //             constantValues.cell_min_width,
    //           )
    //           // setWidths(newWidths)
    //         } else {
    //           const nextWidth0 = nextColumnWidth - dif
    //           const nextWidth = Math.max(
    //             constantValues.cell_min_width,
    //             nextWidth0,
    //           )
    //           const dif0 = nextWidth0 - nextWidth
    //           newWidths[col_idx + 1] = Math.max(
    //             nextColumnWidth - dif - dif0,
    //             constantValues.cell_min_width,
    //           )
    //           newWidths[col_idx] = Math.max(
    //             constantValues.cell_min_width,
    //             targetWidth + dif0,
    //           )
    //           // setWidths(newWidths)
    //         }
    //       }
    //       // setWidths(newWidths)
    //     }
    //   }

    //   document.addEventListener("mousemove", handleMouseMove)
    //   document.addEventListener("mouseup", () => {
    //     document.removeEventListener("mousemove", handleMouseMove)
    //   })
    // }

    //SHOW ROW AND COLUMN WHEN IS OVER CELL
    const [activeRow, setActiveRow] = useState<null | number>(null)
    const [activeColumn, setActiveColumn] = useState<null | number>(null)

    const activateRow = (row: number) => {
      setActiveRow(row)
    }
    const activateColumn = (col: number) => {
      setActiveColumn(col)
    }

    const disactivateRow = () => {
      setActiveRow(null)
    }

    const disactivateColumn = () => {
      setActiveColumn(null)
    }

    //ROWS AND COLUMNS MANIPULATIONS
    const deleteRow = (rowIdx: number) => {
      dispatch(deleteTableRow({ tableId, rowIdx, column }))
    }

    const addRow = (rowIndexBefore: number) => {
      dispatch(insertRowToTable({ tableId, column, rowIndexBefore }))
    }

    const deleteColumn = (colIdx: number) => {
      dispatch(deleteTableColumn({ tableId, colIdx, column }))
    }

    const addColumn = (colIndexBefore: number) => {
      dispatch(insertColumnToTable({ tableId, column, colIndexBefore }))
    }

    return {
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
      deleteColumn,
      addColumn,
    }
  }

export default useTable
