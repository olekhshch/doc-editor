import React, { useContext, useState, useEffect } from "react"
import { StyledSection } from "./StyledSection"
import { MdOutlineDragIndicator } from "react-icons/md"
import { CurrentThemeContext } from "../Editor"
import { StylingParamsContext } from "./StylingMenu"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { FaAlignCenter, FaAlignLeft, FaAlignRight } from "react-icons/fa"
import { IconContext } from "react-icons"
import {
  setHeadingsAlignment,
  setHeadingsFontSize,
} from "../../../features/styling/stylingSlice"
import useDebounce from "../../../app/useDebounce"
import { IoIosArrowDown } from "react-icons/io"

type props = {
  collapsed: boolean
}

const StylingHeadings = ({ collapsed }: props) => {
  const { set_active_styling_section } = useContext(StylingParamsContext)

  const [selectedHeadings, setSelectedHeadings] = useState<(1 | 2 | 3)[]>([2])

  const selectHeading = (level: 1 | 2 | 3) => {
    const newSelected = [...selectedHeadings, level]
    setSelectedHeadings(newSelected)
  }

  const diselectHeading = (level: 1 | 2 | 3) => {
    const newSelected = selectedHeadings.filter((l) => l !== level)
    setSelectedHeadings(newSelected)
  }

  const handleSelectionChange = (e: React.ChangeEvent, level: 1 | 2 | 3) => {
    selectedHeadings.includes(level)
      ? diselectHeading(level)
      : selectHeading(level)
  }

  //Styling
  const { main, gray } = useContext(CurrentThemeContext)

  return (
    <StyledSection $gray={gray} $main={main}>
      <div
        className="title"
        onClick={() =>
          set_active_styling_section(collapsed ? "headings" : null)
        }
      >
        <h3>Headings</h3>
        <IconContext.Provider
          value={{ style: { rotate: collapsed ? "-90deg" : "0deg" } }}
        >
          <IoIosArrowDown />
        </IconContext.Provider>
      </div>
      {!collapsed && (
        <section className="styling-params">
          <div className="flex" style={{ justifyContent: "space-between" }}>
            <label>
              <input
                type="checkbox"
                checked={selectedHeadings.includes(1)}
                onChange={(e) => handleSelectionChange(e, 1)}
              />{" "}
              <span>H1</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={selectedHeadings.includes(2)}
                onChange={(e) => handleSelectionChange(e, 2)}
              />{" "}
              <span>H2</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={selectedHeadings.includes(3)}
                onChange={(e) => handleSelectionChange(e, 3)}
              />{" "}
              <span>H3</span>
            </label>
          </div>
          <Panel selectedHeadings={selectedHeadings} />
        </section>
      )}
    </StyledSection>
  )
}

export default StylingHeadings

type panelProps = { selectedHeadings: (1 | 2 | 3)[] }

const Panel = ({ selectedHeadings }: panelProps) => {
  const dispatch = useAppDispatch()
  const { headings } = useAppSelector((state) => state.styling.parameters)
  const { main } = useContext(CurrentThemeContext)
  const [mutualAlign, setMutualAlign] = useState<
    "left" | "right" | "center" | null
  >(null)
  const [mutualFontSize, setMutualFontSize] = useState<number | null>(null)

  const debounedFontSize = useDebounce(mutualFontSize, 500)

  const handleAlignChange = (alignment: "left" | "center" | "right") => {
    dispatch(
      setHeadingsAlignment({ align: alignment, levels: selectedHeadings }),
    )
  }

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target!

    const valueNum = parseInt(value, 10)
    if (!Number.isNaN(valueNum)) {
      setMutualFontSize(valueNum)
    }
  }

  useEffect(() => {
    if (debounedFontSize !== null) {
      dispatch(
        setHeadingsFontSize({
          font_size: debounedFontSize,
          levels: selectedHeadings,
        }),
      )
    }
  }, [debounedFontSize])

  useEffect(() => {
    let currentAlign: any = mutualAlign
    let currentFontSize: number | null = mutualFontSize
    selectedHeadings.forEach((level, idx) => {
      const { align, font_size } = headings[level]
      if (idx === 0) {
        setMutualAlign(align)
        setMutualFontSize(font_size)
        currentAlign = align
      } else {
        if (align !== currentAlign) {
          setMutualAlign(null)
        }
        if (font_size !== currentFontSize) {
          setMutualFontSize(null)
        }
      }
    })
  }, [selectedHeadings, headings])

  if (selectedHeadings.length === 0) {
    return <span>Select min. 1 heading level</span>
  }

  return (
    <div className="flex-col">
      <label className="param-selector">
        <span>Align: </span>
        <button
          title="Left"
          className={
            mutualAlign === "left" ? "styling-btn active" : "styling-btn"
          }
          onClick={() => handleAlignChange("left")}
        >
          <IconContext.Provider
            value={{
              style: { color: mutualAlign === "left" ? "white" : main },
            }}
          >
            <FaAlignLeft />
          </IconContext.Provider>
        </button>
        <button
          className={
            mutualAlign === "center" ? "styling-btn active" : "styling-btn"
          }
          title="Center"
          onClick={() => handleAlignChange("center")}
        >
          <IconContext.Provider
            value={{
              style: { color: mutualAlign === "center" ? "white" : main },
            }}
          >
            <FaAlignCenter />
          </IconContext.Provider>
        </button>
        <button
          className={
            mutualAlign === "right" ? "styling-btn active" : "styling-btn"
          }
          title="Right"
          onClick={() => handleAlignChange("right")}
        >
          <IconContext.Provider
            value={{
              style: { color: mutualAlign === "right" ? "white" : main },
            }}
          >
            <FaAlignRight />
          </IconContext.Provider>
        </button>
      </label>
      <label className="param-selector flex" style={{ gap: "8px" }}>
        Font size:
        <input
          type="number"
          value={mutualFontSize ?? ""}
          className="font-size-input"
          onChange={(e) => handleFontSizeChange(e)}
        />
      </label>
    </div>
  )
}
