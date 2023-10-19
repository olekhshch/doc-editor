import styled from "styled-components"

type props = {
  children?: JSX.Element | string
}

const StyledElementToolbar = ({ children }: props) => {
  return (
    <StyledToolbar className="doc-element-toolbar">{children}</StyledToolbar>
  )
}

export default StyledElementToolbar

const StyledToolbar = styled.div`
  position: absolute;
  display: flex;
  gap: 24px;
  font-size: var(--small-size);

  display: none;

  .toolbar-section {
    background-color: white;
    border: 1px solid var(--main);
    border-radius: 8px;
    padding: 0 4px;
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
    background-color: var(--main);
    color: var(--white);
  }
`