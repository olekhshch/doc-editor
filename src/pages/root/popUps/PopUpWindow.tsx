import React from "react"
import WindowContext from "./WindowsContext"
import RenameDocWindow from "./RenameDocWindow"
import styled from "styled-components"

const PopUpWindow = () => {
  const {
    windowType,
    windowCoordinates: { top, left },
  } = React.useContext(WindowContext)

  const Content = () => {
    if (windowType === "rename-doc") {
      return <RenameDocWindow />
    }
  }

  return (
    <StyledPopUp style={{ top, left }}>
      <Content />
    </StyledPopUp>
  )
}

export default PopUpWindow

const StyledPopUp = styled.div`
  padding: 4px;
  position: fixed;
  background: var(--white);
  color: var(--main-darker);
`
