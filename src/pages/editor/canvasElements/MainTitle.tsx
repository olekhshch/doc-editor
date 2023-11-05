import React, { useState, useCallback, useContext } from "react"
import styled from "styled-components"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { renameDoc } from "../../../features/documents/documentsSlice"
import {
  useRemirror,
  Remirror,
  useHelpers,
  useKeymap,
  useCommands,
} from "@remirror/react"
import { CurrentDocContext, CurrentThemeContext } from "../Editor"
import { rgbColour } from "../../../types"
import { rgbObjToString } from "../../../functions/rgbObjToString"

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
  const { main } = useContext(CurrentThemeContext)
  const {
    main_title: { text_colour, underlined },
  } = useAppSelector((state) => state.styling)

  const { manager, state } = useRemirror({
    content: docTitle,
    stringHandler: "text",
  })

  return (
    <StyledDocTitle
      $main={main}
      $underlined={underlined}
      $text_colour={text_colour}
    >
      <Remirror manager={manager} initialContent={state} hooks={hooks} />
    </StyledDocTitle>
  )
}

export default React.memo(MainTitle)

type styledProps = {
  $main: string
  $text_colour?: rgbColour
  $underlined: boolean
}

const StyledDocTitle = styled.h1<styledProps>`
  margin: 0 var(--editor-left-mg) 24px;
  border-bottom: 4px solid
    ${(props) => (props.$underlined ? props.$main : "transparent")};
  font-family: "Roboto Condensed", sans-serif;
  font-size: var(--h1-size);
  font-weight: normal;

  color: ${(props) =>
    props.$text_colour ? `rgb(${rgbObjToString(props.$text_colour)})` : "auto"};

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
