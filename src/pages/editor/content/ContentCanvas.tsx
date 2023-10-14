import React, { useContext } from "react"
import styled from "styled-components"
import { useAppSelector } from "../../../app/hooks"
import MainHeader from "./MainHeader"
import { CurrentDocContext } from "../Editor"
import ContentElements from "./ContentElements"

const ContentCanvas = () => {
  const { beginsWithTitle, activeDocumentId } = useAppSelector(
    (state) => state.documents,
  )
  const { title } = useContext(CurrentDocContext)!

  return (
    <StyledContentContainer>
      {beginsWithTitle && (
        <MainHeader docTitle={title} docId={activeDocumentId} />
      )}
      <ContentElements />
    </StyledContentContainer>
  )
}

export default ContentCanvas

const StyledContentContainer = styled.main`
  margin: auto;
  /* flex-basis: 297mm; */
  min-width: 297mm;
  width: 297mm;
  min-height: 100vh;

  border: 1px solid blue;
`
