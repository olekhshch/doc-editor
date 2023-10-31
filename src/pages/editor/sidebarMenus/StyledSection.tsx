import styled from "styled-components"

export const StyledSection = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;

  .title {
    display: flex;
    cursor: pointer;
    background-color: var(--main-light);
  }

  .dnd-handle {
    margin: auto 4px;
    cursor: grab;
  }

  .styling-params {
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    border-bottom: 2px solid var(--main-light);
  }

  .param {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .swatch {
    width: 36px;
    height: 1em;
    border: 4px solid white;
  }
`
