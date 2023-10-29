import React, { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import HeadingEl from "./HeadingEl"
import Element from "./DocElement"
import styled from "styled-components"
import DnDPlaceholder from "./dndPlaceholder"
import {
  addParagraph,
  setActiveElementId,
} from "../../../features/documents/documentsSlice"

const Elements = () => {
  const dispatch = useAppDispatch()
  const { activeContent } = useAppSelector((state) => state.documents)

  if (!activeContent) {
    return <></>
  }

  const { components } = activeContent

  return (
    <StyledElementsList>
      {components.map((element) => {
        const { _id } = element

        return (
          <div key={_id} draggable>
            <DnDPlaceholder
              indexBefore={element.orderIndex}
              columnTarget={null}
            />
            <Element docElementObj={element} column={null} />
          </div>
        )
      })}
    </StyledElementsList>
  )
}

export default Elements

const StyledElementsList = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
  font-size: var(--p-size);
`
