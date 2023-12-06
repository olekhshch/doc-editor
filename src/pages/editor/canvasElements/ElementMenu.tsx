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
import { CurrentThemeContext, MenuState } from "../Editor"
import { IoIosArrowDown } from "react-icons/io"
import { IconContext } from "react-icons"
type props = {
  elementId: number
  elementType: ContentComponentType
}
const ElementMenu = ({ elementId, elementType }: props) => {
  //#TODO: Add elements sub menu
  const dispatch = useAppDispatch()

  const { menuUpwards } = useContext(MenuState)

  const handleDuplicate = () => {
    dispatch(duplicateElement({ elementId, column: null }))
  }

  //Styling

  const { main, gray, lighter } = useContext(CurrentThemeContext)

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
    <StyledMenu
      $gray={gray}
      $lighter={lighter}
      $main={main}
      $upwards={menuUpwards}
    >
      <IconContext.Provider value={{ style: { rotate: "-90deg" } }}>
        <ul className="primary-menu">
          <li>
            <span>Add element</span>
            <IoIosArrowDown />
          </li>
          <div className="divider" />
          <li aria-label="columns">
            <span>
              {elementType === "columns" ? "Manage columns" : "Add column"}
            </span>
            <IoIosArrowDown />
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
      </IconContext.Provider>
    </StyledMenu>
  )
}

export default ElementMenu

type styledProps = {
  $main: string
  $gray: string
  $lighter: string
  $upwards?: boolean
}

const StyledMenu = styled.section<styledProps>`
  position: absolute;
  top: ${(pr) => (pr.$upwards ? -100 : 0)}px;
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
    top: ${(pr) => (pr.$upwards ? "unset" : 0)};
    bottom: ${(pr) => (pr.$upwards ? 0 : "unset")};
    transform: translate(calc(var(--element-menu-width)));
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
    display: flex;
    position: relative;
    align-items: center;
    padding: 2px 4px;
    height: var(--editor-menu-li-height);
    cursor: pointer;
  }

  li:hover {
    background-color: ${(props) => props.$gray};
    color: ${(props) => props.$main};
  }
  li span {
    flex-grow: 1;
  }
`
