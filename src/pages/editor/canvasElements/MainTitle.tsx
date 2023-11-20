import React, { useState, useCallback, useContext, useEffect } from "react"
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
import useDebounce from "../../../app/useDebounce"

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
  const dispatch = useAppDispatch()
  const { main } = useContext(CurrentThemeContext)
  const {
    parameters: {
      main_title: { text_colour, underlined, font_size, margin_bottom },
    },
  } = useAppSelector((state) => state.styling)

  //READ ONLY
  const { readonly } = useContext(CurrentDocContext)!

  const [title, setTitle] = useState(docTitle)

  const debouncedTitle = useDebounce(title, 300)

  //#TODO: Multiline title support
  //#TODO: Main title font size (styling)

  useEffect(() => {
    if (debouncedTitle.trim() !== "") {
      dispatch(renameDoc({ newTitle: debouncedTitle }))
    }
  }, [debouncedTitle, dispatch])

  const { manager, state } = useRemirror({
    content: title,
    stringHandler: "text",
  })

  return (
    <StyledDocTitle
      $main={main}
      $underlined={underlined}
      $text_colour={text_colour}
      $font_size={font_size}
      $mrg_btm={margin_bottom}
    >
      <Remirror
        manager={manager}
        initialContent={state}
        hooks={hooks}
        onChange={(props) => {
          const { getText } = props.helpers
          const newTitle = getText(props.state)
          setTitle(newTitle)
        }}
        editable={!readonly}
      />
    </StyledDocTitle>
  )
}

export default React.memo(MainTitle)

type styledProps = {
  $main: string
  $text_colour?: rgbColour
  $underlined: boolean
  $font_size: number
  $mrg_btm: number
}

const StyledDocTitle = styled.h1<styledProps>`
  margin: 0 var(--editor-left-mg) ${(pr) => pr.$mrg_btm}px;
  border-bottom: 4px solid
    ${(props) => (props.$underlined ? props.$main : "transparent")};
  font-family: "Roboto Condensed", sans-serif;
  font-size: ${(pr) => pr.$font_size}px;
  font-weight: normal;

  color: ${(props) =>
    props.$text_colour ? `rgb(${rgbObjToString(props.$text_colour)})` : "auto"};

  //remirror
  white-space: pre-wrap;
  min-height: 1.2em;
  &:focus {
    outline: none;
  }

  /* input {
    width: 100%;
    font-family: "Roboto Condensed", sans-serif;
    font-size: var(--h1-size);
    border: none;
  } */
`
