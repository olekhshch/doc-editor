import { useContext, useRef, useEffect } from "react"
import { DocumentPreviewInterface } from "../../types"
import styled from "styled-components"
import { TiDelete } from "react-icons/ti"
import { MdModeEditOutline } from "react-icons/md"
import { IconContext } from "react-icons"
import { useAppDispatch } from "../../app/hooks"
import { deleteDoc } from "../../features/documents/documentsSlice"
import { Link } from "react-router-dom"
import WindowContext from "./popUps/WindowsContext"

interface props {
  documentPreview: DocumentPreviewInterface
}
const DocPreview = ({ documentPreview }: props) => {
  const { title, _id } = documentPreview
  const dispatch = useAppDispatch()

  const editTitleBtn = useRef<HTMLButtonElement>(null)

  const windowContext = useContext(WindowContext)

  const remove = () => {
    dispatch(deleteDoc(_id))
  }

  const toggleEditMode = () => {
    const { top, left } = editTitleBtn.current!.getBoundingClientRect()
    const windowTop = top - 40
    const windowLeft = left - 90

    windowContext.setWindowType("rename-doc")
    windowContext.setRenameDocTitle(title)
    windowContext.setRenameDocId(_id)
    windowContext.setWindowCoordinates({ top: windowTop, left: windowLeft })
    windowContext.setIsopen(true)
  }

  return (
    <StyledLi className="doc-preview">
      <h4>
        <Link to={`docs/${_id}`} className="doc-title">
          {title}
        </Link>
      </h4>

      <div className="doc-preview-tools">
        <IconContext.Provider
          value={{ size: "24px", className: "doc-tools-icon" }}
        >
          <button
            ref={editTitleBtn}
            className="icon"
            title="Rename"
            onClick={toggleEditMode}
          >
            <MdModeEditOutline />
          </button>
          <button className="icon" title="Delete" onClick={remove}>
            <TiDelete />
          </button>
        </IconContext.Provider>
      </div>
    </StyledLi>
  )
}

export default DocPreview

const StyledLi = styled.li`
  display: flex;
  cursor: pointer;
  text-align: center;
  position: relative;
  align-items: center;
  text-overflow: clip;
  overflow: hidden;

  h4 {
    width: 100%;
    margin: auto;
    font-size: var(--h4-size);
    text-overflow: clip;
  }

  .doc-title {
    color: var(--white);
    text-decoration: none;
  }
  .doc-preview-tools {
    margin: 4px;
    position: absolute;
    top: 0;
    right: 0;
  }

  .doc-tools-icon {
    fill: transparent;
  }
  &:hover .doc-tools-icon {
    fill: var(--main-lighter);
  }

  .doc-tools-icon:hover {
    fill: var(--white);
  }
`
