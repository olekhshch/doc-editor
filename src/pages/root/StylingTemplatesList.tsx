import React, { useState } from "react"
import { StylingTemplate } from "../../features/styling/initialState"
import styled from "styled-components"
import { useAppDispatch } from "../../app/hooks"
import {
  deleteStylingTemplate,
  renameStylingTemplate,
  setStylingFromTemplate,
} from "../../features/styling/stylingSlice"
import { TiDelete } from "react-icons/ti"
import { AiFillEdit } from "react-icons/ai"
import { IconContext } from "react-icons"
import usePersist from "../../app/usePersist"
import useDebounce from "../../app/useDebounce"

type props = {
  templates: StylingTemplate[]
}
const StylingTemplatesList = ({ templates }: props) => {
  return (
    <IconContext.Provider value={{ className: "icon-btn" }}>
      <StyledTemplates>
        {templates.map((template) => {
          return <ListItem key={template._id} template={template} />
        })}
      </StyledTemplates>
    </IconContext.Provider>
  )
}

type itemProps = {
  template: StylingTemplate
}
const ListItem = ({ template }: itemProps) => {
  const dispatch = useAppDispatch()
  const { _id, name } = template

  const [nameDraft, setNameDraft] = useState(name)
  const [editMode, setEditMode] = useState(false)

  const toggleEditMode = (e: React.MouseEvent) => {
    e.stopPropagation()

    setEditMode(!editMode)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (nameDraft.trim() !== "") {
      dispatch(renameStylingTemplate({ id: _id, new_name: nameDraft }))
    } else {
      setNameDraft(name)
    }

    setEditMode(false)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target!

    setNameDraft(value)
  }

  const setTemplate = () => {
    if (!editMode) {
      dispatch(setStylingFromTemplate(_id))
    }
  }

  const removeTemplate = (e: React.MouseEvent) => {
    e.stopPropagation()

    dispatch(deleteStylingTemplate(_id))
  }

  return (
    <li key={_id} onClick={setTemplate}>
      {editMode ? (
        <form onSubmit={handleSubmit}>
          <input value={nameDraft} onChange={handleNameChange} />
        </form>
      ) : (
        <span>{name}</span>
      )}
      <div>
        <button title="Rename" onClick={toggleEditMode}>
          <AiFillEdit />
        </button>
        <button title="Delete" onClick={(e) => removeTemplate(e)}>
          <TiDelete />
        </button>
      </div>
    </li>
  )
}

export default StylingTemplatesList

const StyledTemplates = styled.ul`
  padding: 8px 2px;
  display: flex;
  flex-direction: column;
  background-color: var(--main);
  color: white;
  list-style: none;
  border-radius: 8px;
  width: 100%;

  li {
    padding: 2px 12px 0;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
  }

  li button {
    border: none;
    background-color: transparent;
    color: white;
  }

  li:hover {
    background-color: white;
    color: var(--main);
  }

  .icon-btn {
    margin: 0 2px;
    color: var(--main);
  }

  input {
    background-color: transparent;
    border: none;
    color: black;
  }
`
