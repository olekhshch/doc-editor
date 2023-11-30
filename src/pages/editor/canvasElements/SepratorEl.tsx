import React, { useMemo, useState, useEffect, useContext } from "react"
import styled from "styled-components"
import StyledElementToolbar from "./StyledElementToolbar"
import { SeparatorElement } from "../../../types"
import { HiDuplicate } from "react-icons/hi"
import { FaTrash } from "react-icons/fa"
import { useAppDispatch } from "../../../app/hooks"
import {
  deleteElement,
  duplicateElement,
  setActiveElementData,
  setColourForSeprator,
  setSeparatorMargins,
  setSeparatorWidth,
} from "../../../features/documents/documentsSlice"
import Swatches from "../Swatches"
import { ThemeName, themes } from "../../../features/styling/initialState"
import { rgbObjToString } from "../../../functions/rgbObjToString"
import useDebounce from "../../../app/useDebounce"
import { MdOutlineDragIndicator } from "react-icons/md"
import { useDrag } from "react-dnd"
import { DnDTypes } from "../../../DnDtypes"
import { CurrentDocContext } from "../Editor"
import useDocElements from "../../../app/useDocElements"
import { ColumnsElementContext } from "./ColumnsDocElement"

type props = {
  separatorObj: SeparatorElement
  column: null | [number, "left" | "right"]
}
const SepratorEl = ({ separatorObj, column }: props) => {
  const dispatch = useAppDispatch()
  const { _id, colour, width, margin_bottom, margin_top } = separatorObj

  const [currentWidth, setCurrentWidth] = useState(width)
  const [topMargin, setTopMargin] = useState(margin_top)
  const [btmMargin, setBtmMarin] = useState(margin_bottom)

  const debouncedWidth = useDebounce(currentWidth, 1000)
  const debouncedTopMargin = useDebounce(topMargin, 500)
  const debouncedBtmMargin = useDebounce(btmMargin, 500)

  useEffect(() => {
    dispatch(
      setSeparatorWidth({ separatorId: _id, column, newWidth: debouncedWidth }),
    )

    if (debouncedBtmMargin !== margin_bottom) {
      dispatch(
        setSeparatorMargins({
          elementId: _id,
          column,
          margin_bottom: debouncedBtmMargin,
        }),
      )
    }

    if (debouncedTopMargin !== margin_top) {
      dispatch(
        setSeparatorMargins({
          elementId: _id,
          column,
          margin_top: debouncedTopMargin,
        }),
      )
    }
  }, [
    debouncedWidth,
    _id,
    dispatch,
    debouncedBtmMargin,
    margin_bottom,
    debouncedTopMargin,
    margin_top,
  ])

  const rgbColour = useMemo(() => {
    const matchingTheme = themes.find((theme) => theme.name === colour)
    return (
      matchingTheme?.main ??
      themes.find((theme) => theme.name === "violet")!.main
    )
  }, [colour])

  //Element width
  const { maxWidth } = useDocElements()
  const columnWidthsContext = useContext(ColumnsElementContext)!

  //DnD setup
  const [{ isDragging }, dragHandle, dragPreview] = useDrag({
    type: DnDTypes.ELEMENT,
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
    item: { _id, columnSource: column },
  })

  const Toolbar = useMemo(() => {
    const handleDuplicate = () => {
      dispatch(duplicateElement({ elementId: _id, column }))
    }

    const handleDelete = () => {
      dispatch(deleteElement({ elementId: _id, column }))
    }

    const setColour = (colour: ThemeName) => {
      dispatch(
        setColourForSeprator({ elementId: _id, column, newColour: colour }),
      )
    }

    const handleRangeChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      param: "width" | "top_mrg" | "btm_mrg",
    ) => {
      const { value } = e.target
      const valueNum = parseInt(value, 10)
      switch (param) {
        case "width":
          setCurrentWidth(valueNum)
          break
        case "top_mrg":
          setTopMargin(valueNum)
          break
        case "btm_mrg":
          setBtmMarin(valueNum)
      }
    }

    return (
      <StyledElementToolbar>
        <>
          {column !== null && (
            <div className="toolbar-section">
              <button className="dnd-handle" ref={dragHandle}>
                <MdOutlineDragIndicator />
              </button>
            </div>
          )}
          <div className="toolbar-section">
            <Swatches handleChange={setColour} activeThemeName={colour} />
          </div>
          <div className="toolbar-section">
            <input
              title="Separator's width"
              type="range"
              min={0}
              max={10}
              step={1}
              value={currentWidth}
              onChange={(e) => handleRangeChange(e, "width")}
            />
            <span className="separator-width">{currentWidth}</span>
          </div>
          <div className="toolbar-section">
            <input
              title="Top margin"
              type="range"
              min={0}
              max={40}
              step={1}
              value={topMargin}
              onChange={(e) => handleRangeChange(e, "top_mrg")}
            />
            <span className="separator-width">{topMargin}</span>
          </div>
          <div className="toolbar-section">
            <input
              title="Bottom margin"
              type="range"
              min={0}
              max={40}
              step={1}
              value={btmMargin}
              onChange={(e) => handleRangeChange(e, "btm_mrg")}
            />
            <span className="separator-width">{btmMargin}</span>
          </div>
          <div className="toolbar-section">
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
          </div>
        </>
      </StyledElementToolbar>
    )
  }, [dragHandle, colour, currentWidth, topMargin, btmMargin, dispatch, _id])

  const handleClick = (e: React.MouseEvent) => {
    dispatch(
      setActiveElementData({
        id: column === null ? _id : [_id, ...column],
        type: "separator",
      }),
    )
    e.stopPropagation()
  }

  return (
    <>
      {Toolbar}
      <StyledSeparator
        style={{
          width:
            column === null
              ? `${maxWidth}px`
              : `${columnWidthsContext[column[1]]}px`,
          marginTop:
            currentWidth === 0
              ? `${topMargin + btmMargin}px`
              : `${topMargin}px`,
          marginBottom: `${btmMargin}px`,
        }}
        $width={currentWidth}
        $colour={rgbObjToString(rgbColour)}
        onClick={(e) => handleClick(e)}
      />
    </>
  )
}

export default React.memo(SepratorEl)

type styledProps = {
  $width: number
  $colour: string
}

const StyledSeparator = styled.div<styledProps>`
  width: 100%;
  height: ${(props) => props.$width}px;
  background-color: rgb(${(props) => props.$colour});
`
