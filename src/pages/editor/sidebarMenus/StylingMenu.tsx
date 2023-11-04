import React, { useContext, createContext, useState } from "react"
import { useAppSelector } from "../../../app/hooks"
import StylingGeneral from "./StylingGeneral"
import styled from "styled-components"
import { StyledSection } from "./StyledSection"
import StylingHeadings from "./StylingHeadings"
import StylingTextBlocks from "./StylingTextBlocks"
import StylingMainTitle from "./StylingMainTitle"
import { GeneralParam } from "../../../features/styling/initialState"
import { IconContext } from "react-icons"
import { CurrentThemeContext } from "../Editor"

interface stylingContext {
  general_all_params: GeneralParam[]
  general_active_param_idx: number
  set_general_active_param: (i: number) => void
}

const general_all_params: GeneralParam[] = ["doc_bg_colour", "font_colour"]

export const StylingParamsContext = createContext<stylingContext>({
  general_all_params: ["doc_bg_colour", "font_colour", "main_colour"],
  general_active_param_idx: 0,
  set_general_active_param: (idx) => {},
})

const StylingMenu = () => {
  const { main } = useContext(CurrentThemeContext)
  const [generalParamIdx, setGeneralParamIdx] = useState<number>(0)

  const defaultContextValue: stylingContext = {
    general_all_params,
    general_active_param_idx: generalParamIdx,
    set_general_active_param: setGeneralParamIdx,
  }

  return (
    <IconContext.Provider value={{ color: main, size: "20" }}>
      <StyledList>
        <StylingParamsContext.Provider value={defaultContextValue}>
          <StylingGeneral collapsed={false} />
          <StylingMainTitle collapsed={true} />
          <StylingHeadings collapsed={true} />
          <StylingTextBlocks collapsed={true} />
        </StylingParamsContext.Provider>
      </StyledList>
    </IconContext.Provider>
  )
}

const DnDStylingPlaceholder = () => {
  return <div className="dnd-placeholder"></div>
}

export default StylingMenu

const StyledList = styled.ul`
  list-style: none;

  /* .dnd-placeholder {
    height: 2px;
    width: 100%;
    background-color: transparent;
  } */
`
