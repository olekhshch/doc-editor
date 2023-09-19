import React from "react"
import styled from "styled-components"
import { DocumentInterface } from "../../types"

type props = {
  documents: DocumentInterface[]
}

const ProjectDocsContainer = ({ documents }: props) => {
  const Content = () => {
    if (documents.length === 0) {
      return (
        <div className="empty-msg flex-col">
          <p>There are no documents in this project.</p>
          <button className="text-btn">Create document</button>
        </div>
      )
    }
    return <ul>Not empty</ul>
  }
  return (
    <StyledArticle>
      <Content />
    </StyledArticle>
  )
}

export default ProjectDocsContainer

const StyledArticle = styled.article`
  border: 1px solid var(--white);
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
`
