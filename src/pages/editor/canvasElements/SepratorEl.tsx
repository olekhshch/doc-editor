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
  setSeparatorWidth,
} from "../../../features/documents/documentsSlice"
import Swatches from "../Swatches"
import { ThemeName, themes } from "../../../features/styling/initialState"
import { rgbObjToString } from "../../../functions/rgbObjToString"
import useDebaunce from "../../../app/useDebounce"
import { MdOutlineDragIndicator } from "react-icons/md"
import { useDrag } from "react-dnd"
import { DnDTypes } from "../../../DnDtypes"
import { CurrentDocContext } from "../Editor"

type props = {
  separatorObj: SeparatorElement
  column: null | [number, "left" | "right"]
}
const SepratorEl = ({ separatorObj, column }: props) => {
  const dispatch = useAppDispatch()
  const { _id, colour, width } = separatorObj

  const [currentWidth, setCurrentWidth] = useState(width)

  const debouncedWidth = useDebaunce(currentWidth, 1000)

  useEffect(() => {
    dispatch(
      setSeparatorWidth({ separatorId: _id, column, newWidth: debouncedWidth }),
    )
  }, [debouncedWidth, _id, dispatch])

  const rgbColour = useMemo(() => {
    const matchingTheme = themes.find((theme) => theme.name === colour)
    return (
      matchingTheme?.main ??
      themes.find((theme) => theme.name === "violet")!.main
    )
  }, [colour])

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

    const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target
      const valueNum = parseInt(value, 10)
      setCurrentWidth(valueNum)
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
              min={1}
              max={10}
              step={1}
              value={currentWidth}
              onChange={handleWidthChange}
            />
            <span className="separator-width">{currentWidth}</span>
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
  }, [colour, currentWidth, dispatch, _id, dragHandle])

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
  margin: 8px 0;
  width: 100%;
  height: ${(props) => props.$width}px;
  background-color: rgb(${(props) => props.$colour});
`
