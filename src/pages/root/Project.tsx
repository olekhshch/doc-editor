import React, { useState, useEffect, useRef } from "react"
import styled from "styled-components"
import { ProjectInterface } from "../../types"
import { IconContext } from "react-icons"
import { RiDeleteBin6Line, RiPencilLine } from "react-icons/ri"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  deleteProject,
  renameProject,
  setEditTitleId,
} from "../../features/projects/projectsSlice"
import ProjectDocsContainer from "./ProjectDocsContainer"

interface props {
  project: ProjectInterface
}
const Project = ({ project }: props) => {
  const { editTitleId } = useAppSelector((state) => state.projects)
  const { title, _id } = project
  const dispatch = useAppDispatch()

  const [prTitle, setPrTitle] = useState(title)
  const [titleWidth, setTitleWidth] = useState(230)

  const handleTitleChange = (e: React.ChangeEvent) => {
    const { value } = e.target as HTMLInputElement
    if (value.length <= 110) {
      const refWidth = titleRef.current!.clientWidth + 4
      const newInputWidth = Math.max(refWidth, 160)
      setPrTitle(value)
      setTitleWidth(newInputWidth)
    }
  }

  const setNewTitle = (newTitle: string) => {
    if (newTitle.trim() !== "") {
      dispatch(renameProject(newTitle))
      dispatch(setEditTitleId(null))
    } else {
      alert("Project's name can't be empty")
    }
  }

  const editBtnAction = () => {
    if (editTitleId !== _id) {
      dispatch(setEditTitleId(_id))
    } else {
      setNewTitle(prTitle)
    }
  }

  const handleTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setNewTitle(prTitle)
  }

  const titleRef = useRef<HTMLSpanElement>(null)
  //   const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const inputWidth = titleRef.current!.clientWidth
    setTitleWidth(inputWidth + 8)
  }, [])

  const deletePr = () => {
    dispatch(deleteProject(_id))
  }

  return (
    <StyledArticle>
      <div className="project-title flex">
        {_id === editTitleId ? (
          <form onSubmit={handleTitleSubmit}>
            <input
              //   ref={inputRef}
              className="edit-title"
              value={prTitle}
              placeholder="Can't be empty"
              onChange={(e) => handleTitleChange(e)}
              style={{ width: titleWidth + "px" }}
            />
          </form>
        ) : (
          <h2>{title}</h2>
        )}
        <span ref={titleRef}>{prTitle}</span>
        <IconContext.Provider value={{ color: "var(--white)", size: "24px" }}>
          <div className="actions flex">
            <button className="icon" title="Rename" onClick={editBtnAction}>
              <RiPencilLine />
            </button>
            <button className="icon" title="Delete project" onClick={deletePr}>
              <RiDeleteBin6Line />
            </button>
          </div>
        </IconContext.Provider>
      </div>
      <ProjectDocsContainer />
    </StyledArticle>
  )
}

export default Project

const StyledArticle = styled.article`
  .project-title {
    height: 30px;
    gap: 12px;
    align-items: center;
  }

  .actions {
    visibility: hidden;
  }

  .project-title:hover .actions {
    display: flex;
    visibility: visible;
    gap: 8px;
  }

  .actions .icon {
    background: none;
    width: fit-content;
    height: fit-content;
    border: none;
  }

  h3,
  input {
    padding: 0;
  }

  .edit-title {
    padding-right: 8px;
    width: fit-content;
    background: none;
    border: none;
    font-size: var(--h2-size);
    color: var(--white);
    font-weight: bold;
  }

  span {
    position: absolute;
    top: -100px;
    visibility: hidden;
    font-size: var(--h2-size);
    font-weight: bold;
  }
`
