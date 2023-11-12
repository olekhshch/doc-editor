import React, { useContext, useCallback, useState, useEffect } from "react"
import { ParagraphElement } from "../../../types"
import {
  EditorComponent,
  Remirror,
  ThemeProvider,
  useChainedCommands,
  useRemirror,
  useHelpers,
  useKeymap,
} from "@remirror/react"
import {
  BoldExtension,
  ItalicExtension,
  PlaceholderExtension,
  UnderlineExtension,
  StrikeExtension,
  BulletListExtension,
  OrderedListExtension,
} from "remirror/extensions"
import StyledElementToolbar from "./StyledElementToolbar"
import { MenuState } from "../Editor"
import { useAppDispatch } from "../../../app/hooks"
import {
  deleteElement,
  duplicateElement,
  setActiveElementId,
  setParagraphContent,
} from "../../../features/documents/documentsSlice"
import { FaTrash } from "react-icons/fa"
import { HiDuplicate } from "react-icons/hi"
import { MdOutlineDragIndicator } from "react-icons/md"

import styled from "styled-components"
import "remirror/styles/theme.css"
import { useDrag } from "react-dnd"
import { DnDTypes } from "../../../DnDtypes"
import useDebaunce from "../../../app/useDebaunce"
import Swatches from "../Swatches"
// import "remirror/styles/all.css"

type props = {
  textBlockObj: ParagraphElement
  column: null | [number, "left" | "right"]
}

// const hooks = [
//   () => {
//     const { getJSON } = useHelpers()

//     const handleSave = useCallback(
//       ({ state }: any) => {
//         const content = getJSON(state)
//         console.log(content.content)

//         return true
//       },
//       [getJSON],
//     )

//     useKeymap("Mod-s", handleSave)
//   },
// ]

const TextBlockEl = ({ textBlockObj, column }: props) => {
  const dispatch = useAppDispatch()
  const { _id, content } = textBlockObj
  const { setElementMenuId } = useContext(MenuState)
  const [focused, setFocused] = useState(true)

  const [currentContent, setCurrentContent] = useState(content)

  const debouncedContent = useDebaunce(currentContent, 500)

  useEffect(() => {
    dispatch(
      setParagraphContent({
        column,
        newContentArray: debouncedContent,
        elementId: _id,
      }),
    )
  }, [debouncedContent, dispatch, _id])

  useEffect(() => {
    setFocused(false)
  }, [])

  //DnD setup
  const [{ isDragging }, dragHandle, dragPreview] = useDrag({
    type: DnDTypes.ELEMENT,
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
    item: { _id, columnSource: column },
  })

  //Remirror setup
  const extensions = useCallback(
    () => [
      new PlaceholderExtension({ placeholder: "Text block" }),
      new BoldExtension(),
      new ItalicExtension(),
      new UnderlineExtension(),
      new StrikeExtension(),
      new BulletListExtension(),
      new OrderedListExtension(),
    ],
    [],
  )

  const { manager, state } = useRemirror({
    extensions,
    content: {
      type: "doc",
      content: currentContent,
    },
  })

  const Toolbar = () => {
    const chain = useChainedCommands()

    const handleDelete = () => {
      dispatch(deleteElement({ column, elementId: _id }))
    }

    const handleDuplicate = () => {
      dispatch(duplicateElement({ elementId: _id, column }))
    }

    const makeBold = () => {
      chain.toggleBold().focus().run()
    }

    const makeItalic = () => {
      chain.toggleItalic().focus().run()
    }

    const makeUnderline = () => {
      chain.toggleUnderline().focus().run()
    }

    const makeStrike = () => {
      chain.toggleStrike().focus().run()
    }

    const makeUnorderedList = () => {
      chain.toggleBulletList().focus().run()
    }

    const makeOrderedList = () => {
      chain.toggleOrderedList().focus().run()
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
            <button className="element-toolbar-btn" onClick={makeBold}>
              <b>B</b>
            </button>
            <button className="element-toolbar-btn" onClick={makeItalic}>
              <i>I</i>
            </button>
            <button className="element-toolbar-btn" onClick={makeUnderline}>
              U
            </button>
            <button className="element-toolbar-btn" onClick={makeStrike}>
              S
            </button>
            <button className="element-toolbar-btn" onClick={makeUnorderedList}>
              .L
            </button>
            <button className="element-toolbar-btn" onClick={makeOrderedList}>
              1L
            </button>
          </div>
          <div className="toolbar-section">
            <button className="element-toolbar-btn">A</button>
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

    setFocused(true)
    setElementMenuId(null)
  }

  return (
    <ThemeProvider
      className="text-block"
      theme={{
        color: {
          border: "none",
          outline: "none",
        },
        lineHeight: {
          default: "1em",
        },
        space: { "1": "fit-content" },
        boxShadow: {
          1: "none",
          2: "none",
          3: "none",
        },
      }}
    >
      <StyledTextContent
        ref={dragPreview}
        onClick={(e) => handleClick(e)}
        // className="remirror-theme"
      >
        <Remirror
          manager={manager}
          initialContent={state}
          placeholder="Text block"
          classNames={["text-block"]}
          // hooks={hooks}
          autoFocus={focused}
          onChange={(props) => {
            const { state } = props
            const docJSON: { doc: any } = state.toJSON()
            const newContent = docJSON.doc.content
            setCurrentContent(newContent)
          }}
        >
          <Toolbar />
          <EditorComponent />
        </Remirror>
      </StyledTextContent>
    </ThemeProvider>
  )
}

export default React.memo(TextBlockEl)

const StyledTextContent = styled.div`
  height: fit-content;

  .text-block {
    padding: 4px;
    min-height: auto;
    max-height: fit-content;
    min-width: 48px;
    max-width: 100%;
    border: none;
    outline: none;
    text-align: justify;
    font-family: var(--font-2);
  }

  .text-block > .toolbar-section {
    font-size: var(--small-size);
  }

  .text-block li {
    margin-left: 24px;
  }
`
