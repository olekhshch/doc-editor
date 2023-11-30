import React, { useEffect, useState } from "react"
import styled from "styled-components"
import SbTabs from "./SbTabs"
import { sbTabOption } from "./SbTabs"
import { screenwidth_editor } from "../../screenwidth_treshholds"
import { useAppSelector } from "../../app/hooks"

const RightSidebar = () => {
  const [sbOptions, setSbOption] = useState<[sbTabOption, sbTabOption]>([
    "Add...",
    "Style...",
  ])

  const [isCollapsed, setIsCollapsed] = useState(false)
  const { canvas_width } = useAppSelector((state) => state.styling.parameters)

  useEffect(() => {
    const checkWidth = () => {
      const { innerWidth } = window
      setIsCollapsed(innerWidth < screenwidth_editor.only_one_sb)
    }
    window.addEventListener("resize", checkWidth)

    // return window.removeEventListener("resize", checkWidth)
  }, [])

  const [activeIdx, setActiveIdx] = useState<0 | 1>(0)
  //#TODO: add shortcuts

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

export default React.memo(RightSidebar)

const StyledRightSb = styled.aside`
  top: 0;
  right: 0;
  bottom: 0;
  position: fixed;
  max-width: 220px;
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
