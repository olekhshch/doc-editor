import React from "react"
import { DocumentFull } from "../../features/documents/initialState"
import styled from "styled-components"

type props = { docs: DocumentFull[] }
const DocumentsList = ({ docs }: props) => {
  return <StyledList>Docs</StyledList>
}

export default DocumentsList

const StyledList = styled.ul`
  padding: 8px 4px;
  min-width: 400px;
  background-color: var(--main);
  border-radius: 12px;
`
