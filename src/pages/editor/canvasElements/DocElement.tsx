import React, { useContext, useEffect, useMemo, useState } from "react"
import {
  ColumnsElement,
  DocContentComponent,
  HeadingElement,
  ParagraphElement,
} from "../../../types"
import HeadingEl from "./HeadingEl"
import styled from "styled-components"
import StyledContent from "./StyledContent"
import { MdOutlineDragIndicator } from "react-icons/md"
import { IconContext } from "react-icons"
import { useDrag } from "react-dnd"
import { DnDTypes } from "../../../DnDtypes"
import ElementMenu from "./ElementMenu"
import { useAppDispatch } from "../../../app/hooks"
import { setActiveElementId } from "../../../features/documents/documentsSlice"
import { MenuState } from "../Editor"
import ColumnsDocElement from "./ColumnsDocElement"
import TextBlockEl from "./TextBlockEl"
import SepratorEl from "./SepratorEl"

type props = {
  docElementObj: DocContentComponent | ColumnsElement
  column: null | [number, "left" | "right"]
}

const DocElement = ({ docElementObj, column }: props) => {
  // const dispatch = useAppDispatch()
  const { type, _id } = docElementObj

  const { elementMenuId, setElementMenuId } = useContext(MenuState)
  const [showMenu, setShowMenu] = useState(false)

  const ContentMemo = useMemo(() => {
    if (type === "heading") {
      const headingObj = docElementObj as HeadingElement
      return <HeadingEl headingElementObj={headingObj} column={column} />
    }

    if (type === "paragraph") {
      const textBlockObj = docElementObj as ParagraphElement
      return <TextBlockEl textBlockObj={textBlockObj} column={column} />
    }

    if (type === "separator") {
      return <SepratorEl />
    }
    return <>element</>
  }, [docElementObj, type, column])

  const [{ isDragging }, dragHandle, dragPreview] = useDrag({
    type: DnDTypes.ELEMENT,
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
    item: { _id, columnSource: column },
  })

  const handleDnDHandleClick = (e: React.MouseEvent) => {
    setElementMenuId(showMenu ? null : _id)
    e.stopPropagation()
  }

  useEffect(() => {
    setShowMenu(elementMenuId === _id)
  }, [elementMenuId, _id])

  return (
    <StyledElementWrapper draggable>
      {column === null && (
        <IconContext.Provider value={{ size: "24" }}>
          <div className="element-left-margin" draggable>
            <button
              className={showMenu ? "dnd-handle pressed" : "dnd-handle"}
              title="Drag and drop to reoder; Click to expand menu"
              draggable
              ref={dragHandle}
              onClick={(e) => handleDnDHandleClick(e)}
            >
              <MdOutlineDragIndicator />
            </button>
            {showMenu && <ElementMenu elementId={_id} elementType={type} />}
          </div>
        </IconContext.Provider>
      )}
      {type !== "columns" && (
        <>
          <StyledContent
            onClick={() => setElementMenuId(null)}
            ref={dragPreview}
            $max_width={type === "separator"}
          >
            {ContentMemo}
          </StyledContent>
          <div className="right-margin" />
        </>
      )}
      {type === "columns" && (
        <ColumnsDocElement columnsElement={docElementObj} />
      )}
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
    padding: 2px 0;
    width: fit-content;
    height: fit-content;
    background-color: transparent;
    border: none;
    border-radius: 6px;
    cursor: grab;
    opacity: 0;
  }

  .pressed {
    opacity: 1;
    background-color: var(--gray);
  }

  &:hover .dnd-handle {
    opacity: 1;
  }

  .right-margin {
    width: 48px;
  }
`
