import React, { useMemo } from "react"
import { useAppSelector } from "../../../app/hooks"
import styled from "styled-components"
import { HeadingElement } from "../../../types"

const DocNavigation = () => {
  const { activeContent, activeDocumentId } = useAppSelector(
    (state) => state.documents,
  )

  const headings = useMemo<HeadingElement[]>(() => {
    if (activeDocumentId && activeContent) {
      return activeContent.components.filter(
        (component) => component.type === "heading",
      ) as HeadingElement[]
    }
    return []
  }, [activeContent, activeDocumentId])

  return (
    <StyledDocNav>
      <ul className="doc-headings">
        {headings.map(({ level, content, orderIndex }) => (
          <li key={orderIndex} className={`heading-${level}`}>
            {content}
          </li>
        ))}
      </ul>
    </StyledDocNav>
  )
}

export default DocNavigation

const StyledDocNav = styled.section`
  max-width: 270px;

  .doc-headings {
    font-weight: bold;
    list-style: none;
  }

  .doc-headings li:hover {
    color: var(--main);
    cursor: pointer;
  }

  .heading-1 {
    font-size: 1.4em;
  }

  .heading-2 {
    font-size: 1.2em;
    margin-left: 8px;
  }

  .heading-3 {
    margin-left: 16px;
  }
`
