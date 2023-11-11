import React, { useContext } from "react"
import styled from "styled-components"
import { ContentComponentType } from "../../../types"
import { useAppDispatch } from "../../../app/hooks"
import {
  deleteElement,
  deleteSideOfColumn,
  duplicateElement,
  insertColumn,
} from "../../../features/documents/documentsSlice"
import { CurrentThemeContext } from "../Editor"
type props = {
  elementId: number
  elementType: ContentComponentType
}
const ElementMenu = ({ elementId, elementType }: props) => {
  const dispatch = useAppDispatch()

  const handleDuplicate = () => {
    dispatch(duplicateElement({ elementId, column: null }))
  }

  //Styling

  const { main, gray, lighter } = useContext(CurrentThemeContext)

  //TODO: Table menu options (colapse table, import .csv etc.)
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
          <li
            onClick={() =>
              dispatch(
                deleteSideOfColumn({ columnsElId: elementId, side: "left" }),
              )
            }
          >
            Remove left
          </li>
          <li
            onClick={() =>
              dispatch(
                deleteSideOfColumn({ columnsElId: elementId, side: "right" }),
              )
            }
          >
            Remove right
          </li>
          <li>Collapse, left first</li>
          <li>Collapse, right first</li>
        </ul>
      )
    }

    return (
      <ul className="secondary-menu">
        <li onClick={addLeft}>to the right</li>
        <li onClick={addRight}>to the left</li>
      </ul>
    )
  }

  return (
    <StyledMenu $gray={gray} $lighter={lighter} $main={main}>
      <ul className="primary-menu">
        <li>Add element...</li>
        <div className="divider" />
        <li aria-label="columns">
          {elementType === "columns" ? "Manage columns..." : "Add column..."}
          <ColumnsMenu />
        </li>
        <div className="divider" />
        <li onClick={handleDuplicate}>Duplicate</li>
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

type styledProps = {
  $main: string
  $gray: string
  $lighter: string
}

const StyledMenu = styled.section<styledProps>`
  position: absolute;
  z-index: 10;
  color: var(--black);

  .primary-menu,
  .secondary-menu {
    padding: 4px;
    width: var(--element-menu-width);
    background-color: white;
    transform: translateX(calc(var(--element-menu-width) + 14px));
    border-radius: 8px;
    font-size: var(--context-menu-size);
    box-shadow: 0 0 8px ${(props) => props.$gray};
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
    color: var(--black);
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
    background-color: ${(props) => props.$gray};
  }

  li {
    padding: 2px 4px;
    height: var(--editor-menu-li-height);
    cursor: pointer;
  }

  li:hover {
    background-color: ${(props) => props.$gray};
    color: ${(props) => props.$main};
  }
`
