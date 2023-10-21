import React, { useState, useCallback, useContext } from "react"
import styled from "styled-components"
import { useAppDispatch } from "../../../app/hooks"
import { renameDoc } from "../../../features/documents/documentsSlice"
import {
  useRemirror,
  Remirror,
  useHelpers,
  useKeymap,
  useCommands,
} from "@remirror/react"
import { CurrentDocContext } from "../Editor"

type props = {
  docTitle: string
  docId: number | null
}

const hooks = [
  () => {
    const { getText } = useHelpers()
    const { insertText } = useCommands()
    const dispatch: any = useAppDispatch()
    const { title } = useContext(CurrentDocContext)!

    const handleEnterPress = useCallback(
      ({ state }: { state: any }) => {
        const newTitle = getText(state)
        if (newTitle.trim() !== "") {
          dispatch(renameDoc({ newTitle }))
        } else {
          insertText(title)
        }
        return true
      },
      [getText, dispatch, title, insertText],
    )

    useKeymap("Enter", handleEnterPress)
  },
]

const MainTitle = ({ docTitle }: props) => {
  console.log("MAIN TITLE RENDERED")

  const { manager, state } = useRemirror({
    content: docTitle,
    stringHandler: "text",
  })

  return (
    <StyledDocTitle>
      <Remirror manager={manager} initialContent={state} hooks={hooks} />
    </StyledDocTitle>
  )
}

export default React.memo(MainTitle)

const StyledDocTitle = styled.h1`
  margin: 0 var(--editor-left-mg) 24px;
  border-bottom: 4px solid var(--main);
  font-family: "Roboto Condensed", sans-serif;
  font-size: var(--h1-size);
  font-weight: normal;

  //remirror
  white-space: pre-wrap;
  height: 1.2em;
  &:focus {
    outline: none;
  }

  input {
    width: 100%;
    font-family: "Roboto Condensed", sans-serif;
    font-size: var(--h1-size);
    border: none;
  }
`
