import React from "react"
import { useAppSelector } from "../../../app/hooks"
import StylingGeneral from "./StylingGeneral"
import styled from "styled-components"
import { StyledSection } from "./StyledSection"
import StylingHeadings from "./StylingHeadings"
import StylingTextBlocks from "./StylingTextBlocks"
import StylingMainTitle from "./StylingMainTitle"

const StylingMenu = () => {
  const { stylingOptions } = useAppSelector((state) => state.styling)
  return (
    <StyledList>
      {stylingOptions.map((section, idx) => {
        const { option, collapsed } = section

        const getMenu = () => {
          switch (option) {
            case "general":
              return <StylingGeneral collapsed={collapsed} />
            case "headings":
              return <StylingHeadings collapsed={collapsed} />

            case "text_blocks":
              return <StylingTextBlocks collapsed={collapsed} />
            case "main_title":
              return <StylingMainTitle collapsed={collapsed} />
            default:
              return <StyledSection>{option}</StyledSection>
          }
        }

        return (
          <li key={option}>
            <DnDStylingPlaceholder />
            {getMenu()}
          </li>
        )
      })}
    </StyledList>
  )
}

const DnDStylingPlaceholder = () => {
  return <div className="dnd-placeholder"></div>
}

export default StylingMenu

const StyledList = styled.ul`
  list-style: none;

  .dnd-placeholder {
    height: 2px;
    width: 100%;
    background-color: transparent;
  }
`
