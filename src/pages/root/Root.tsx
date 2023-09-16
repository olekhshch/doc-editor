import React from "react"
import styled from "styled-components"
import Header from "./Header"

const Root = () => {
  return (
    <StyledBg>
      <Header />
    </StyledBg>
  )
}

export default Root

const StyledBg = styled.div`
  width: 100vw;
  min-height: 100vh;
  background: radial-gradient(
    farthest-corner,
    var(--main-lighter),
    var(--main),
    var(--black) 90%
  );
  color: var(--white);
`
