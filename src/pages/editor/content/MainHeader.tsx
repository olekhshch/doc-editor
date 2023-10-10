import React, { useState } from "react"
import styled from "styled-components"

type props = {
  docTitle: string
}

const MainHeader = ({ docTitle }: props) => {
  const [newTitle, setNewTitle] = useState(docTitle)
  const [editMode, setEditMode] = useState(false)

  const handleModeChange = () => {
    setEditMode(!editMode)
  }

  const handleChange = () => {
    //handle doc title change when in edit mode
  }

  if (editMode) {
    return (
      <StyledDocTitle>
        <form>
          <input value={newTitle} placeholder="Can't be empty" />
        </form>
      </StyledDocTitle>
    )
  }
  return (
    <StyledDocTitle>
      <h1 onClick={handleModeChange}>{newTitle}</h1>
    </StyledDocTitle>
  )
}

export default MainHeader

const StyledDocTitle = styled.h1`
  margin: 24px 96px;

  h1,
  input {
    font-size: var(--h1-size);
    border: none;
  }
`
