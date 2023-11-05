import React, { useContext } from "react"
import { StyledSection } from "./StyledSection"
import { MdOutlineDragIndicator } from "react-icons/md"
import { CurrentThemeContext } from "../Editor"

type props = {
  collapsed: boolean
}

const StylingTextBlocks = ({ collapsed }: props) => {
  //Styling
  const { main, gray } = useContext(CurrentThemeContext)

  return (
    <StyledSection $gray={gray} $main={main}>
      <div className="title">
        <div className="dnd-handle">
          <MdOutlineDragIndicator />
        </div>
        <h4>Text blocks</h4>
      </div>
    </StyledSection>
  )
}

export default StylingTextBlocks