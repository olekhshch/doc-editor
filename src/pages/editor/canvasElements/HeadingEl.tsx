import React, {
  useMemo,
  useCallback,
  useContext,
  useState,
  useEffect,
} from "react"
import { HeadingElement, columnParam } from "../../../types"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  addFocusCb,
  addParagraph,
  deleteActiveElement,
  deleteElement,
  duplicateElement,
  setActiveElementData,
  setHeadingContent,
  setHeadingLevel,
} from "../../../features/documents/documentsSlice"
import StyledElementToolbar from "./StyledElementToolbar"
import {
  Remirror,
  useRemirror,
  useHelpers,
  useKeymap,
  EditorComponent,
  useChainedCommands,
} from "@remirror/react"
import { FaTrash } from "react-icons/fa"
import { CurrentDocContext, MenuState } from "../Editor"
import { MdOutlineDragIndicator } from "react-icons/md"
import { HiDuplicate } from "react-icons/hi"
import { useDrag } from "react-dnd"
import { DnDTypes } from "../../../DnDtypes"
import styled from "styled-components"
import useDebounce from "../../../app/useDebounce"
import { rgbObjToString } from "../../../functions/rgbObjToString"

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
        dispatch(addParagraph({ column: null }))
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

  const [hContent, setHContent] = useState(content)

  const debouncedContent = useDebounce(hContent, 400)

  useEffect(() => {
    dispatch(
      setHeadingContent({
        headingId: _id,
        newContent: debouncedContent,
        column,
      }),
    )
  }, [_id, debouncedContent, dispatch])

  //Dnd setup
  const [{ isDragging }, dragHandle, dragPreview] = useDrag({
    type: DnDTypes.ELEMENT,
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
    item: { _id, columnSource: column },
  })

  //STYLING
  const { headings, general } = useAppSelector(
    (state) => state.styling.parameters,
  )
  const { align, font_size, font_colour } = headings[level]

  const headingFontColour = `rgb${rgbObjToString(
    font_colour ?? general.font_colour.colour,
  )}`

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

  const activateElement = () => {
    if (column === null) {
      dispatch(setActiveElementData({ id: _id, type: "heading" }))
    } else {
      dispatch(setActiveElementData({ id: [_id, ...column], type: "heading" }))
    }
    setElementMenuId(null)
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    activateElement()
  }

  const { manager, state } = useRemirror({
    content,
    stringHandler: "text",
  })

  const { readonly } = useContext(CurrentDocContext)!

  const Focus = () => {
    const chain = useChainedCommands()

    const focus_cb = useCallback(() => {
      activateElement()
      chain.focus().run()
    }, [])

    useEffect(() => {
      if (!headingElementObj.focus) {
        dispatch(
          addFocusCb({
            element_type: "heading",
            elementId: _id,
            column,
            focus_cb,
          }),
        )
      }
    }, [focus_cb])
    return <></>
  }

  const HeadingMemo = useMemo(() => {
    const handleTextChange = (props: any) => {
      const { getText } = props.helpers
      const newContent = getText(props)
      if (newContent.trim() !== "") {
        setHContent(newContent)
      }
    }

    if (level === 1) {
      return (
        <h2
          spellCheck="false"
          ref={dragPreview}
          style={{
            color: headingFontColour,
            textAlign: align,
            fontSize: font_size,
          }}
        >
          <Remirror
            classNames={["heading-element"]}
            manager={manager}
            initialContent={state}
            hooks={hooks}
            onChange={handleTextChange}
            editable={!readonly}
            autoFocus={true}
          />
        </h2>
      )
    }

    if (level === 2) {
      return (
        <h3
          spellCheck="false"
          ref={dragPreview}
          style={{
            color: headingFontColour,
            textAlign: align,
            fontSize: font_size,
          }}
        >
          <Remirror
            classNames={["heading-element"]}
            manager={manager}
            initialContent={state}
            hooks={hooks}
            onChange={handleTextChange}
            editable={!readonly}
            autoFocus={true}
          >
            <EditorComponent />
            <Focus />
          </Remirror>
        </h3>
      )
    }

    return (
      <h4
        spellCheck="false"
        ref={dragPreview}
        style={{
          color: headingFontColour,
          textAlign: align,
          fontSize: font_size,
        }}
      >
        <Remirror
          classNames={["heading-element"]}
          manager={manager}
          initialContent={state}
          hooks={hooks}
          onChange={handleTextChange}
          editable={!readonly}
          autoFocus={true}
        />
      </h4>
    )
  }, [
    level,
    dragPreview,
    headingFontColour,
    align,
    font_size,
    manager,
    state,
    readonly,
  ])

  const { canvas_width } = useAppSelector((state) => state.styling.parameters)

  return (
    <StyledHeading onClick={handleClick} $canvas_width={canvas_width}>
      {!isDragging && <Toolbar />}
      {HeadingMemo}
    </StyledHeading>
  )
}

export default React.memo(HeadingEl)

type styledProps = {
  $canvas_width: number
}

export const StyledHeading = styled.div<styledProps>`
  .heading-element {
    padding: 0;
    /* max-width: calc(
      var(--editor-canvas-width) - var(--editor-left-mg) -
        var(--editor-right-mg)
    ); */
    max-width: ${(pr) => pr.$canvas_width}px;
    /* margin: 0 var(--editor-left-mg) 0 0; */
  }
`
