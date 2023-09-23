import React from "react"
import styled from "styled-components"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { createNewProject } from "../../features/projects/projectsSlice"

const Header = () => {
  const { projects } = useAppSelector((state) => state.projects)
  const dispatch = useAppDispatch()
  const addNewProject = () => {
    if (projects.length <= 10) {
      dispatch(createNewProject())
    } else {
      alert("Max amount of project (10) is excided")
    }
  }
  return (
    <StyledHeader>
      <div className="btn-container">
        <button onClick={addNewProject}>New project</button>
        <a href="">Docs</a>
        <a href="">Git</a>
      </div>
      <form>
        <input placeholder="Search documents by title..."></input>
      </form>
    </StyledHeader>
  )
}

export default Header

const StyledHeader = styled.header`
  padding: var(--marg);
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  justify-content: space-between;
  font-size: var(--h2-size);
  font-weight: bold;
  background: linear-gradient(rgba(var(--main-darker0), 0.8), transparent);

  .btn-container {
    display: flex;
    gap: 24px;
  }

  button {
    padding: 4px 12px;
    border-radius: 10px;
    font-size: var(--h2-size);
    font-weight: bold;
    background-color: var(--white);
    color: var(--main);
    border: none;
  }

  a {
    color: var(--white);
    text-decoration: none;
  }

  form {
    margin-right: var(--marg);
    width: 360px;
  }

  input {
    padding: 4px 8px;
    width: 100%;
    font-size: var(--p-size);
    border-radius: 10px;
    border: none;
  }
`
