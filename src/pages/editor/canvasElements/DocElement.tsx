import React, { useContext, useEffect, useMemo, useRef, useState } from "react"
import {
  ColumnsElement,
  DocContentComponent,
  HeadingElement,
  ImageElement,
  ParagraphElement,
  SeparatorElement,
  TableElement,
  columnParam,
} from "../../../types"
import HeadingEl from "./HeadingEl"
import styled from "styled-components"
import StyledContent from "./StyledContent"
import { MdOutlineDragIndicator } from "react-icons/md"
import { IconContext } from "react-icons"
import { useDrag } from "react-dnd"
import { DnDTypes } from "../../../DnDtypes"
import ElementMenu from "./ElementMenu"
import { CurrentDocContext, CurrentThemeContext, MenuState } from "../Editor"
import ColumnsDocElement, { ColumnsElementContext } from "./ColumnsDocElement"
import TextBlockEl from "./TextBlockEl"
import SepratorEl from "./SepratorEl"
import ImageEl from "./ImageEl"
import TableEl from "./TableEl"
import { useAppSelector } from "../../../app/hooks"
import useDocElements from "../../../app/useDocElements"

type props = {
  docElementObj: DocContentComponent | ColumnsElement
  column: columnParam
  orderIdx: number
}

const DocElement = ({ docElementObj, column, orderIdx }: props) => {
  const { type, _id } = docElementObj

  const { elementMenuId, setElementMenuId, setMenuUpwards } =
    useContext(MenuState)
  const [showMenu, setShowMenu] = useState(false)

  const { readonly } = useContext(CurrentDocContext)!

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
      const separatorObj = docElementObj as SeparatorElement
      return <SepratorEl separatorObj={separatorObj} column={column} />
    }

    if (type === "image") {
      const imageElObj = docElementObj as ImageElement
      return <ImageEl imageElObj={imageElObj} column={column} />
    }

    if (type === "table") {
      const tableElObj = docElementObj as TableElement
      return <TableEl tableElObj={tableElObj} column={column} />
    }
    return <>element</>
  }, [docElementObj, type, column])

  //DnD set up
  const [, dragHandle, dragPreview] = useDrag(
    {
      type: DnDTypes.ELEMENT,
      collect: (monitor: any) => ({
        isDragging: monitor.isDragging(),
      }),
      item: { _id, columnSource: column, idx: orderIdx },
    },
    [_id, orderIdx],
  )

  useEffect(() => {
    const handle = document.querySelector(
      `.dnd-handle[data-element-id="${_id}"]`,
    ) as HTMLElement
    if (handle) {
    }
  }, [_id])

  const handleDnDHandleClick = (e: React.MouseEvent) => {
    const shiftUpward = window.innerHeight - e.clientY < 120
    setElementMenuId(showMenu ? null : _id)
    setMenuUpwards(shiftUpward)
    e.stopPropagation()
  }

  useEffect(() => {
    setShowMenu(elementMenuId === _id)
  }, [elementMenuId, _id])

  //Styling
  const { gray, main } = useContext(CurrentThemeContext)

  const { text_blocks, canvas_width } = useAppSelector(
    (state) => state.styling.parameters,
  )

  //GLOBAL WIDTH
  const { maxWidth } = useDocElements()
  const columnsWidthsContext = useContext(ColumnsElementContext)

  const maxContentWidth =
    column === null ? maxWidth : columnsWidthsContext[column[1]]

  return (
    <StyledElementWrapper $gray={gray} $main={main}>
      {column === null && (
        <IconContext.Provider value={{ size: "24", color: main }}>
          <div className="element-left-margin">
            {!readonly && (
              <button
                className={showMenu ? "dnd-handle pressed" : "dnd-handle"}
                data-element-id={_id}
                title="Drag and drop to reoder; Click to expand menu"
                draggable={!readonly}
                ref={dragHandle}
                onClick={(e) => handleDnDHandleClick(e)}
              >
                <MdOutlineDragIndicator />
              </button>
            )}
            {showMenu && <ElementMenu elementId={_id} elementType={type} />}
          </div>
        </IconContext.Provider>
      )}
      {type !== "columns" && (
        <div
          className="doc-element-wrapper"
          style={{ maxWidth: `${canvas_width}px` }}
        >
          <StyledContent
            onClick={() => setElementMenuId(null)}
            ref={dragPreview}
            $canvas_width={canvas_width}
            $max_width={false}
            $gray={gray}
            $font_size={
              type === "separator" ? undefined : text_blocks.font_size
            }
            $readonly={readonly}
            style={{
              width: `${maxContentWidth}px`,
            }}
          >
            {ContentMemo}
          </StyledContent>
        </div>
      )}
      {type === "columns" && (
        <ColumnsDocElement columnsElement={docElementObj} />
      )}
      {/* {column === null && <div className="right-margin" />} */}
    </StyledElementWrapper>
  )
}

export default DocElement

type styledProps = {
  $gray: string
  $main: string
}

const StyledElementWrapper = styled.li<styledProps>`
  /* margin-right: 84px; */
  display: flex;
  /* max-width: 800px; */
  .doc-element-wrapper {
    max-width: 100%;
  }

  .element-left-margin {
    position: relative;
    min-width: var(--editor-left-mg);
    display: flex;
    justify-content: right;
  }

  .dnd-handle {
    vertical-align: middle;
    padding: 0;
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
    background-color: ${(props) => props.$gray};
  }

  &:hover .dnd-handle {
    opacity: 1;
  }

  .right-margin {
    width: 84px;
    max-width: 84px;
    min-width: 84px;
  }

  .table-cell {
    border-top: 1px solid ${(props) => props.$gray};
    border-right: 1px solid ${(props) => props.$gray};
    border-bottom: 1px solid ${(props) => props.$gray};
  }
  .cell-btns {
    box-shadow: 0 0 4px ${(props) => props.$gray};
  }

  .table-el {
    border-top: 1px solid ${(props) => props.$gray};
    border-left: 1px solid ${(props) => props.$gray};
  }

  .cell-toolbar {
    box-shadow: 0 0 6px ${(props) => props.$gray};
  }

  .columns-gap:hover .columns-divider {
    background-color: ${(props) => props.$gray};
  }

  .columns-divider:hover {
    background-color: ${(props) => props.$main};
  }
`
