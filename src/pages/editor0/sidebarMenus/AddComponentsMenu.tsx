import React, { ChangeEvent } from "react"
import styled from "styled-components"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  toggleBegingsWithTitle,
  addHeading,
  addParagraph,
} from "../../../features/documents/documentsSlice"

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
      <section>
        <h4>Elements</h4>
        <ul className="constructor-btn-container flex-col">
          <li>
            <button
              className="constructor-btn"
              onClick={addHeadingEl}
              disabled={disableElementsAdding}
            >
              <span> H. | .</span> Heading 2
            </button>
          </li>
          <li>
            <button
              className="constructor-btn"
              onClick={addParagraphEl}
              disabled={disableElementsAdding}
            >
              <span> H. | .</span> Paragraph
            </button>
          </li>
          <li>
            <button
              className="constructor-btn"
              disabled={disableElementsAdding}
            >
              <span> img. | .</span> Image
            </button>
          </li>
          <li>
            <button
              className="constructor-btn"
              disabled={disableElementsAdding}
            >
              <span> T | .</span> Table 2x3
            </button>
          </li>
        </ul>
      </section>
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
    padding: 4px;
    display: flex;
    width: 100%;
  }

  .constructor-btn:disabled {
    color: grey;
  }

  .constructor-btn:hover {
    background-color: var(--main);
    color: var(--white);
  }
`
