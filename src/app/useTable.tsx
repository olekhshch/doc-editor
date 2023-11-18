import React, { useRef, useState } from "react"

const useTable = () => {
  const tableRef = useRef<HTMLElement>(null)
  const [currentTableId, setCurrentTableId] = useState<number | null>(null)
  const [activeColumn, setActiveColumn] = useState<number | null>(null)

  return {
    tableRef,
    currentTableId,
    activeColumn,
    setActiveColumn,
    setCurrentTableId,
  }
}

export default useTable
