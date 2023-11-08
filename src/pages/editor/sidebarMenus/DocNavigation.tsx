import React, { useMemo, useContext } from "react"
import { useAppSelector } from "../../../app/hooks"
import styled from "styled-components"
import {
  ColumnsElement,
  DocContentComponent,
  HeadingElement,
} from "../../../types"
import { CurrentThemeContext } from "../Editor"

const DocNavigation = () => {
  const { activeContent, activeDocumentId } = useAppSelector(
    (state) => state.documents,
  )

  const { main } = useContext(CurrentThemeContext)

  const headings = useMemo<HeadingElement[]>(() => {
    if (activeDocumentId && activeContent) {
      const checkArrayForHeadings = (
        componentsArray: (DocContentComponent | ColumnsElement)[],
      ) => {
        let res: HeadingElement[] = []

        componentsArray.forEach((element) => {
          if (element.type === "heading") {
            res.push(element)
          } else if (element.type === "columns") {
            const leftRes = checkArrayForHeadings(element.left)
            const rightRes = checkArrayForHeadings(element.right)

            res = [...res, ...leftRes, ...rightRes]
          }
        })

        return res
      }

      return checkArrayForHeadings(activeContent.components)
      // return activeContent.components.filter(
      //   (component) => component.type === "heading",
      // ) as HeadingElement[]
    } else {
      return []
    }
  }, [activeContent, activeDocumentId])

  return (
    <StyledDocNav $main={main}>
      <ul className="doc-headings">
        {headings.map(({ level, content, orderIndex, _id }) => (
          <li key={_id} className={`heading-${level}`}>
            {content}
          </li>
        ))}
      </ul>
    </StyledDocNav>
  )
}

export default DocNavigation

type styledProps = {
  $main: string
}

const StyledDocNav = styled.section<styledProps>`
  max-width: 270px;

  .doc-headings {
    font-weight: bold;
    list-style: none;
  }

  .doc-headings li:hover {
    color: ${(props) => props.$main};
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
