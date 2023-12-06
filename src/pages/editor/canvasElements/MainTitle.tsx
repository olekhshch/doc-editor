import React, { useState, useCallback, useContext, useEffect } from "react"
import styled from "styled-components"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  renameActiveDoc,
  setActiveElementData,
} from "../../../features/documents/documentsSlice"
import {
  useRemirror,
  Remirror,
  useHelpers,
  useKeymap,
  useCommands,
  PlaceholderExtension,
} from "@remirror/react"
import { CurrentDocContext, CurrentThemeContext } from "../Editor"
import { rgbColour } from "../../../types"
import { rgbObjToString } from "../../../functions/rgbObjToString"
import useDebounce from "../../../app/useDebounce"
import useDocElements from "../../../app/useDocElements"

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

    const { focusFirst } = useDocElements()

    const handleEnterPress = useCallback(
      ({ state }: { state: any }) => {
        const newTitle = getText(state)
        if (newTitle.trim() !== "") {
          dispatch(renameActiveDoc(newTitle))
        } else {
          insertText(title)
        }
        focusFirst()
        return true
      },
      [getText, focusFirst, dispatch, insertText, title],
    )

    useKeymap("Enter", handleEnterPress)

    const handleArrowDown = useCallback(() => {
      focusFirst()

      return true
    }, [focusFirst])

    useKeymap("ArrowDown", handleArrowDown)
  },
]

const MainTitle = ({ docTitle }: props) => {
  const dispatch = useAppDispatch()
  const { main } = useContext(CurrentThemeContext)
  const {
    parameters: {
      main_title: {
        text_colour,
        underlined,
        font_size,
        margin_bottom,
        margin_top,
      },
      canvas_width,
    },
  } = useAppSelector((state) => state.styling)

  const { maxWidth } = useDocElements()

  //READ ONLY
  const { readonly } = useContext(CurrentDocContext)!

  const [title, setTitle] = useState(docTitle)

  const debouncedTitle = useDebounce(title, 300)

  useEffect(() => {
    if (debouncedTitle.trim() !== "") {
      dispatch(renameActiveDoc(debouncedTitle))
    }
  }, [debouncedTitle, dispatch])

  const extensions = useCallback(() => [new PlaceholderExtension("Title")], [])

  const { manager, state } = useRemirror({
    content: title,
    stringHandler: "text",
    extensions,
  })

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch(setActiveElementData({ id: null, type: null }))
  }

  return (
    <StyledDocTitle
      $main={main}
      $underlined={underlined}
      $text_colour={text_colour}
      $font_size={font_size}
      $mrg_btm={margin_bottom}
      $mrg_top={margin_top}
      $canvas_width={maxWidth}
      onClick={handleClick}
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
        placeholder="Title"
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
  $mrg_top: number
  $canvas_width: number
}

const StyledDocTitle = styled.h1<styledProps>`
  margin: ${(pr) => pr.$mrg_top}px 0 ${(pr) => pr.$mrg_btm}px
    var(--editor-left-mg);
  border-bottom: 4px solid
    ${(props) => (props.$underlined ? props.$main : "transparent")};
  font-family: "Roboto Condensed", sans-serif;
  font-size: ${(pr) => pr.$font_size}px;
  font-weight: normal;
  max-width: ${(pr) => pr.$canvas_width}px;
  text-align: justify;

  color: ${(props) =>
    props.$text_colour ? `rgb(${rgbObjToString(props.$text_colour)})` : "auto"};

  //remirror
  white-space: pre-wrap;
  min-height: 1.2em;
  &:focus {
    outline: none;
  }

  &:hover + #show-title-btn-wrap .show-title-btn {
    opacity: 0.3;
  }
`
