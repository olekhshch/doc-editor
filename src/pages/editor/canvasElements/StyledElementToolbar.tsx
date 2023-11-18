import styled from "styled-components"
import { useContext } from "react"
import { CurrentDocContext, CurrentThemeContext } from "../Editor"

type props = {
  children?: JSX.Element | string
  outOfScreen?: boolean
  left_position?: number
}

const StyledElementToolbar = ({
  children,
  outOfScreen,
  left_position,
}: props) => {
  const { main, gray } = useContext(CurrentThemeContext)
  const { readonly } = useContext(CurrentDocContext)!

  return (
    <StyledToolbar
      className="doc-element-toolbar"
      $main={main}
      $gray={gray}
      $fixed={outOfScreen}
      $left={left_position}
      $hidden={readonly}
    >
      {children}
    </StyledToolbar>
  )
}

export default StyledElementToolbar

type styledProps = {
  $main: string
  $gray: string
  $fixed?: boolean
  $left?: number
  $hidden?: boolean
}

const StyledToolbar = styled.div<styledProps>`
  position: ${(pr) => (pr.$fixed ? "fixed" : "absolute")};
  top: ${(pr) => (pr.$fixed ? "20px" : "-20px")};
  left: ${(pr) => (pr.$fixed ? (pr.$left ? pr.$left + 8 : 8) : 8)}px;
  z-index: 100;
  justify-content: left;
  gap: 12px;
  align-items: center;
  /* gap: 24px; */
  font-size: var(--small-size);
  width: 90%;
  min-width: 400px;

  display: none;

  .toolbar-section,
  .toolbar-section-text-block {
    background-color: white;
    border: 1px solid ${(props) => props.$gray};
    box-shadow: 0 0 6px ${(props) => props.$gray};
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
