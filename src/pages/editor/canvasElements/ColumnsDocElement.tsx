import React from "react"
import { ColumnsElement } from "../../../types"
import styled from "styled-components"
import DocElement from "./DocElement"
import DnDPlaceholder from "./dndPlaceholder"

type props = {
  columnsElement: ColumnsElement
}

const ColumnsDocElement = ({ columnsElement }: props) => {
  const { left, right, _id } = columnsElement
  return (
    <StyledColumnsElement>
      <section className="column">
        {left.map((element, idx) => (
          <div key={element._id}>
            <DnDPlaceholder indexBefore={idx} columnTarget={[_id, "left"]} />
            <DocElement docElementObj={element} column={[_id, "left"]} />
          </div>
        ))}
      </section>
      <section className="column">
        {right.map((element, idx) => (
          <div key={element._id}>
            <DnDPlaceholder indexBefore={idx} columnTarget={[_id, "right"]} />
            <DocElement docElementObj={element} column={[_id, "right"]} />
          </div>
        ))}
      </section>
    </StyledColumnsElement>
  )
}

export default ColumnsDocElement

const StyledColumnsElement = styled.div`
  display: flex;
  width: 100%;

  .column {
    margin-left: 4px;
    display: flex;
    flex-direction: column;

    flex-grow: 1;
    flex-shrink: 0;
    max-width: 50%;
  }
`
