import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from "react"
import { StyledSection } from "./StyledSection"
import {
  MdOutlineDragIndicator,
  MdOutlineNavigateBefore,
  MdOutlineNavigateNext,
} from "react-icons/md"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { rgbColour } from "../../../types"
import { ChromePicker, ColorChangeHandler } from "react-color"
import {
  setGeneralBg,
  setGeneralFontColour,
  setTheme,
} from "../../../features/styling/stylingSlice"
import ColourPicker from "./ColourPicker"
import useDebounce from "../../../app/useDebounce"
import { rgbObjToString } from "../../../functions/rgbObjToString"
import { GeneralParam } from "../../../features/styling/initialState"
import { COLORS } from "remirror/extensions"
import { StylingParamsContext } from "./StylingMenu"
import Swatches from "../Swatches"
import { CurrentThemeContext } from "../Editor"

type props = {
  collapsed: boolean
}

const StylingGeneral = ({ collapsed }: props) => {
  const dispatch = useAppDispatch()

  //Styling
  const { main, gray } = useContext(CurrentThemeContext)

  const {
    parameters: { general, activeTheme },
    themes,
  } = useAppSelector((state) => state.styling)
  const { doc_bg_colour, font_colour } = general

  const {
    general_all_params,
    general_active_param_idx,
    set_general_active_param,
    set_active_styling_section,
  } = useContext(StylingParamsContext)

  const activeParam = useMemo(
    () => general_all_params[general_active_param_idx],
    [general_active_param_idx, general_all_params],
  )

  const debauncedBgValue = useDebounce(doc_bg_colour.colour, 70)
  const debauncedFontValue = useDebounce(font_colour.colour, 70)

  useEffect(() => {
    switch (activeParam) {
      case "doc_bg_colour":
        dispatch(setGeneralBg(debauncedBgValue))
        break
      case "font_colour":
        dispatch(setGeneralFontColour(debauncedFontValue))
        break
      default:
        break
    }
  }, [debauncedBgValue, dispatch, activeParam, debauncedFontValue])

  const setNextParameter = useCallback(() => {
    if (general_active_param_idx === general_all_params.length - 1) {
      set_general_active_param(0)
    } else {
      set_general_active_param(general_active_param_idx + 1)
    }
  }, [general_active_param_idx, set_general_active_param, general_all_params])

  const setPrevParameter = useCallback(() => {
    if (general_active_param_idx === 0) {
      set_general_active_param(general_all_params.length - 1)
    } else {
      set_general_active_param(general_active_param_idx - 1)
    }
  }, [general_active_param_idx, set_general_active_param, general_all_params])

  const ParamSelector = useMemo(() => {
    return (
      <label className="flex param-selector ">
        <button onClick={setPrevParameter} className="nav-btn">
          <MdOutlineNavigateBefore />
        </button>
        <span>{general[activeParam].title}:</span>
        <button onClick={setNextParameter} className="nav-btn">
          <MdOutlineNavigateNext />
        </button>
      </label>
    )
  }, [activeParam, general, setNextParameter, setPrevParameter])

  const getActiveColour = useMemo(() => {
    return general[activeParam].colour
  }, [general, activeParam])

  const handleColourChange: ColorChangeHandler = useCallback(
    (color) => {
      if (activeParam === "font_colour") {
        dispatch(setGeneralFontColour(color.rgb))
      } else if (activeParam === "doc_bg_colour") {
        dispatch(setGeneralBg(color.rgb))
      }
    },
    [activeParam, dispatch],
  )

  const memoPicker = useMemo(() => {
    switch (activeParam) {
      case "main_colour":
        return <Swatches />
      case "doc_bg_colour":
      default:
        return (
          <ColourPicker
            colour={getActiveColour}
            changeHandler={handleColourChange}
          />
        )
    }
  }, [handleColourChange, getActiveColour, activeParam])

  return (
    <StyledSection $gray={gray} $main={main}>
      <div
        className="title"
        onClick={() => set_active_styling_section(collapsed ? "general" : null)}
      >
        <h4>General</h4>
      </div>
      {!collapsed && (
        <section className="styling-params">
          {ParamSelector}
          {memoPicker}
          <label className="param-selector">
            <span>Main colour:</span>
            <Swatches />
          </label>
        </section>
      )}
    </StyledSection>
  )
}

export default React.memo(StylingGeneral)
