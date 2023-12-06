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

  display: none;

  .toolbar-section,
  .toolbar-section-text-block {
    padding: 4px;
    display: flex;
    gap: 2px;
    align-items: center;
    background-color: white;
    border: 1px solid ${(props) => props.$gray};
    box-shadow: 0 0 6px ${(props) => props.$gray};
    border-radius: 8px;
    height: fit-content;
  }

  button {
    background-color: transparent;
  }

  .element-toolbar-btn {
    padding: 2px;
    /* padding-bottom: 0; */
    border: none;
    border-radius: 4px;
    min-width: 16px;
    width: 22px;
    font-size: var(--small-size);
    text-align: center;
    font-weight: bold;
  }

  @keyframes activation {
    from {
      background-color: "transparent";
    }

    to {
      background-color: ${(props) => props.$main};
    }
  }

  .element-toolbar-btn:hover,
  .active {
    /* background-color: ${(props) => props.$main}; */
    color: var(--white);

    animation: activation 0.2s forwards;
  }

  @keyframes active-deletion {
    from {
      background-color: "transparent";
    }

    to {
      background-color: red;
    }
  }

  .delete-btn:hover {
    animation: active-deletion 0.2s forwards;
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
