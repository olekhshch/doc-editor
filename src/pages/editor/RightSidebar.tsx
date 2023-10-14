import React, { useState } from "react"
import styled from "styled-components"
import SbTabs from "./SbTabs"
import { sbTabOption } from "./SbTabs"

const RightSidebar = () => {
  const [sbOptions, setSbOption] = useState<[sbTabOption, sbTabOption]>([
    "Add...",
    "Style...",
  ])

  const [activeIdx, setActiveIdx] = useState<0 | 1>(0)
  return (
    <StyledRightSb className="editor-sb">
      <SbTabs
        options={sbOptions}
        activeIdx={activeIdx}
        setActiveIdx={setActiveIdx}
      />
    </StyledRightSb>
  )
}

export default RightSidebar

const StyledRightSb = styled.aside`
  top: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  /* flex-basis: 200px; */

  border-left: 1px solid red;
`
