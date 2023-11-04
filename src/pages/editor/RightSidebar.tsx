import React, { useEffect, useState } from "react"
import styled from "styled-components"
import SbTabs from "./SbTabs"
import { sbTabOption } from "./SbTabs"
import { screenwidth_editor } from "../../screenwidth_treshholds"

const RightSidebar = () => {
  const [sbOptions, setSbOption] = useState<[sbTabOption, sbTabOption]>([
    "Add...",
    "Style...",
  ])

  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const checkWidth = () => {
      const { innerWidth } = window
      setIsCollapsed(innerWidth < screenwidth_editor.only_one_sb)
    }
    window.addEventListener("resize", checkWidth)

    // return window.removeEventListener("resize", checkWidth)
  }, [])

  const [activeIdx, setActiveIdx] = useState<0 | 1>(0)

  // if (isCollapsed) {
  //   return <aside>TOP RIGHT SB</aside>
  // }

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

export default React.memo(RightSidebar)

const StyledRightSb = styled.aside`
  top: 0;
  right: 0;
  bottom: 0;
  /* width: 100%; */
  /* min-width: 154px; */
  flex-grow: 1;
  flex-basis: 200px;

  .sb-inner {
    position: fixed;
    top: 32px;
    right: 12px;
  }

  /* @media (max-width: ${screenwidth_editor.only_one_sb}px) {
    left: 100px;
    bottom: auto;
    background-color: gray;
  } */
  /* border-left: 1px solid red; */
`
const StyledTopBar = styled
