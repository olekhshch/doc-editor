import styled from "styled-components"

type styledProps = {
  $main: string
  $gray: string
}

export const StyledSection = styled.section<styledProps>`
  width: 100%;
  min-width: 100%;
  display: flex;
  flex-direction: column;
  color: var(--black);

  .title {
    padding: 0 12px;
    display: flex;
    cursor: pointer;
    background-color: ${(props) => props.$gray};
  }

  .dnd-handle {
    margin: auto 4px;
    cursor: grab;
  }

  .styling-params {
    margin: 4px auto;
    width: 90%;
    display: flex;
    flex-direction: column;
  }

  .param {
    display: flex;
    flex-direction: column;
    gap: 2px;
    user-select: none;
  }

  .param-selector {
    margin: 8px;
    gap: 4px 0;
    width: 100%;
  }

  .param-selector span {
    margin: 0 4px;
    flex-grow: 1;
    letter-spacing: 1px;
  }

  .param-selector .nav-btn {
    width: 1.4em;
    height: 1.4em;
    background-color: transparent;
    border: none;
    border-radius: 50%;
  }

  #tb-size-presets option {
    font-size: var(--small-size);
    padding: 0;
  }

  .font-size-input {
    max-width: 40px;
  }

  .range-input {
    max-width: 80px;
  }
`
