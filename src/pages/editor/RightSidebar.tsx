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
      <div className="sb-inner">
        <SbTabs
          options={sbOptions}
          activeIdx={activeIdx}
          setActiveIdx={setActiveIdx}
        />
      </div>
    </StyledRightSb>
  )
}

export default RightSidebar

const StyledRightSb = styled.aside`
  top: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  flex-grow: 1;
  flex-basis: 300px;
  min-width: 154px;

  .sb-inner {
    position: fixed;
    top: 32px;
  }

  /* border-left: 1px solid red; */
`
