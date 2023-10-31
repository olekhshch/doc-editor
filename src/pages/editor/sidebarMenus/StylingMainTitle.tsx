import React from "react"
import { StyledSection } from "./StyledSection"
import { MdOutlineDragIndicator } from "react-icons/md"

type props = {
  collapsed: boolean
}
const StylingMainTitle = ({ collapsed }: props) => {
  return (
    <StyledSection>
      <div className="title">
        <div className="dnd-handle">
          <MdOutlineDragIndicator />
        </div>
        <h4>Doc title</h4>
      </div>
    </StyledSection>
  )
}

export default StylingMainTitle
