import React, { useEffect, useMemo } from "react"
import { DocContentComponent, HeadingElement } from "../../../types"
import HeadingEl from "./HeadingEl"
import styled from "styled-components"
import StyledContent from "./StyledContent"
import { MdOutlineDragIndicator } from "react-icons/md"
import { IconContext } from "react-icons"
import { useDrag } from "react-dnd"
import { DnDTypes } from "../../../DnDtypes"

type props = {
  docElementObj: DocContentComponent
}

const DocElement = ({ docElementObj }: props) => {
  const { type, _id } = docElementObj

  const ContentMemo = useMemo(() => {
    if (type === "heading") {
      const headingObj = docElementObj as HeadingElement
      return <HeadingEl headingElementObj={headingObj} />
    }
    return <>element</>
  }, [docElementObj, type])

  const [{ isDragging }, dragHandle, dragPreview] = useDrag({
    type: DnDTypes.ELEMENT,
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
    item: { _id },
  })

  return (
    <StyledElementWrapper draggable>
      <IconContext.Provider value={{ size: "24" }}>
        <div className="element-left-margin" draggable>
          <div
            className="dnd-handle"
            title="Drag and drop to reoder; Click to expand menu"
            draggable
            ref={dragHandle}
          >
            <MdOutlineDragIndicator />
          </div>
        </div>
      </IconContext.Provider>
      <StyledContent>{ContentMemo}</StyledContent>
    </StyledElementWrapper>
  )
}

export default DocElement

const StyledElementWrapper = styled.li`
  display: flex;
  /* border-bottom: 1px solid black; */

  .element-left-margin {
    width: var(--editor-left-mg);
    display: flex;
    justify-content: right;
  }

  .dnd-handle {
    height: fit-content;
    background-color: transparent;
    border: none;
    cursor: grab;
    opacity: 0;
  }

  &:hover .dnd-handle {
    opacity: 1;
  }
`
