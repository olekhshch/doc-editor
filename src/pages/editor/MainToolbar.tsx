import React, { useContext } from "react"
import styled from "styled-components"
import { CurrentThemeContext, MenuState } from "./Editor"

const MainToolbar = () => {
  const { showLeftSb, showRightSb } = useContext(MenuState)
  const { gray } = useContext(CurrentThemeContext)
  return (
    <StyledMainToolbar>
      {!showRightSb && (
        <section id="main-toolbar" style={{ boxShadow: `0 4px 6px ${gray}` }}>
          Toolbar
        </section>
      )}
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
  }
`
