import React, { useContext, useMemo } from "react"
import styled from "styled-components"
import { useAppSelector } from "../../app/hooks"
import MainTitle from "./canvasElements/MainTitle"
import Elements from "./canvasElements/Elements"
import { CurrentDocContext } from "./Editor"

const ContentCanvas = () => {
  const { beginsWithTitle, activeDocumentId } = useAppSelector(
    (state) => state.documents,
  )

  const docContext = useContext(CurrentDocContext)

  if (!docContext) {
    return <></>
  }

  const { title, _id } = docContext

  return (
    <StyledContentContainer>
      {beginsWithTitle && <MainTitle docId={_id} docTitle={title} />}
      <Elements />
    </StyledContentContainer>
  )
  // return (
  //   <StyledContentContainer>
  //     {beginsWithTitle && (
  //       <MainHeader docTitle={title} docId={activeDocumentId} />
  //     )}
  //     <Elements />
  //   </StyledContentContainer>
  // )
}

export default ContentCanvas

const StyledContentContainer = styled.main`
  margin: auto;
  /* flex-basis: 297mm; */
  min-width: 297mm;
  width: 297mm;
  min-height: 100vh;

  /* border: 1px solid blue; */
`