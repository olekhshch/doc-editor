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
import { PlaceholderExtension } from "remirror/extensions"
import StyledElementToolbar from "./StyledElementToolbar"
import { MenuState } from "../Editor"
import { useAppDispatch } from "../../../app/hooks"
import {
  setActiveElementId,
  setParagraphContent,
} from "../../../features/documents/documentsSlice"
import { FaTrash } from "react-icons/fa"
import { HiDuplicate } from "react-icons/hi"

import styled from "styled-components"
import "remirror/styles/theme.css"
// import "remirror/styles/all.css"

type props = {
  textBlockObj: ParagraphElement
  column: null | [number, "left" | "right"]
}

const hooks = [
  () => {
    const { getJSON } = useHelpers()

    const handleSave = useCallback(
      ({ state }: any) => {
        const content = getJSON(state)
        console.log(content.content)

        return true
      },
      [getJSON],
    )

    useKeymap("Mod-s", handleSave)
  },
]

const TextBlockEl = ({ textBlockObj, column }: props) => {
  const dispatch = useAppDispatch()
  const { _id, content } = textBlockObj
  const { setElementMenuId } = useContext(MenuState)
  const [focused, setFocused] = useState(true)

  useEffect(() => {
    setFocused(false)
  }, [])
  //Remirror setup

  const extensions = useCallback(
    () => [new PlaceholderExtension({ placeholder: "Text block" })],
    [],
  )

  const { manager, state } = useRemirror({
    extensions,
    content: {
      type: "doc",
      content,
    },
  })

  const Toolbar = () => {
    const chain = useChainedCommands()
    return (
      <StyledElementToolbar>
        <>
          <div className="toolbar-section-text-block">
            <button className="element-toolbar-btn">B</button>
            <button className="element-toolbar-btn">I</button>
            <button className="element-toolbar-btn">U</button>
          </div>
          <div className="toolbar-section">
            <button
              className="element-toolbar-btn"
              // onClick={handleDuplicate}
              title="Duplicate"
            >
              <HiDuplicate />
            </button>
            <button
              className="element-toolbar-btn delete-btn"
              // onClick={handleDelete}
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
        space: { "1": "fit-content" },
        boxShadow: {
          1: "none",
          2: "none",
          3: "none",
        },
      }}
    >
      <StyledTextContent
        onClick={(e) => handleClick(e)}
        // className="remirror-theme"
      >
        <Remirror
          manager={manager}
          initialContent={state}
          placeholder="Text block"
          classNames={["text-block"]}
          hooks={hooks}
          autoFocus={focused}
          onChange={(props) => {
            const { state } = props
            const docJSON: { doc: any } = state.toJSON()
            const newContent = docJSON.doc.content
            dispatch(
              setParagraphContent({ column, newContentArray: newContent }),
            )
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
    padding: 0 4px;
    min-height: auto;
    min-width: 48px;
    border: none;
    outline: none;
  }

  .text-block > .toolbar-section {
    font-size: var(--small-size);
  }
`
