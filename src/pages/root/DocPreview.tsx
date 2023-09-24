import React from "react"
import { DocumentPreviewInterface } from "../../types"
import styled from "styled-components"
import { TiDelete } from "react-icons/ti"
import { MdModeEditOutline } from "react-icons/md"
import { IconContext } from "react-icons"
import { useAppDispatch } from "../../app/hooks"
import { deleteDoc } from "../../features/documents/documentsSlice"

interface props {
  documentPreview: DocumentPreviewInterface
}
const DocPreview = ({ documentPreview }: props) => {
  const { title, _id } = documentPreview
  const dispatch = useAppDispatch()

  const remove = () => {
    dispatch(deleteDoc(_id))
  }
  return (
    <StyledLi className="doc-preview">
      <p>{title}</p>
      <div className="doc-preview-tools">
        <IconContext.Provider
          value={{ size: "24px", className: "doc-tools-icon" }}
        >
          <button className="icon" title="Rename">
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
  cursor: grab;
  text-align: center;
  position: relative;

  p {
    margin-top: 54%;
    user-select: none;
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
