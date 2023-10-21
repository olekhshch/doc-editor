import React from "react"
import { useAppSelector } from "../../../app/hooks"
import HeadingEl from "./HeadingEl"
import Element from "./DocElement"
import styled from "styled-components"
import DnDPlaceholder from "./dndPlaceholder"

const Elements = () => {
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
            <DnDPlaceholder indexBefore={element.orderIndex} />
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
