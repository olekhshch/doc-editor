import React, { createContext, useEffect, useState } from "react"
import styled from "styled-components"
import LeftSidebar from "./LeftSidebar"
import Canvas from "./Canvas"
import RightSidebar from "./RightSidebar"
import { useLoaderData, useLocation, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  cacheContent,
  enableAddingElements,
  setActiveElementId,
  setDocAsCurrent,
} from "../../features/documents/documentsSlice"
import { DocumentPreviewInterface, rgbColour } from "../../types"
import Loading from "../../Loading"
import MainToolbar from "./MainToolbar"
import { screenwidth_editor } from "../../screenwidth_treshholds"

export const CurrentDocContext = createContext<
  DocumentPreviewInterface | undefined
>(undefined)

interface EditorMenuState {
  elementMenuId: number | null
  setElementMenuId: (id: number | null) => void
  showLeftSb: boolean
  showRightSb: boolean
}

export const MenuState = createContext<EditorMenuState>({
  elementMenuId: null,
  setElementMenuId: (id) => {},
  showLeftSb: true,
  showRightSb: true,
})

const Editor = () => {
  const [showLeftSb, setShowLeftSb] = useState(true)
  const [showRightSb, setShowRightSb] = useState(
    window.innerWidth >= screenwidth_editor.only_one_sb,
  )
  //general styling state
  const {
    general: { doc_bg_colour },
  } = useAppSelector((state) => state.styling)

  const [currentDocDetails, setCurrentDocDetails] = useState<
    DocumentPreviewInterface | undefined
  >(undefined)

  const [elementMenuId, setElementMenuId] = useState<number | null>(null)
  const menuContextValue: EditorMenuState = {
    elementMenuId,
    setElementMenuId,
    showLeftSb,
    showRightSb,
  }
  const dispatch = useAppDispatch()

  const { documents, activeDocumentId } = useAppSelector(
    (state) => state.documents,
  )

  const location = useLocation()
  const navigate = useNavigate()

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
      navigate("/not-found")
    } else {
      setCurrentDocDetails(currentDoc)
    }

    dispatch(enableAddingElements())
  }, [dispatch, documents, location.pathname, activeDocumentId])

  const handleEditorClicks = () => {
    // dispatch(setActiveElementId(null))
    setElementMenuId(null)
  }

  const handleResize = () => {
    const { innerWidth } = window
    if (innerWidth < screenwidth_editor.only_one_sb) {
      setShowRightSb(false)
    } else {
      setShowLeftSb(true)
      setShowRightSb(true)
    }
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize)
  }, [])

  if (!currentDocDetails) {
    return <Loading />
  }
  return (
    <CurrentDocContext.Provider value={currentDocDetails}>
      <MenuState.Provider value={menuContextValue}>
        <StyledEditorPage
          onClick={handleEditorClicks}
          $bg_main_colour={doc_bg_colour}
        >
          {showLeftSb && <LeftSidebar />}
          <Canvas />
          {showRightSb && <RightSidebar />}
        </StyledEditorPage>
      </MenuState.Provider>
    </CurrentDocContext.Provider>
  )
}

export default Editor

type styledProps = {
  $bg_main_colour: rgbColour
}

const StyledEditorPage = styled.div<styledProps>`
  display: flex;
  * {
    outline: none;
  }
  background-color: ${(props) => {
    const { r, g, b } = props.$bg_main_colour
    const colorValue = r + "," + g + "," + b
    return `rgb(${colorValue})`
  }};
`
