import React from "react"
import styled from "styled-components"
import Header from "./Header"
import { useAppSelector } from "../../app/hooks"
import Project from "./Project"

const Root = () => {
  const { projects } = useAppSelector((state) => state.projects)

  return (
    <StyledBg>
      <Header />
      <main className="flex-col">
        {projects.map((project) => (
          <Project project={project} key={project._id} />
        ))}
      </main>
    </StyledBg>
  )
}

export default Root

const StyledBg = styled.div`
  width: 100vw;
  overflow-x: hidden;
  min-height: 100vh;
  background: radial-gradient(
    circle,
    var(--main-lighter),
    var(--main),
    var(--black) 80%
  );
  color: var(--white);

  main {
    margin: 80px auto 20px;
    max-width: 90vw;
    gap: 12px;
  }
`
