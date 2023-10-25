import React from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"

const NotFoundScreen = () => {
  return (
    <StyledNotFound>
      <article>
        Couldn't find this document.
        <div className="flex options">
          <Link to="/" className="option">
            Back to main
          </Link>
          <button>Create a new doc</button>
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
