import React, { useContext, useState, useEffect } from "react"
import { StyledSection } from "./StyledSection"
import { MdOutlineDragIndicator } from "react-icons/md"
import { CurrentThemeContext } from "../Editor"
import { StylingParamsContext } from "./StylingMenu"
import { constantValues } from "../../../constants"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import useDebounce from "../../../app/useDebounce"
import {
  setTextBlockIndent,
  setTextBlockSpacings,
  setTextBlocksFontSize,
} from "../../../features/styling/stylingSlice"

type props = {
  collapsed: boolean
}

const StylingTextBlocks = ({ collapsed }: props) => {
  const dispatch = useAppDispatch()
  const { font_size_presets } = constantValues
  const { set_active_styling_section } = useContext(StylingParamsContext)
  const {
    text_blocks: {
      font_size,
      spacing_paragraph,
      indent,
      spacing_letter,
      spacing_line,
      spacing_word,
    },
  } = useAppSelector((state) => state.styling)

  const [fontSize, setFontSize] = useState<string | number>(font_size)
  const [spacingP, setSpacingP] = useState(spacing_paragraph)
  const [spacingLine, setSpacingLine] = useState(spacing_line)
  const [spacingLetter, setSpacingLetter] = useState(spacing_letter)
  const [spacingW, setSpacingW] = useState(spacing_word)
  const [indentValue, setIndentValue] = useState(indent[1])

  const debouncedFontSize = useDebounce(fontSize, 300)
  const debouncedParagraphSpacing = useDebounce(spacingP, 16)
  const debouncedLineSpacing = useDebounce(spacingLine, 16)
  const debouncedLetterSpacing = useDebounce(spacingLetter, 16)
  const debouncedWordSpacing = useDebounce(spacingW, 16)
  const debouncedIndentValue = useDebounce(indentValue, 16)

  useEffect(() => {
    dispatch(setTextBlockIndent([indent[0], debouncedIndentValue]))
  }, [debouncedIndentValue, dispatch, indent[0]])

  useEffect(() => {
    const sizeNum = parseInt(debouncedFontSize.toString(), 10)
    if (!Number.isNaN(sizeNum)) {
      dispatch(setTextBlocksFontSize(sizeNum))
    }
  }, [debouncedFontSize, dispatch])

  useEffect(() => {
    dispatch(
      setTextBlockSpacings({
        spacing_paragraph: debouncedParagraphSpacing,
        spacing_letter: debouncedLetterSpacing,
        spacing_line: debouncedLineSpacing,
        spacing_word: debouncedWordSpacing,
      }),
    )
  }, [
    debouncedLetterSpacing,
    debouncedLineSpacing,
    debouncedParagraphSpacing,
    debouncedWordSpacing,
    dispatch,
  ])

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target!
    setFontSize(value)
  }

  const handleRangeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    spacingParam: "paragraph" | "line" | "letter" | "word" | "indent",
  ) => {
    const { value } = e.target!
    const numValue = parseFloat(value)
    if (!Number.isNaN(numValue)) {
      switch (spacingParam) {
        case "paragraph":
          setSpacingP(numValue)
          break
        case "letter":
          setSpacingLetter(numValue)
          break
        case "line":
          setSpacingLine(numValue)
          break
        case "word":
          setSpacingW(numValue)
          break
        case "indent":
          setIndentValue(numValue)
          break
        default:
          break
      }
    }
  }

  //Styling
  const { main, gray } = useContext(CurrentThemeContext)

  return (
    <StyledSection $gray={gray} $main={main}>
      <div
        className="title"
        onClick={() =>
          set_active_styling_section(collapsed ? "text_blocks" : null)
        }
      >
        <h4>Text blocks</h4>
      </div>
      {!collapsed && (
        <section className="styling-params">
          <form>
            <label className="param-selector flex">
              <span>Size: </span>
              <input
                className="font-size-input"
                type="number"
                value={fontSize}
                onChange={handleFontSizeChange}
              />
            </label>
            <label className="param-selector flex">
              <input
                type="checkbox"
                checked={indent[0]}
                onChange={() =>
                  dispatch(setTextBlockIndent([!indent[0], indentValue]))
                }
              />
              <span>Indent ({indentValue}): </span>
              <input
                className="range-input"
                type="range"
                value={indentValue}
                disabled={!indent[0]}
                min={0}
                max={52}
                onChange={(e) => handleRangeChange(e, "indent")}
              />
            </label>
            <p>Spacings: </p>
            <label className="param-selector flex">
              <span>Paragraph ({spacingP}): </span>
              <input
                className="range-input"
                type="range"
                value={spacingP}
                min={0}
                max={24}
                onChange={(e) => handleRangeChange(e, "paragraph")}
              />
            </label>
            <label className="param-selector flex">
              <span>Line ({spacingLine}): </span>
              <input
                className="range-input"
                type="range"
                value={spacingLine}
                min={0.5}
                step={0.25}
                max={2}
                onChange={(e) => handleRangeChange(e, "line")}
              />
            </label>
            <label className="param-selector flex">
              <span>Word ({spacingW}): </span>
              <input
                className="range-input"
                type="range"
                value={spacingW}
                min={0}
                max={10}
                onChange={(e) => handleRangeChange(e, "word")}
              />
            </label>
            <label className="param-selector flex">
              <span>Letter ({spacingLetter}): </span>
              <input
                className="range-input"
                type="range"
                value={spacingLetter}
                min={0}
                max={6}
                onChange={(e) => handleRangeChange(e, "letter")}
              />
            </label>
          </form>
        </section>
      )}
    </StyledSection>
  )
}

export default StylingTextBlocks
