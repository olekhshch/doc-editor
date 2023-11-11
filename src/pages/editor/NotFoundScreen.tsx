import React from "react"
import { Link, useNavigate } from "react-router-dom"
import styled from "styled-components"
import { useAppDispatch } from "../../app/hooks"
import { createNewDoc0 } from "../../features/documents/documentsSlice"

const NotFoundScreen = () => {
  const dispatch = useAppDispatch()
  const navigation = useNavigate()

  const handleNewDocCreation = () => {
    dispatch(createNewDoc0())
    navigation("/docs")
  }
  return (
    <StyledNotFound>
      <article>
        Couldn't find this document.
        <div className="flex options">
          <Link to="/" className="option">
            Back to main
          </Link>
          <button onClick={handleNewDocCreation}>Create a new doc</button>
          <button>Load from file</button>
        </div>
      </article>
    </StyledNotFound>
  )
}

export default NotFoundScreen

const StyledNotFound = styled.main`
  article {
    margin: 48px auto;
    padding: 24px;
    width: fit-content;
    border: 1px solid var(--gray);
  }

  .options {
    margin-top: 8px;
    gap: 12px;
  }

  .option {
    padding: 8px 4px;
    background-color: var(--main);
    color: white;
    text-decoration: none;
  }
`
