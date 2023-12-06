import styled from "styled-components"
import { useState } from "react"
import { AiFillEdit } from "react-icons/ai"
import { TiDelete } from "react-icons/ti"
import { IconContext } from "react-icons"
import { Link } from "react-router-dom"

type props = {
  array: { _id: number; title: string }[]
  renameHandler: (title: string, id: number) => void
  deleteHandler: (id: number) => void
  activateHandler: (id: number) => void
}

const AppList = ({
  array,
  renameHandler,
  deleteHandler,
  activateHandler,
}: props) => {
  return (
    <StyledList>
      <IconContext.Provider value={{ className: "icon-btn" }}>
        {array.map((docInfo) => {
          return (
            <Item
              key={docInfo._id}
              itemObj={docInfo}
              renameHandler={renameHandler}
              deleteHandler={deleteHandler}
              activateHandler={activateHandler}
            />
          )
        })}
      </IconContext.Provider>
    </StyledList>
  )
}

export default AppList

const StyledList = styled.ul`
  padding: 8px;
  max-height: 120px;
  background-color: var(--main);
  border-radius: 12px;
  color: white;
  list-style: none;
  overflow-y: auto;

  li {
    padding: 2px 12px 0;
    cursor: pointer;
    display: flex;
  }

  li:hover {
    background-color: white;
    color: var(--main);
  }

  li form,
  li span {
    flex-grow: 1;
  }

  li button {
    border: none;
    background-color: transparent;
    color: white;
  }

  .icon-btn {
    margin: 0 2px;
    color: var(--main);
  }
`

type itemProps = {
  itemObj: { title: string; _id: number }
  renameHandler: (title: string, id: number) => void
  deleteHandler: (id: number) => void
  activateHandler: (id: number) => void
}

const Item = ({
  itemObj,
  renameHandler,
  deleteHandler,
  activateHandler,
}: itemProps) => {
  const { title, _id } = itemObj

  const [titleDraft, setTitleDraft] = useState(title)
  const [editMode, setEditMode] = useState(false)

  const toggleEditMode = (e: React.MouseEvent) => {
    e.stopPropagation()

    setEditMode(!editMode)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    renameHandler(titleDraft, _id)

    setEditMode(false)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target!

    setTitleDraft(value)
  }

  const clickHandler = () => {
    activateHandler(_id)
  }

  const removeHandler = (e: React.MouseEvent) => {
    e.stopPropagation()
    deleteHandler(_id)
  }

  return (
    <li onClick={clickHandler}>
      {editMode ? (
        <form onSubmit={handleSubmit}>
          <input value={titleDraft} onChange={handleTitleChange} />
        </form>
      ) : (
        <span>{title}</span>
      )}
      <div>
        <button title="Rename" onClick={toggleEditMode}>
          <AiFillEdit />
        </button>
        <button title="Delete" onClick={removeHandler}>
          <TiDelete />
        </button>
      </div>
    </li>
  )
}
