import React, { useEffect } from "react"
import styled from "styled-components"
import { DocumentInterface } from "../../types"
import DocPreview from "./DocPreview"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { createDoc } from "../../features/documents/documentsSlice"
import { SlPlus } from "react-icons/sl"
import { IconContext } from "react-icons"

type props = {
  documents: DocumentInterface[]
  projectId: number
}

const ProjectDocsContainer = ({ documents, projectId }: props) => {
  const { viewMode } = useAppSelector((state) => state.projects)
  const dispatch = useAppDispatch()

  const addDoc = () => {
    dispatch(createDoc({ projectId }))
  }

  const Content = () => {
    if (documents.length === 0) {
      return (
        <div className="empty-msg flex-col">
          <p>There are no documents in this project.</p>
          <button className="text-btn" onClick={addDoc}>
            Create document
          </button>
        </div>
      )
    }
    return (
      <ul className="docs-list">
        {documents.map((doc) => (
          <DocPreview key={doc._id} documentPreview={doc} />
        ))}
        <li className="doc-preview">
          <IconContext.Provider
            value={{ size: "64px", className: "add-doc-icon" }}
          >
            <button
              className="add-doc-btn"
              title="Add new document"
              onClick={addDoc}
            >
              <SlPlus />
            </button>
          </IconContext.Provider>
        </li>
      </ul>
    )
  }
  return (
    <StyledArticle>
      <Content />
    </StyledArticle>
  )
}

export default ProjectDocsContainer

const StyledArticle = styled.article`
  border-radius: 8px;
  width: 100%;
  min-height: 226px;
  list-style: none;
  align-items: center;

  .empty-msg {
    padding: auto;
    justify-content: center;
    min-height: 226px;
    gap: 2px;
  }

  .empty-msg > button {
    margin: 0 auto;
  }

  .empty-msg p {
    text-align: center;
  }

  .text-btn {
    padding: 4px 6px;
    color: var(--white);
    background: none;
    border: 1px solid var(--white);
    border-radius: 6px;
  }

  .docs-list {
    margin: 16px 24px;
    display: flex;
    list-style: none;
    gap: 8px;
    flex-wrap: wrap;
  }

  .add-doc-btn {
    width: 100%;
    height: 100%;
    box-sizing: content-box;
    background: none;
    border: none;
  }

  .add-doc-icon {
    fill: var(--main-lighter);
  }

  .add-doc-btn:hover .add-doc-icon {
    fill: var(--white);
  }
`
