import styled from "styled-components"

type styledProps = {
  $max_width: boolean
  $gray: string
}

export default styled.article<styledProps>`
  padding: 0px;
  position: relative;
  border: 1px solid transparent;
  border-radius: 8px;
  height: fit-content;
  width: ${(props) => (props.$max_width ? "100%" : "auto")};
  max-width: ${(props) => (props.$max_width ? "100%" : "auto")};

  .doc-element-toolbar {
    top: -20px;
    left: 8px;
  }

  &:hover {
    border: 1px solid ${(props) => props.$gray};
  }

  &:hover .doc-element-toolbar {
    display: flex;
  }
`
