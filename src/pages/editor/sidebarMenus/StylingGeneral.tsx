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
  setColumnsElementsGap,
  setGeneralBg,
  setGeneralFontColour,
  setMaxCanvasWidth,
  setTheme,
} from "../../../features/styling/stylingSlice"
import ColourPicker from "./ColourPicker"
import useDebounce from "../../../app/useDebounce"
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
    parameters: { general, activeTheme, columns, canvas_width },
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

  //COLUMNS GAP

  const [columnsGap, setColumnsGap] = useState(columns.gap)

  const debouncedGap = useDebounce(columnsGap, 40)

  useEffect(() => {
    dispatch(setColumnsElementsGap(debouncedGap))
  }, [debouncedGap, dispatch])

  const handleColumnsGapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target!
    const numValue = parseInt(value)

    setColumnsGap(numValue)
  }

  //MAX CANVAS WIDTH
  const [canvasWidth, setCanvasWidth] = useState(canvas_width)

  const debouncedCanvasWidth = useDebounce(canvasWidth, 40)

  useEffect(() => {
    dispatch(setMaxCanvasWidth(debouncedCanvasWidth))
  }, [debouncedCanvasWidth, dispatch])

  const handleCanvasWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target!
    const numValue = parseInt(value)

    setCanvasWidth(numValue)
  }

  return (
    <StyledSection $gray={gray} $main={main}>
      <div
        className="title"
        onClick={() => set_active_styling_section(collapsed ? "general" : null)}
      >
        <h3>General</h3>
      </div>
      {!collapsed && (
        <section className="styling-params">
          <label className="param-selector">
            <span>Max canvas width ({canvasWidth}):</span>
            <input
              className="range-input"
              type="range"
              value={canvasWidth}
              min={760}
              max={990}
              onChange={handleCanvasWidthChange}
            />
          </label>
          {ParamSelector}
          {memoPicker}
          <label className="param-selector">
            <span>Main colour:</span>
            <Swatches />
          </label>
          <label className="param-selector">
            <span>Columns gap ({columnsGap}):</span>
            <input
              className="range-input"
              type="range"
              value={columnsGap}
              min={2}
              max={12}
              onChange={handleColumnsGapChange}
            />
          </label>
        </section>
      )}
    </StyledSection>
  )
}

export default React.memo(StylingGeneral)
