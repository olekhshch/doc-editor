import React, { useContext } from "react"
import styled from "styled-components"
import { MenuState } from "./Editor"

const MainToolbar = () => {
  const { showLeftSb, showRightSb } = useContext(MenuState)
  return (
    <StyledMainToolbar>
      {!showRightSb && <section id="main-toolbar">Toolbar</section>}
    </StyledMainToolbar>
  )
}

export default MainToolbar

const StyledMainToolbar = styled.aside`
  width: 100%;
  height: 48px;

  #main-toolbar {
    width: 100%;
    height: 48px;
    min-width: 210mm;
    box-shadow: 0 4px 6px var(--gray);
  }
`
