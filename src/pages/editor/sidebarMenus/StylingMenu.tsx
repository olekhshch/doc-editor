import React, { useContext, createContext, useState } from "react"
import { useAppSelector } from "../../../app/hooks"
import StylingGeneral from "./StylingGeneral"
import styled from "styled-components"
import { StyledSection } from "./StyledSection"
import StylingHeadings from "./StylingHeadings"
import StylingTextBlocks from "./StylingTextBlocks"
import StylingMainTitle from "./StylingMainTitle"
import {
  GeneralParam,
  stylingOption,
} from "../../../features/styling/initialState"
import { IconContext } from "react-icons"
import { CurrentThemeContext } from "../Editor"
import StylingManager from "./StylingManager"

interface stylingContext {
  active_styling_section: stylingOption | null
  set_active_styling_section: (st: stylingOption | null) => void
  general_all_params: GeneralParam[]
  general_active_param_idx: number
  set_general_active_param: (i: number) => void
}

const general_all_params: GeneralParam[] = ["doc_bg_colour", "font_colour"]

export const StylingParamsContext = createContext<stylingContext>({
  active_styling_section: "general",
  set_active_styling_section: (st) => {},
  general_all_params: ["doc_bg_colour", "font_colour", "main_colour"],
  general_active_param_idx: 0,
  set_general_active_param: (idx) => {},
})

const StylingMenu = () => {
  const { main, gray } = useContext(CurrentThemeContext)
  const [active_styling_section, set_active_styling_section] =
    useState<stylingOption | null>("general")
  const [generalParamIdx, setGeneralParamIdx] = useState<number>(0)

  const defaultContextValue: stylingContext = {
    active_styling_section,
    set_active_styling_section,
    general_all_params,
    general_active_param_idx: generalParamIdx,
    set_general_active_param: setGeneralParamIdx,
  }

  //THEME

  return (
    <IconContext.Provider value={{ color: main, size: "20" }}>
      <StyledList $main={main} $gray={gray}>
        <StylingParamsContext.Provider value={defaultContextValue}>
          <StylingGeneral collapsed={active_styling_section !== "general"} />
          <StylingMainTitle
            collapsed={active_styling_section !== "main_title"}
          />
          <StylingHeadings collapsed={active_styling_section !== "headings"} />
          <StylingTextBlocks
            collapsed={active_styling_section !== "text_blocks"}
          />
          <StylingManager />
        </StylingParamsContext.Provider>
      </StyledList>
    </IconContext.Provider>
  )
}

export default StylingMenu

type styledProps = {
  $gray: string
  $main: string
}

const StyledList = styled.ul<styledProps>`
  list-style: none;

  .btn {
    margin: 4px;
    padding: 2px 6px;
    background-color: transparent;
    border: 1px solid ${(pr) => pr.$gray};
    border-radius: 4px;
  }

  .btn:hover {
    color: white;
    background-color: ${(pr) => pr.$main};
  }

  /* .dnd-placeholder {
    height: 2px;
    width: 100%;
    background-color: transparent;
  } */
`
