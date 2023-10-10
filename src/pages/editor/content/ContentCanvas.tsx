import React, { useContext } from "react"
import styled from "styled-components"
import { useAppSelector } from "../../../app/hooks"
import MainHeader from "./MainHeader"
import { CurrentDocContext } from "../Editor"

const ContentCanvas = () => {
  const { begginsWithTitle } = useAppSelector((state) => state.documents)
  const { title } = useContext(CurrentDocContext)!

  return (
    <StyledContentContainer>
      {begginsWithTitle && <MainHeader docTitle={title} />}
    </StyledContentContainer>
  )
}

export default ContentCanvas

const StyledContentContainer = styled.main`
  flex-basis: 297mm;
  min-width: 297mm;
  min-height: 100vh;
  border-left: 1px solid var(--black);
  border-right: 1px solid var(--black);
`
