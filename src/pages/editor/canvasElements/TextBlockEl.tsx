import React, {
  useContext,
  useCallback,
  useState,
  useEffect,
  useRef,
} from "react"
import { ParagraphElement } from "../../../types"
import {
  EditorComponent,
  Remirror,
  ThemeProvider,
  useChainedCommands,
  useRemirror,
} from "@remirror/react"
import {
  BoldExtension,
  ItalicExtension,
  PlaceholderExtension,
  UnderlineExtension,
  StrikeExtension,
  BulletListExtension,
  OrderedListExtension,
  TrailingNodeExtension,
} from "remirror/extensions"
import StyledElementToolbar from "./StyledElementToolbar"
import { CurrentDocContext, MenuState } from "../Editor"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  deleteElement,
  duplicateElement,
  setActiveElementData,
  setParagraphContent,
} from "../../../features/documents/documentsSlice"
import { FaTrash } from "react-icons/fa"
import { HiDuplicate } from "react-icons/hi"
import { MdOutlineDragIndicator } from "react-icons/md"

import styled from "styled-components"
import "remirror/styles/theme.css"
import { useDrag } from "react-dnd"
import { DnDTypes } from "../../../DnDtypes"
import useDebaunce from "../../../app/useDebounce"
import useDocElements from "../../../app/useDocElements"
import { ExtensionPriority } from "remirror"
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
  const { activeElementId } = useAppSelector((state) => state.documents)
  const { _id, content } = textBlockObj
  const { setElementMenuId } = useContext(MenuState)
  // const [focused, setFocused] = useState(true)

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

  const { readonly } = useContext(CurrentDocContext)!

  // useEffect(() => {
  //   setFocused(false)
  // }, [])

  const { elementRef, getVerticalPosition, getLeftEdgePosition } =
    useDocElements()

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
      new PlaceholderExtension({
        placeholder: "Text block",
        priority: ExtensionPriority.High,
      }),
      new BoldExtension(),
      new ItalicExtension(),
      new UnderlineExtension(),
      new StrikeExtension(),
      new BulletListExtension(),
      new OrderedListExtension(),
      new TrailingNodeExtension(),
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

  //TOOLBAR

  const [toolbarInVisible, setToolbarIsVisible] = useState(true)
  const [leftPosition, setLeftPosition] = useState<number | undefined>(
    undefined,
  )

  const handleMouseOver = () => {
    const verticalPosition = getVerticalPosition()
    setToolbarIsVisible(verticalPosition > 0)
    setLeftPosition(getLeftEdgePosition())

    // tbRef.current!.addEventListener("mousemove", () => {
    //   const verticalPosition = getVerticalPosition()
    //   console.log({ verticalPosition })
    // })

    // tbRef.current!.addEventListener('mouseleave', () => tbRef.current!.removeEventListener('mousemove'))
  }

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
      <StyledElementToolbar
        outOfScreen={!toolbarInVisible}
        left_position={leftPosition}
      >
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
      dispatch(setActiveElementData({ id: _id, type: "paragraph" }))
    } else {
      dispatch(
        setActiveElementData({ id: [_id, ...column], type: "paragraph" }),
      )
    }
    setElementMenuId(null)
  }

  //STYLING
  const {
    parameters: {
      text_blocks: {
        font_size,
        spacing_paragraph,
        indent,
        spacing_letter,
        spacing_line,
        spacing_word,
      },
    },
  } = useAppSelector((state) => state.styling)

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
        ref={elementRef}
        $font_size={font_size}
        $spacing_p={spacing_paragraph}
        $indent={indent}
        $spacing_letter={spacing_letter}
        $spacing_line={spacing_line}
        $spacing_w={spacing_word}
        onClick={(e) => handleClick(e)}
        onMouseMove={handleMouseOver}

        // className="remirror-theme"
      >
        <Remirror
          manager={manager}
          initialContent={state}
          placeholder="Text block"
          classNames={["text-block"]}
          // hooks={hooks}
          autoFocus={true}
          onChange={(props) => {
            const { state } = props
            const docJSON: { doc: any } = state.toJSON()
            const newContent = docJSON.doc.content
            setCurrentContent(newContent)
          }}
          editable={!readonly}
        >
          <Toolbar />
          <EditorComponent />
        </Remirror>
      </StyledTextContent>
    </ThemeProvider>
  )
}

export default React.memo(TextBlockEl)

type styledProps = {
  $font_size: number
  $spacing_p: number
  $spacing_line: number
  $spacing_letter: number
  $spacing_w: number
  $indent: [boolean, number]
}

const StyledTextContent = styled.div<styledProps>`
  min-height: 1em;
  /* white-space: nowrap; */
  white-space: pre-wrap;

  .text-block {
    padding: 0;
    min-height: auto;
    max-height: fit-content;
    min-width: 48px;
    /* max-width: calc(
      var(--editor-canvas-width) - var(--editor-left-mg) -
        var(--editor-right-mg)
    ); */
    border: none;
    outline: none;
    text-align: justify;
    font-family: var(--font-2);
    font-size: ${(props) => props.$font_size}px;
    overflow: hidden;
    text-overflow: clip;
  }

  .text-block > .toolbar-section {
    font-size: var(--small-size);
  }

  .text-block p {
    min-width: 12px;
    min-height: 1em;
    margin-bottom: ${(pr) => pr.$spacing_p}px;
    text-indent: ${(pr) => (pr.$indent[0] ? pr.$indent[1] : 0)}px;
    word-spacing: ${(pr) => pr.$spacing_w}px;
    letter-spacing: ${(pr) => pr.$spacing_letter}px;
    line-height: ${(pr) => pr.$spacing_line};
  }
  .text-block li {
    margin-left: ${(props) => (props.$indent[0] ? props.$indent[1] : 32)}px;
    line-height: 1;
  }

  .text-block li p {
    text-indent: 0px;
    margin-bottom: 0px;
  }

  .text-block ul,
  .text-block ol {
    margin-bottom: ${(pr) => pr.$spacing_p}px;
  }
`
