import React, { useState } from "react"
import styled from "styled-components"
import { useAppDispatch } from "../../../app/hooks"
import { renameDoc } from "../../../features/documents/documentsSlice"

type props = {
  docTitle: string
  docId: number | null
}

const MainHeader = ({ docTitle }: props) => {
  const dispatch = useAppDispatch()
  const [newTitle, setNewTitle] = useState(docTitle)

  const handleChange = (e: React.ChangeEvent) => {
    const { value } = e.target! as HTMLInputElement
    setNewTitle(value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTitle.trim() !== "") {
      dispatch(renameDoc({ newTitle }))
    } else {
      setNewTitle(docTitle)
    }
  }

  return (
    <StyledDocTitle>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          value={newTitle}
          placeholder="Can't be empty"
          onChange={(e) => handleChange(e)}
        />
      </form>
    </StyledDocTitle>
  )
  // return <StyledDocTitle onClick={handleModeChange}>{newTitle}</StyledDocTitle>
}

export default MainHeader

const StyledDocTitle = styled.h1`
  margin: 24px var(--editor-left-mg);
  border-bottom: 4px solid var(--main);
  font-family: "Roboto Condensed", sans-serif;
  font-size: var(--h1-size);
  font-weight: normal;

  input {
    width: 100%;
    font-family: "Roboto Condensed", sans-serif;
    font-size: var(--h1-size);
    border: none;
  }
`
