import React, { useContext, useEffect, useState } from "react"
import { StyledSection } from "./StyledSection"
import { MdOutlineDragIndicator } from "react-icons/md"
import { CurrentThemeContext } from "../Editor"
import { StylingParamsContext } from "./StylingMenu"
import { ChromePicker, ColorChangeHandler } from "react-color"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  setMainTitleFontSize,
  setMainTitleMargins,
  setMainTitleTextColour,
  toggleTitleUnderline,
} from "../../../features/styling/stylingSlice"
import useDebounce from "../../../app/useDebounce"
import { IoIosArrowDown } from "react-icons/io"
import { IconContext } from "react-icons"

type props = {
  collapsed: boolean
}

const StylingMainTitle = ({ collapsed }: props) => {
  const dispatch = useAppDispatch()
  //options state
  const { set_active_styling_section } = useContext(StylingParamsContext)

  //Styling (theme and parameters)
  const { main, gray } = useContext(CurrentThemeContext)
  const {
    main_title: {
      underlined,
      text_colour,
      font_size,
      margin_bottom,
      margin_top,
    },
  } = useAppSelector((state) => state.styling.parameters)

  const [fontSize, setFontSize] = useState<string | number>(font_size)
  const [marginBtm, setMarginBtm] = useState<number>(margin_bottom)
  const [marginTop, setMarginTop] = useState(margin_top)

  const debouncedSize = useDebounce(fontSize, 300)
  const debouncedBtmMrg = useDebounce(marginBtm, 16)
  const debouncedTopMrg = useDebounce(marginTop, 16)

  useEffect(() => {
    const sizeNum = parseInt(debouncedSize.toString(), 10)
    if (!Number.isNaN(sizeNum)) {
      dispatch(setMainTitleFontSize(sizeNum))
    }
  }, [debouncedSize, dispatch])

  useEffect(() => {
    if (margin_bottom !== debouncedBtmMrg) {
      dispatch(setMainTitleMargins({ margin_bottom: debouncedBtmMrg }))
    }

    if (margin_top !== debouncedTopMrg) {
      dispatch(setMainTitleMargins({ margin_top: debouncedTopMrg }))
    }
  }, [dispatch, debouncedBtmMrg, margin_bottom, margin_top, debouncedTopMrg])

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target!
    setFontSize(value)
  }

  const handleMarginChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    p: "top" | "bottom",
  ) => {
    const { value } = e.target!
    const numValue = parseInt(value, 10)

    if (!Number.isNaN(numValue)) {
      switch (p) {
        case "bottom":
          setMarginBtm(numValue)
          break
        case "top":
          setMarginTop(numValue)
          break
      }
    }
  }

  const handleCustomizeColourClick = () => {
    if (text_colour) {
      dispatch(setMainTitleTextColour())
    } else {
      dispatch(setMainTitleTextColour({ r: 10, g: 10, b: 10 }))
    }
  }

  const handleColourChange: ColorChangeHandler = (colour) => {
    dispatch(setMainTitleTextColour(colour.rgb))
  }

  return (
    <StyledSection $gray={gray} $main={main}>
      <div
        className="title"
        onClick={() =>
          set_active_styling_section(collapsed ? "main_title" : null)
        }
      >
        <h3>Doc title</h3>
        <IconContext.Provider
          value={{ style: { rotate: collapsed ? "-90deg" : "0deg" } }}
        >
          <IoIosArrowDown />
        </IconContext.Provider>
      </div>
      {!collapsed && (
        <section className="styling-params">
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
            <span>Top margin ({marginTop}): </span>
            <input
              className="range-input"
              type="range"
              value={marginTop}
              min={0}
              max={60}
              onChange={(e) => handleMarginChange(e, "top")}
            />
          </label>
          <label className="param-selector flex">
            <span>Bottom margin ({marginBtm}): </span>
            <input
              className="range-input"
              type="range"
              value={marginBtm}
              min={0}
              max={60}
              onChange={(e) => handleMarginChange(e, "bottom")}
            />
          </label>
          <label className="param-selector">
            <input
              type="checkbox"
              checked={underlined}
              onChange={() => dispatch(toggleTitleUnderline())}
            />
            <span style={{ textDecoration: underlined ? "underline" : "none" }}>
              Underlined{" "}
            </span>
          </label>
          <label className="param-selector">
            <input
              type="checkbox"
              checked={text_colour !== undefined}
              onChange={handleCustomizeColourClick}
            />
            <span>Set different colour</span>
          </label>
          {text_colour && (
            <ChromePicker
              color={text_colour}
              disableAlpha={true}
              onChange={handleColourChange}
            />
          )}
        </section>
      )}
    </StyledSection>
  )
}

export default StylingMainTitle
