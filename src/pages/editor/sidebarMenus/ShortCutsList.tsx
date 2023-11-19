import React, { useContext } from "react"
import styled from "styled-components"
import { useAppSelector } from "../../../app/hooks"
import { CurrentThemeContext } from "../Editor"

const ShortCutsList = () => {
  const { activeElementId, activeElementType } = useAppSelector(
    (state) => state.documents,
  )

  //THEME
  const { gray, main } = useContext(CurrentThemeContext)

  return (
    <StyledShortcutsList $gray={gray} $main={main}>
      <h4>Shortcuts</h4>
      <ul>
        <li className="shortcut-list-item">
          <div className="keys flex-col">
            {activeElementType === "heading" && <span>Enter</span>}
            <span>Alt + P</span>
            {activeElementType === "paragraph" && <span>Shift + Enter</span>}
          </div>
          <span className="shortcut-description">New text block*</span>
        </li>
        <li className="shortcut-list-item">
          <div className="keys flex-col">
            <span>Alt + H</span>
          </div>
          <span className="shortcut-description">New heading*</span>
        </li>
        <li className="shortcut-list-item">
          <div className="keys flex-col">
            <span>Alt + S</span>
          </div>
          <span className="shortcut-description">New separator*</span>
        </li>
      </ul>
      <p className="remark">
        *
        {activeElementId === null
          ? "at the end of the document"
          : "after the active element"}
      </p>
    </StyledShortcutsList>
  )
}

export default ShortCutsList

type styledProps = {
  $gray: string
  $main: string
}

const StyledShortcutsList = styled.section<styledProps>`
  margin-left: 12px;
  max-width: 210px;

  .keys {
    min-width: 90px;
    font-weight: bold;
  }

  ul,
  .remark {
    color: ${(pr) => pr.$gray};
  }

  .remark {
    margin-top: 4px;
    font-style: italic;
  }

  ul .shortcut-list-item:hover {
    color: ${(pr) => pr.$main};
  }

  .shortcut-list-item {
    display: flex;
    gap: 8px;
    border-bottom: 1px solid ${(pr) => pr.$gray};
  }

  .shortcut-description {
    white-space: break-spaces;
    margin-top: auto;
    margin-bottom: auto;
  }
`
