import React, { useMemo } from "react"
import styled from "styled-components"
import StyledElementToolbar from "./StyledElementToolbar"
import { SeparatorElement, SwatchesColour } from "../../../types"
import { HiDuplicate } from "react-icons/hi"
import { FaTrash } from "react-icons/fa"
import { useAppDispatch } from "../../../app/hooks"
import {
  deleteElement,
  duplicateElement,
  setColourForSeprator,
} from "../../../features/documents/documentsSlice"
import Swatches from "../Swatches"
import { ThemeName, themes } from "../../../features/styling/initialState"
import { rgbObjToString } from "../../../functions/rgbObjToString"

type props = {
  separatorObj: SeparatorElement
  column: null | [number, "left" | "right"]
}
const SepratorEl = ({ separatorObj, column }: props) => {
  const dispatch = useAppDispatch()
  const { _id, colour, line, width } = separatorObj

  const rgbColour = useMemo(() => {
    const matchingTheme = themes.find((theme) => theme.name === colour)
    return (
      matchingTheme?.main ??
      themes.find((theme) => theme.name === "violet")!.main
    )
  }, [colour])

  const Toolbar = () => {
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

    return (
      <StyledElementToolbar>
        <>
          <div className="toolbar-section">
            <Swatches handleChange={setColour} activeThemeName={colour} />
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
  }
  return (
    <>
      <Toolbar />
      <StyledSeparator $width={width} $colour={rgbObjToString(rgbColour)} />
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
