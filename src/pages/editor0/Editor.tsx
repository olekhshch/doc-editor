import React, { createContext, useEffect, useState } from "react"
import styled from "styled-components"
import LeftSidebar from "./LeftSidebar"
import ContentCanvas from "./content/ContentCanvas"
import RightSidebar from "./RightSidebar"
import { useLoaderData, useLocation } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  cacheContent,
  enableAddingElements,
  setActiveElementId,
  setDocAsCurrent,
} from "../../features/documents/documentsSlice"
import { DocumentPreviewInterface } from "../../types"
import Loading from "../../Loading"

interface CurrentDocContext {
  currentDocDetails: DocumentPreviewInterface | undefined
  setCurrentDocDetails: (dc: DocumentPreviewInterface) => void
}

export const CurrentDocContext = createContext<
  DocumentPreviewInterface | undefined
>(undefined)

const Editor = () => {
  const [currentDocDetails, setCurrentDocDetails] = useState<
    DocumentPreviewInterface | undefined
  >(undefined)
  const dispatch = useAppDispatch()
  const { documents, activeDocumentId } = useAppSelector(
    (state) => state.documents,
  )
  const location = useLocation()

  useEffect(() => {
    //preparing doc content data based on URL id
    const docId0 = location.pathname.replace("/docs/", "")
    const docId = parseInt(docId0, 10)
    if (docId !== activeDocumentId) {
      // dispatch(cacheContent())
      dispatch(setDocAsCurrent(docId))
    }
    const currentDoc = documents.find((doc) => doc._id === docId)
    if (!currentDoc) {
      alert(`Doc with id ${docId} wasn't found`)
    }
    setCurrentDocDetails(currentDoc)

    dispatch(enableAddingElements())
  }, [dispatch, documents, location.pathname, activeDocumentId])

  const handleEditorClicks = () => {
    dispatch(setActiveElementId(null))
  }

  if (!currentDocDetails) {
    return <Loading />
  }
  return (
    <CurrentDocContext.Provider value={currentDocDetails}>
      <StyledEditorPage onClick={handleEditorClicks}>
        <LeftSidebar />
        <ContentCanvas />
        <RightSidebar />
      </StyledEditorPage>
    </CurrentDocContext.Provider>
  )
}

export default Editor

const StyledEditorPage = styled.div`
  display: flex;
`
