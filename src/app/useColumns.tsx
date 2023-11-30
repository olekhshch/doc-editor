import React, { useRef, useState, useEffect } from "react"
import { useAppSelector } from "./hooks"

const useColumns = (gap: number, deviation: number, maxGlobalWidth: number) => {
  const { canvas_width } = useAppSelector((state) => state.styling.parameters)
  const leftColumnRef = useRef<HTMLElement>(null)
  const rightColumnRef = useRef<HTMLElement>(null)

  const [leftWidth, setLeftWidth] = useState<null | number>(null)
  const [rightWidth, setRightWidth] = useState<null | number>(null)
  const [maxColumnWidth, setMaxColumnWidth] = useState(
    (maxGlobalWidth - gap) / 2,
  )

  useEffect(() => {
    if (leftColumnRef.current! && !leftWidth) {
      setLeftWidth(leftColumnRef.current.clientWidth + deviation)
    }
    if (rightColumnRef.current! && !rightWidth) {
      setRightWidth(rightColumnRef.current.clientWidth - deviation)
    }

    if (leftWidth) {
      setLeftWidth(maxColumnWidth + deviation)
    }

    if (rightWidth) {
      setRightWidth(maxColumnWidth - deviation)
    }
  }, [deviation, leftWidth, maxColumnWidth, rightWidth])

  //width validation to fit max canvas width
  useEffect(() => {
    setMaxColumnWidth((maxGlobalWidth - gap) / 2)
  }, [maxGlobalWidth, gap])

  useEffect(() => {
    if (
      leftWidth &&
      rightWidth &&
      (leftWidth > maxColumnWidth + deviation ||
        rightWidth > maxColumnWidth - deviation)
    ) {
      const correctedLeftWidth = maxColumnWidth + deviation
      setLeftWidth(correctedLeftWidth)
      const correctedRightWidth = maxColumnWidth - deviation
      setRightWidth(correctedRightWidth)
    }
  }, [deviation, leftWidth, maxColumnWidth, rightWidth])

  return { leftColumnRef, leftWidth, rightColumnRef, rightWidth }
}

export default useColumns
