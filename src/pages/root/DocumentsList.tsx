import React from "react"
import { DocumentFull } from "../../features/documents/initialState"
import styled from "styled-components"
import AppList from "../../components/AppList"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  deleteDoc,
  renameActiveDoc,
  setDocAsCurrent,
} from "../../features/documents/documentsSlice"
import { useNavigate } from "react-router-dom"

type props = { docs: DocumentFull[] }
const DocumentsList = ({ docs }: props) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { activeDocumentId } = useAppSelector((state) => state.documents)
  const docsInfos = docs.map((doc) => doc.documentInfo)

  const activateHandler = (docId: number) => {
    dispatch(setDocAsCurrent(docId))
    navigate("/docs/" + docId)
  }

  const renameHandler = (title: string, id: number) => {
    if (id === activeDocumentId) {
      dispatch(renameActiveDoc(title))
    }
  }

  const deleteHandler = (id: number) => {
    dispatch(deleteDoc(id))
  }

  return (
    <AppList
      array={docsInfos}
      renameHandler={renameHandler}
      deleteHandler={deleteHandler}
      activateHandler={activateHandler}
    />
  )
}

export default DocumentsList

// const StyledList = styled.ul`
//   padding: 8px 4px;
//   min-width: 400px;
//   background-color: var(--main);
//   border-radius: 12px;
//   color: white;
//   list-style: none;
// `
