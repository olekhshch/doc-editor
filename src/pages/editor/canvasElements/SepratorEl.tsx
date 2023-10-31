import React from "react"
import styled from "styled-components"
import StyledElementToolbar from "./StyledElementToolbar"
import {
  availableSwatches,
  SeparatorElement,
  SwatchesColour,
} from "../../../types"
import { HiDuplicate } from "react-icons/hi"
import { FaTrash } from "react-icons/fa"
import { useAppDispatch } from "../../../app/hooks"
import {
  deleteElement,
  duplicateElement,
  setColourForSeprator,
} from "../../../features/documents/documentsSlice"

type props = {
  separatorObj: SeparatorElement
  column: null | [number, "left" | "right"]
}
const SepratorEl = ({ separatorObj, column }: props) => {
  const dispatch = useAppDispatch()
  const { _id, colour, line, width } = separatorObj

  const Toolbar = () => {
    const handleDuplicate = () => {
      dispatch(duplicateElement({ elementId: _id, column }))
    }

    const handleDelete = () => {
      dispatch(deleteElement({ elementId: _id, column }))
    }

    const setColour = (colour: SwatchesColour) => {
      dispatch(
        setColourForSeprator({ elementId: _id, column, newColour: colour }),
      )
    }

    return (
      <StyledElementToolbar>
        <>
          <div className="toolbar-section">
            {availableSwatches.map((colour) => {
              return (
                <button
                  key={colour}
                  className="element-toolbar-btn colour-swatch"
                  onClick={() => setColour(colour)}
                >
                  <div style={{ backgroundColor: `var(${colour})` }} />
                </button>
              )
            })}
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
      <StyledSeparator $width={width} $colour={colour} />
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
  background-color: var(${(props) => props.$colour});
`
