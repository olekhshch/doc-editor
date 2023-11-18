import React, { useEffect } from "react"
import { ColumnsElement } from "../../../types"
import styled from "styled-components"
import DocElement from "./DocElement"
import DnDPlaceholder from "./dndPlaceholder"
import { useAppDispatch } from "../../../app/hooks"
import { addTextBlockToEmptyColumn } from "../../../features/documents/documentsSlice"

type props = {
  columnsElement: ColumnsElement
}

const ColumnsDocElement = ({ columnsElement }: props) => {
  const dispatch = useAppDispatch()

  const { left, right, _id } = columnsElement

  useEffect(() => {
    if (left.length === 0) {
      dispatch(addTextBlockToEmptyColumn([_id, "left"]))
    }

    if (right.length === 0) {
      dispatch(addTextBlockToEmptyColumn([_id, "right"]))
    }
  }, [left.length, right.length, _id, dispatch])

  //#TODO: Get rid of an additional left margin when element is a part of a column
  return (
    <StyledColumnsElement>
      <section className="column">
        {left.map((element, idx) => (
          <div key={element._id}>
            <DnDPlaceholder indexBefore={idx} columnTarget={[_id, "left"]} />
            <DocElement
              docElementObj={element}
              column={[_id, "left"]}
              orderIdx={idx}
            />
          </div>
        ))}
      </section>
      <section className="column">
        {right.map((element, idx) => (
          <div key={element._id}>
            <DnDPlaceholder indexBefore={idx} columnTarget={[_id, "right"]} />
            <DocElement
              docElementObj={element}
              column={[_id, "right"]}
              orderIdx={idx}
            />
          </div>
        ))}
      </section>
    </StyledColumnsElement>
  )
}

export default ColumnsDocElement

const StyledColumnsElement = styled.div`
  display: flex;
  gap: 6px;
  width: 100%;

  .column {
    display: flex;
    flex-direction: column;

    flex-grow: 1;
    flex-shrink: 0;
    max-width: 50%;
  }
`
