import React, { FormEvent, useContext, useState } from "react"
import styled from "styled-components"
import WindowContext from "./WindowsContext"
import { useAppDispatch } from "../../../app/hooks"
import { renameDoc } from "../../../features/documents/documentsSlice"

const RenameDocWindow = () => {
  const dispatch = useAppDispatch()
  const { renameDocTitle, renameDocId, setIsopen } = useContext(WindowContext)

  const [newTitle, setNewTitle] = useState(renameDocTitle)

  const handleChange = (e: React.ChangeEvent) => {
    const { value } = e.target as HTMLInputElement
    setNewTitle(value)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    try {
      if (newTitle.trim() !== "") {
        dispatch(renameDoc({ docId: renameDocId!, newTitle }))
        setIsopen(false)
      } else {
        setNewTitle(renameDocTitle)
      }
    } catch (error) {
      console.log({ renameDocError: error })
      alert("Smth went wrong: Couldn't rename doc")
    }
  }

  return (
    <StyledForm onSubmit={(e) => handleSubmit(e)}>
      <input
        placeholder="Can't be empty"
        value={newTitle}
        onChange={(e) => handleChange(e)}
      />
      <input type="submit" value="OK" />
    </StyledForm>
  )
}

export default RenameDocWindow

const StyledForm = styled.form`
  width: var(--rename-doc-width);
  display: flex;
  gap: 4px;

  input {
    width: var(--rename-doc-width);
  }
`
