import styled from "styled-components"
import { useContext } from "react"
import { CurrentThemeContext } from "../Editor"

type props = {
  children?: JSX.Element | string
}

const StyledElementToolbar = ({ children }: props) => {
  const { main, gray } = useContext(CurrentThemeContext)
  return (
    <StyledToolbar className="doc-element-toolbar" $main={main} $gray={gray}>
      {children}
    </StyledToolbar>
  )
}

export default StyledElementToolbar

type styledProps = {
  $main: string
  $gray: string
}

const StyledToolbar = styled.div<styledProps>`
  position: absolute;
  z-index: 100;
  display: flex;
  justify-content: left;
  gap: 12px;
  align-items: center;
  /* gap: 24px; */
  font-size: var(--small-size);
  width: 90%;
  min-width: 240px;

  display: none;

  .toolbar-section,
  .toolbar-section-text-block {
    background-color: white;
    border: 1px solid ${(props) => props.$main};
    border-radius: 8px;
    padding: 0;
    height: fit-content;
  }

  button {
    background-color: transparent;
  }

  .element-toolbar-btn {
    padding: 2px;
    border: none;
    min-width: 16px;
    font-size: var(--small-size);
    text-align: center;
    font-weight: bold;
  }

  .element-toolbar-btn:hover,
  .active {
    background-color: ${(props) => props.$main};
    color: var(--white);
  }

  .delete-btn:hover {
    background-color: red;
  }

  .colour-swatch div {
    width: 0.8em;
    height: 0.8em;
    border: 1px solid ${(props) => props.$gray};
  }

  input[type="range"] {
    margin: 4px 2px;
    -webkit-appearance: none;
    background-color: ${(props) => props.$main};
    width: 100px;
    height: 6px;
  }
`
