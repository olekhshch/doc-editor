import React from "react"
import styled from "styled-components"
import { ContentComponentType } from "../../../types"
import { useAppDispatch } from "../../../app/hooks"
import {
  deleteElement,
  insertColumn,
} from "../../../features/documents/documentsSlice"
type props = {
  elementId: number
  elementType: ContentComponentType
}
const ElementMenu = ({ elementId, elementType }: props) => {
  const dispatch = useAppDispatch()

  const ColumnsMenu = () => {
    const addLeft = () => {
      dispatch(insertColumn({ elementId, side: "left" }))
    }

    const addRight = () => {
      dispatch(insertColumn({ elementId, side: "right" }))
    }

    if (elementType === "columns") {
      return (
        <ul className="secondary-menu" aria-label="columns">
          <li>Remove left</li>
          <li>Remove right</li>
          <li>Collapse, left first</li>
          <li>Collapse, right first</li>
        </ul>
      )
    }

    return (
      <ul className="secondary-menu">
        <li onClick={addLeft}>to the left</li>
        <li onClick={addRight}>to the right</li>
      </ul>
    )
  }

  return (
    <StyledMenu>
      <ul className="primary-menu">
        <li>Add element...</li>
        <div className="divider" />
        <li aria-label="columns">
          {elementType === "columns" ? "Manage columns..." : "Add column..."}
          <ColumnsMenu />
        </li>
        <div className="divider" />
        <li>Copy</li>
        <li>Paste</li>
        <li
          onClick={() => dispatch(deleteElement({ elementId, column: null }))}
        >
          Delete
        </li>
      </ul>
    </StyledMenu>
  )
}

export default ElementMenu

const StyledMenu = styled.section`
  position: absolute;
  z-index: 10;

  .primary-menu,
  .secondary-menu {
    padding: 4px;
    width: var(--element-menu-width);
    background-color: white;
    transform: translateX(calc(var(--element-menu-width) + 14px));
    border-radius: 8px;
    font-size: var(--context-menu-size);
    box-shadow: 0 0 6px var(--gray);
  }

  .primary-menu {
    z-index: 20;
  }

  .secondary-menu {
    position: absolute;
    transform: translate(
      calc(var(--element-menu-width)),
      calc(var(--editor-menu-li-height) * -1)
    );
    opacity: 0;
  }

  li[aria-label="columns"]:hover > ul {
    opacity: 1;
  }

  ul {
    display: flex;
    flex-direction: column;
    list-style: none;
  }

  .divider {
    flex-basis: 2px;
    background-color: var(--gray);
  }

  li {
    padding: 0 4px;
    height: var(--editor-menu-li-height);
    cursor: pointer;
  }

  li:hover {
    background-color: var(--gray);
  }
`
