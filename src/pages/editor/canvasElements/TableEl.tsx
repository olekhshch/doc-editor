import React from "react"
import { TableElement, columnParam } from "../../../types"
import styled from "styled-components"

type props = {
  tableElObj: TableElement
  column: columnParam
}

const TableEl = ({ tableElObj, column }: props) => {
  const { _id, content } = tableElObj
  return (
    <StyledTable>
      {content.map((row, idx) => {
        return (
          <div key={idx} className="table-row">
            row
          </div>
        )
      })}
    </StyledTable>
  )
}

export default TableEl

const StyledTable = styled.section`
  background-color: beige;
  max-width: 1200px;
  overflow: scroll;
  .table-row {
    width: 2000px;
  }
`
