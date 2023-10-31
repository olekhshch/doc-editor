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
    border: 1px solid var(--main);
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
    background-color: var(--main);
    color: var(--white);
  }

  .delete-btn:hover {
    background-color: red;
  }

  .colour-swatch div {
    width: 0.8em;
    height: 0.8em;
    border: 1px solid var(--gray);
  }
`
