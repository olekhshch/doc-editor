import styled from "styled-components"

export default styled.article`
  padding: 0 8px;
  position: relative;
  border: 1px solid transparent;
  border-radius: 8px;
  height: fit-content;

  &:hover {
    border: 1px solid grey;
  }

  &:hover .doc-element-toolbar {
    display: flex;
  }
`