import styled from "styled-components"

type styledProps = {
  $font_size?: number
  $max_width: boolean
  $canvas_width: number
  $gray: string
  $readonly?: boolean
}

export default styled.article<styledProps>`
  padding: 4px 0px 0;
  position: relative;
  border: 1px solid transparent;
  border-radius: 8px;
  min-height: ${(pr) => (pr.$font_size ? `${pr.$font_size}px` : "fit-content")};
  min-width: 80px;
  /* flex-grow: 1; */
  /* width: ${(props) => {
    const maxwidth =
      "calc(var(--editor-canvas-width) - var(--editor-left-mg) - var(--editor-right-mg))"
    return props.$max_width ? maxwidth : "auto"
  }};
  max-width: calc(
    var(--editor-canvas-width) - var(--editor-left-mg) - var(--editor-right-mg)
  ); */
  width: ${(pr) => (pr.$max_width ? `${pr.$canvas_width}px` : "auto")};
  max-width: ${(pr) => pr.$canvas_width}px;

  /* .doc-element-toolbar {
    top: -20px;
    left: 8px;
  } */

  &:hover {
    border: 1px solid
      ${(props) => (props.$readonly ? "transparent" : props.$gray)};
  }

  &:hover .doc-element-toolbar {
    display: ${(props) => (props.$readonly ? "none" : "flex")};
  }
`
