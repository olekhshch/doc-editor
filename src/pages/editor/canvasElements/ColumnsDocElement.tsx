import React, {
  useEffect,
  useContext,
  useState,
  useRef,
  createContext,
} from "react"
import { ColumnsElement } from "../../../types"
import styled from "styled-components"
import DocElement from "./DocElement"
import DnDPlaceholder from "./dndPlaceholder"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  addTextBlockToEmptyColumn,
  setColumnsElDeviation,
} from "../../../features/documents/documentsSlice"
import { CurrentDocContext, CurrentThemeContext } from "../Editor"
import useColumns from "../../../app/useColumns"
import useDebounce from "../../../app/useDebounce"
import useDocElements from "../../../app/useDocElements"
import { constantValues } from "../../../constants"

export const ColumnsElementContext = createContext<{
  left: null | number
  right: null | number
}>({
  left: null,
  right: null,
})

type props = {
  columnsElement: ColumnsElement
}

const ColumnsDocElement = ({ columnsElement }: props) => {
  const dispatch = useAppDispatch()
  const { readonly } = useContext(CurrentDocContext)!
  const { main } = useContext(CurrentThemeContext)
  const { columns, canvas_width } = useAppSelector(
    (state) => state.styling.parameters,
  )

  const { left, right, _id, deviation } = columnsElement

  const [columnsDeviation, setColumnsDeviation] = useState(deviation)

  const debouncedDeviation = useDebounce(columnsDeviation, 40)

  useEffect(() => {
    dispatch(
      setColumnsElDeviation({
        elementId: _id,
        column: null,
        newDeviation: debouncedDeviation,
      }),
    )
  }, [_id, debouncedDeviation, dispatch])

  //COLUMNS WIDTHS
  const { maxWidth, focusColumnLast } = useDocElements()
  const { leftColumnRef, leftWidth, rightColumnRef, rightWidth } = useColumns(
    columns.gap,
    columnsDeviation,
    maxWidth,
  )

  const [showDimensions, setShowDimensions] = useState(false)

  const handleDeviationChange = (e: React.MouseEvent) => {
    const x0 = e.clientX
    setShowDimensions(true)

    const handleMouseMove = (ev: MouseEvent) => {
      const x = ev.clientX
      const dx = x - x0

      const newDeviation = Math.max(
        Math.min(deviation + dx, constantValues.max_deviation_module),
        -1 * constantValues.max_deviation_module,
      )

      // const newDeviation = Math.min(Math.max(-140, columnsDeviation + dx), 140)
      setColumnsDeviation(newDeviation)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", () => {
      setShowDimensions(false)
      window.removeEventListener("mousemove", handleMouseMove)
    })
  }

  useEffect(() => {
    if (left.length === 0) {
      dispatch(addTextBlockToEmptyColumn([_id, "left"]))
    }

    if (right.length === 0) {
      dispatch(addTextBlockToEmptyColumn([_id, "right"]))
    }
  }, [left.length, right.length, _id, dispatch])

  const activateLastOnClick = (e: React.MouseEvent, side: "left" | "right") => {
    e.stopPropagation()
    focusColumnLast([_id, side])
  }

  return (
    <ColumnsElementContext.Provider
      value={{ left: leftWidth, right: rightWidth }}
    >
      <StyledColumnsElement
        $gap={columns.gap}
        $canvas_width={canvas_width}
        $main={main}
      >
        <section
          className="column"
          ref={leftColumnRef}
          style={{ maxWidth: `${leftWidth}px` }}
          onClick={(e) => activateLastOnClick(e, "left")}
        >
          {left.map((element, idx) => (
            <div key={element._id}>
              <DnDPlaceholder indexBefore={idx} columnTarget={[_id, "left"]} />
              <DocElement
                docElementObj={element}
                column={[_id, "left"]}
                orderIdx={idx}
              />
            </div>
          ))}
          {showDimensions && (
            <div className="measurements">
              <div className="measurements-line" />
              <span className="measurements-value">{leftWidth ?? "num"}</span>
            </div>
          )}
        </section>
        <div className="columns-gap" style={{ width: `${columns.gap}px` }}>
          {!readonly && (
            <div
              className="columns-divider"
              onMouseDown={handleDeviationChange}
            />
          )}
        </div>
        <section
          className="column"
          ref={rightColumnRef}
          style={{ maxWidth: `${rightWidth}px` }}
          onClick={(e) => activateLastOnClick(e, "right")}
        >
          {right.map((element, idx) => (
            <div key={element._id}>
              <DnDPlaceholder indexBefore={idx} columnTarget={[_id, "right"]} />
              <DocElement
                docElementObj={element}
                column={[_id, "right"]}
                orderIdx={idx}
              />
            </div>
          ))}
          {showDimensions && (
            <div className="measurements">
              <div className="measurements-line" />
              <span className="measurements-value">{rightWidth ?? "num"}</span>
            </div>
          )}
        </section>
      </StyledColumnsElement>
    </ColumnsElementContext.Provider>
  )
}

export default ColumnsDocElement

type styledProps = {
  $gap: number
  $canvas_width: number
  $main: string
}

const StyledColumnsElement = styled.div<styledProps>`
  display: flex;
  width: 100%;
  max-width: ${(pr) => pr.$canvas_width}px;

  .column {
    display: flex;
    flex-direction: column;
    position: relative;

    flex-grow: 1;
    flex-shrink: 0;
    max-width: ${(pr) => (pr.$canvas_width - pr.$gap) / 2}px;
  }

  .columns-gap {
    flex-shrink: 0;

    display: flex;
    justify-content: center;
  }

  .columns-divider {
    width: 2px;
    flex-shrink: 0;
    cursor: col-resize;
  }

  .measurements {
    position: absolute;
    top: 50%;
    width: 100%;
  }

  .measurements-line {
    background-color: ${(pr) => pr.$main};
    height: 2px;
    width: 100%;
  }

  .measurements-value {
    position: absolute;
    top: -16px;
    left: 50%;
    background-color: white;
    border: 1px solid ${(pr) => pr.$main};
    border-radius: 8px;
  }
`
