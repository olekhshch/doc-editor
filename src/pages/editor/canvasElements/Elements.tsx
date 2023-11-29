import React, { useEffect, useContext } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import HeadingEl from "./HeadingEl"
import Element from "./DocElement"
import styled from "styled-components"
import DnDPlaceholder from "./dndPlaceholder"
import { CurrentDocContext } from "../Editor"

const Elements = () => {
  const dispatch = useAppDispatch()
  const { activeContent } = useAppSelector((state) => state.documents)
  const { canvas_width } = useAppSelector((state) => state.styling.parameters)
  const { readonly } = useContext(CurrentDocContext)!

  if (!activeContent) {
    return <></>
  }

  const { components } = activeContent

  return (
    <StyledElementsList>
      {components.map((element, idx) => {
        const { _id } = element

        return (
          <div key={_id} draggable>
            {!readonly && (
              <DnDPlaceholder indexBefore={idx} columnTarget={null} />
            )}
            <Element docElementObj={element} column={null} orderIdx={idx} />
          </div>
        )
      })}
      <div id="max-width-ref" style={{ maxWidth: `${canvas_width}px` }} />
    </StyledElementsList>
  )
}

export default Elements

const StyledElementsList = styled.ul`
  padding-right: 36px;
  display: flex;
  flex-direction: column;
  list-style: none;
  font-size: var(--p-size);

  #max-width-ref {
    margin-left: var(--editor-left-mg);
    background-color: transparent;
    height: 2px;
  }
`
