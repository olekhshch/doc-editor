import styled from "styled-components"

type styledProps = {
  $max_width: boolean
}

export default styled.article<styledProps>`
  padding: 0 8px;
  position: relative;
  border: 1px solid transparent;
  border-radius: 8px;
  height: fit-content;
  width: ${(props) => (props.$max_width ? "100%" : "auto")};

  .doc-element-toolbar {
    top: -16px;
  }

  &:hover {
    border: 1px solid grey;
  }

  &:hover .doc-element-toolbar {
    display: flex;
  }
`
