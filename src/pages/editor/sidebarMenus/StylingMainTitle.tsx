import React, { useContext } from "react"
import { StyledSection } from "./StyledSection"
import { MdOutlineDragIndicator } from "react-icons/md"
import { CurrentThemeContext } from "../Editor"
import { StylingParamsContext } from "./StylingMenu"
import { ChromePicker, ColorChangeHandler } from "react-color"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  setMainTitleTextColour,
  toggleTitleUnderline,
} from "../../../features/styling/stylingSlice"

type props = {
  collapsed: boolean
}
const StylingMainTitle = ({ collapsed }: props) => {
  const dispatch = useAppDispatch()
  //options state
  const { set_active_styling_section } = useContext(StylingParamsContext)
  //Styling
  const { main, gray } = useContext(CurrentThemeContext)
  const {
    main_title: { underlined, text_colour },
  } = useAppSelector((state) => state.styling)

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
        <h4>Doc title</h4>
      </div>
      {!collapsed && (
        <section className="styling-params">
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
