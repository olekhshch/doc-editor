import React, { useMemo, useCallback, useContext } from "react"
import { HeadingElement, columnParam } from "../../../types"
import { useAppDispatch } from "../../../app/hooks"
import {
  deleteActiveElement,
  deleteElement,
  duplicateElement,
  setActiveElementId,
  setHeadingContent,
  setHeadingLevel,
} from "../../../features/documents/documentsSlice"
import StyledElementToolbar from "./StyledElementToolbar"
import { Remirror, useRemirror, useHelpers, useKeymap } from "@remirror/react"
import { FaTrash } from "react-icons/fa"
import { MenuState } from "../Editor"
import { MdOutlineDragIndicator } from "react-icons/md"
import { HiDuplicate } from "react-icons/hi"
import { useDrag } from "react-dnd"
import { DnDTypes } from "../../../DnDtypes"
import styled from "styled-components"

const hooks = [
  () => {
    const { getText } = useHelpers()
    const dispatch = useAppDispatch()

    const handleEnterPress = useCallback(
      (state: any) => {
        const newContent = getText(state)
        if (newContent.trim() === "") {
          dispatch(deleteActiveElement())
        }
        return true
      },
      [getText, dispatch],
    )

    useKeymap("Enter", handleEnterPress)
  },
]

type props = {
  headingElementObj: HeadingElement
  column: columnParam
}

const HeadingEl = ({ headingElementObj, column }: props) => {
  const dispatch = useAppDispatch()
  const { _id, level, content } = headingElementObj
  const { setElementMenuId } = useContext(MenuState)

  const [{ isDragging }, dragHandle, dragPreview] = useDrag({
    type: DnDTypes.ELEMENT,
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
    item: { _id, columnSource: column },
  })

  const Toolbar = () => {
    type headingLevel = 1 | 2 | 3
    const levels: headingLevel[] = [1, 2, 3]

    const isActive = (l: headingLevel) => {
      return l === level
    }

    const handleLevelChange = (e: React.MouseEvent, l: headingLevel) => {
      e.stopPropagation()
      if (!isActive(l)) {
        dispatch(setHeadingLevel({ newLevel: l, headingElId: _id, column }))
      }
    }

    const handleDelete = () =>
      dispatch(deleteElement({ elementId: _id, column }))

    const handleDuplicate = () => {
      dispatch(duplicateElement({ elementId: _id, column }))
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
            {levels.map((l) => (
              <button
                className={
                  isActive(l)
                    ? "element-toolbar-btn active"
                    : "element-toolbar-btn"
                }
                title="Change heading level"
                onClick={(e) => handleLevelChange(e, l)}
                key={l}
              >
                {l}
              </button>
            ))}
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

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (column === null) {
      dispatch(setActiveElementId(_id))
    } else {
      dispatch(setActiveElementId([_id, ...column]))
    }
    setElementMenuId(null)
  }

  const { manager, state } = useRemirror({
    content,
    stringHandler: "text",
  })

  const HeadingMemo = useMemo(() => {
    const handleTextChange = (props: any) => {
      const { getText } = props.helpers
      const newContent = getText(props)
      if (newContent.trim() !== "") {
        dispatch(setHeadingContent({ headingId: _id, newContent, column }))
      }
    }

    if (level === 1) {
      return (
        <h2 spellCheck="false" ref={dragPreview}>
          <Remirror
            classNames={["heading-element"]}
            manager={manager}
            initialContent={state}
            hooks={hooks}
            onChange={handleTextChange}
          />
        </h2>
      )
    }

    if (level === 2) {
      return (
        <h3 spellCheck="false" ref={dragPreview}>
          <Remirror
            classNames={["heading-element"]}
            manager={manager}
            initialContent={state}
            hooks={hooks}
            onChange={handleTextChange}
          />
        </h3>
      )
    }

    return (
      <h4 spellCheck="false" ref={dragPreview}>
        <Remirror
          classNames={["heading-element"]}
          manager={manager}
          initialContent={state}
          hooks={hooks}
          onChange={handleTextChange}
        />
      </h4>
    )
  }, [level, manager, state, _id, dispatch, dragPreview])

  return (
    <StyledHeading onClick={(e) => handleClick(e)}>
      {!isDragging && <Toolbar />}
      {HeadingMemo}
    </StyledHeading>
  )
}

export default React.memo(HeadingEl)

export const StyledHeading = styled.div`
  .heading-element {
    padding: 0 4px;
  }
`
