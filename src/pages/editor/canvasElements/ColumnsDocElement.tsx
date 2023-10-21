import React from "react"
import { ColumnsElement } from "../../../types"
import styled from "styled-components"
import DocElement from "./DocElement"

type props = {
  columnsElement: ColumnsElement
}

const ColumnsDocElement = ({ columnsElement }: props) => {
  const { left, right, _id } = columnsElement
  return (
    <StyledColumnsElement>
      <section className="column">
        {left.map((element) => (
          <DocElement
            key={element._id}
            docElementObj={element}
            column={[_id, "left"]}
          />
        ))}
      </section>
      <section className="column">right</section>
    </StyledColumnsElement>
  )
}

export default ColumnsDocElement

const StyledColumnsElement = styled.div`
  display: flex;
  width: 100%;

  .column {
    margin-left: 4px;
    flex-grow: 1;
  }
`
