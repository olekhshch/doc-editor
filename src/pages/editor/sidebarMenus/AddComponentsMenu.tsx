import React, { ChangeEvent } from "react"
import styled from "styled-components"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  toggleBegingsWithTitle,
  addHeading,
  addParagraph,
} from "../../../features/documents/documentsSlice"
import { BiHeading, BiImage } from "react-icons/bi"
import { BsCardText } from "react-icons/bs"
import { ImTable } from "react-icons/im"
import { IconContext } from "react-icons"
import { CgFormatSeparator } from "react-icons/cg"

const AddComponentsMenu = () => {
  const { beginsWithTitle, disableElementsAdding } = useAppSelector(
    (state) => state.documents,
  )
  const dispatch = useAppDispatch()

  const handleShowTitleChange = (e: ChangeEvent) => {
    e.preventDefault()
    dispatch(toggleBegingsWithTitle())
  }

  const addHeadingEl = () => {
    dispatch(addHeading({ level: 2 }))
  }

  const addParagraphEl = () => {
    dispatch(addParagraph({}))
  }

  return (
    <StyledAddMenu className="sb-menu">
      <IconContext.Provider value={{ size: "24" }}>
        <section>
          <ul className="constructor-btn-container">
            <li>
              <button
                className="constructor-btn"
                onClick={addHeadingEl}
                disabled={disableElementsAdding}
              >
                <span className="icon">
                  <BiHeading />
                </span>
                Heading 2
              </button>
            </li>
            <li>
              <button
                className="constructor-btn"
                onClick={addParagraphEl}
                disabled={disableElementsAdding}
              >
                <span className="icon">
                  <BsCardText />
                </span>{" "}
                Text block
              </button>
            </li>
            <li>
              <button
                className="constructor-btn"
                disabled={disableElementsAdding}
              >
                <span className="icon">
                  <BiImage />
                </span>{" "}
                Image
              </button>
            </li>
            <li>
              <button
                className="constructor-btn"
                disabled={disableElementsAdding}
              >
                <span className="icon">
                  <ImTable />
                </span>{" "}
                Table 2x3
              </button>
            </li>
            <li>
              <button
                className="constructor-btn"
                disabled={disableElementsAdding}
              >
                <span className="icon">
                  <CgFormatSeparator />
                </span>{" "}
                Separator
              </button>
            </li>
          </ul>
        </section>
      </IconContext.Provider>
      <section>
        <h4>Other elements</h4>
        <ul>
          <li>
            <form>
              <label>
                <input
                  type="checkbox"
                  name="Document title"
                  checked={beginsWithTitle}
                  onChange={(e) => handleShowTitleChange(e)}
                />
                Document title
              </label>
            </form>
          </li>
          <li></li>
          <li></li>
        </ul>
      </section>
    </StyledAddMenu>
  )
}

export default AddComponentsMenu

const StyledAddMenu = styled.section`
  h4 {
    color: var(--main);
  }
  ul {
    list-style-type: none;
  }

  label {
    display: flex;
    gap: 8px;
  }

  .constructor-btn-container {
  }

  .constructor-btn {
    margin: auto;
    padding: 4px 4px 0;
    display: flex;
    width: 100%;
    max-width: 160px;
    align-items: top;

    background-color: transparent;
    border: none;
    border-radius: 16px;
    font-size: var(--h4-size);
  }

  .constructor-btn:disabled {
    color: var(--gray);
  }

  .constructor-btn:hover {
    background-color: var(--gray);
    color: var(--main);
  }

  span.icon {
    min-width: 42px;
    text-align: center;
  }
`
