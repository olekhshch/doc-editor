import React, { useState, useEffect, useRef } from "react"
import styled from "styled-components"
import {
  DocumentInterface,
  DocumentPreviewInterface,
  ProjectInterface,
} from "../../types"
import { IconContext } from "react-icons"
import { RiDeleteBin6Line, RiPencilLine } from "react-icons/ri"
import { GoGrabber } from "react-icons/go"
import { BsArrowsCollapse } from "react-icons/bs"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  collapseProject,
  deleteProject,
  expandProject,
  renameProject,
  setEditTitleId,
} from "../../features/projects/projectsSlice"
import ProjectDocsContainer from "./ProjectDocsContainer"
import { useDrag } from "react-dnd/dist/hooks"
import { DnDTypes } from "../../DnDtypes"

interface props {
  project: ProjectInterface
}
const Project = ({ project }: props) => {
  const { editTitleId } = useAppSelector((state) => state.projects)
  const { title, _id, isCollapsed, orderIndex } = project
  const dispatch = useAppDispatch()

  const [prTitle, setPrTitle] = useState(title)
  const [titleWidth, setTitleWidth] = useState(230)

  const filterById = (array: DocumentPreviewInterface[], id: number) => {
    const copy = [...array]
    const res = copy.filter((doc) => doc.projectId === id)

    return res
  }

  const { documents } = useAppSelector((state) => state.documents)
  const projDocuments = filterById(documents, _id)

  const [{ isDragging }, dragHandle, dragPreview] = useDrag({
    type: DnDTypes.PROJECT,
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
    item: { _id, title, orderIndex },
  })

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

  const editModeOn = () => {
    dispatch(setEditTitleId(_id))
  }

  const editBtnAction = () => {
    if (editTitleId !== _id) {
      editModeOn()
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

  const toggleCollapsed = () => {
    dispatch(!isCollapsed ? collapseProject(_id) : expandProject(_id))
  }

  return (
    <StyledArticle>
      <IconContext.Provider value={{ color: "var(--white)", size: "24px" }}>
        <div
          className={
            isDragging ? "project-title flex dragging" : "project-title flex"
          }
          draggable
        >
          <button
            className="icon grabber"
            title="Drag&drop to reorder"
            ref={dragHandle}
          >
            <GoGrabber />
          </button>
          {_id === editTitleId ? (
            <form onSubmit={handleTitleSubmit}>
              <input
                //   ref={inputRef}
                className="edit-title"
                value={prTitle}
                placeholder="Can't be empty"
                onChange={(e) => handleTitleChange(e)}
                style={{ width: titleWidth + "px" }}
                autoFocus
              />
            </form>
          ) : (
            <h3 onDoubleClick={editModeOn} ref={dragPreview}>
              {title}
            </h3>
          )}
          <span ref={titleRef}>{prTitle}</span>

          {!isDragging && (
            <div className="actions flex">
              <button className="icon" title="Rename" onClick={editBtnAction}>
                <RiPencilLine />
              </button>
              <button
                className="icon"
                title="Collapse"
                onClick={toggleCollapsed}
              >
                <BsArrowsCollapse />
              </button>
              <button
                className="icon"
                title="Delete project"
                onClick={deletePr}
              >
                <RiDeleteBin6Line />
              </button>
            </div>
          )}
        </div>
      </IconContext.Provider>
      {!isDragging && !isCollapsed && (
        <ProjectDocsContainer documents={projDocuments} projectId={_id} />
      )}
    </StyledArticle>
  )
}

export default Project

const StyledArticle = styled.article`
  .project-title {
    height: 30px;
    gap: 6px;
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

  .dragging {
    opacity: 0.6;
  }

  .icon {
    background: none;
    width: fit-content;
    height: fit-content;
    border: none;
  }

  .grabber {
    margin: 0;
    padding: 0;
    cursor: grab;
  }

  h3,
  input {
    padding-right: 12px;
    padding-bottom: 0;
    margin: 0;
    font-size: var(--h2-size);
    font-style: normal;
    font-weight: bold;
  }

  .edit-title {
    width: fit-content;
    background: none;
    border: none;
    color: var(--white);
  }

  .edit-title:focus {
    outline: none;
  }

  span {
    position: absolute;
    top: -100px;
    visibility: hidden;
    font-size: var(--h2-size);
    font-weight: bold;
  }
`
