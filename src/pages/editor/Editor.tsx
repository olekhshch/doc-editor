import React, { createContext, useEffect, useState, useMemo } from "react"
import styled from "styled-components"
import LeftSidebar from "./LeftSidebar"
import Canvas from "./Canvas"
import RightSidebar from "./RightSidebar"
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  disableAddingElements,
  enableAddingElements,
  setActiveElementId,
  setDocAsCurrent,
} from "../../features/documents/documentsSlice"
import { DocumentPreviewInterface, ImageElement } from "../../types"
import Loading from "../../Loading"
import { screenwidth_editor } from "../../screenwidth_treshholds"
import { rgbObjToString } from "../../functions/rgbObjToString"
import { ColourTheme } from "../../features/styling/initialState"
import PopUpWindow from "./PopUpWindow"

interface DocInfoContenxt extends DocumentPreviewInterface {
  readonly?: boolean
}

export const CurrentDocContext = createContext<DocInfoContenxt | undefined>(
  undefined,
)

export const CurrentThemeContext = createContext({
  main: rgbObjToString({ r: 100, g: 120, b: 130 }),
  gray: rgbObjToString({ r: 100, g: 120, b: 130 }),
  lighter: rgbObjToString({ r: 100, g: 120, b: 130 }),
  name: "violet",
})

type popUpWindow = "new_image" | "doc_info" | "image_view"

interface EditorMenuState {
  elementMenuId: number | null
  setElementMenuId: (id: number | null) => void
  showLeftSb: boolean
  showRightSb: boolean
  popUpFor: popUpWindow | null
  setPopUpFor: (a: popUpWindow | null) => void
  imageViewObj: undefined | ImageElement
  setImageViewObj: (obj: ImageElement) => void
}

export const MenuState = createContext<EditorMenuState>({
  elementMenuId: null,
  setElementMenuId: (id) => {},
  showLeftSb: true,
  showRightSb: true,
  popUpFor: "new_image",
  setPopUpFor: (a) => {},
  imageViewObj: undefined,
  setImageViewObj: (obj) => {},
})

const Editor = () => {
  const { innerWidth } = window

  const [showLeftSb, setShowLeftSb] = useState(
    innerWidth > screenwidth_editor.no_sb,
  )
  const [showRightSb, setShowRightSb] = useState(
    innerWidth > screenwidth_editor.only_one_sb,
  )

  //general styling state
  const {
    general: { doc_bg_colour, font_colour },
    themes,
    activeTheme,
  } = useAppSelector((state) => state.styling)

  const currentTheme = themes.find((theme) => theme.name === activeTheme)!

  const themeToRgb = (themeObj: ColourTheme) => {
    const { name, main, gray, lighter } = themeObj
    return {
      name,
      main: `rgb(${rgbObjToString(main)})`,
      gray: `rgb(${rgbObjToString(gray)})`,
      lighter: `rgb(${rgbObjToString(lighter)})`,
    }
  }

  const [themeObj, setThemeObj] = useState(themeToRgb(currentTheme))

  useEffect(() => {
    const currentTheme = themes.find((theme) => theme.name === activeTheme)!
    setThemeObj(themeToRgb(currentTheme))
  }, [activeTheme, themes])

  // const themeContextValue = useMemo(() => {
  //   const activeThemeObj = themes.find((theme) => theme.name === activeTheme)!
  //   return {
  //     main: `rgb(${rgbObjToString(activeThemeObj.main)})`,
  //     gray: `rgb(${rgbObjToString(activeThemeObj.gray)})`,
  //     lighter: `rgb(${rgbObjToString(activeThemeObj.lighter)})`,
  //     name: activeThemeObj.name,
  //   }
  // }, [activeTheme, themes])

  const [currentDocDetails, setCurrentDocDetails] = useState<
    DocInfoContenxt | undefined
  >(undefined)

  //Editor additional windows and menus

  const [elementMenuId, setElementMenuId] = useState<number | null>(null)
  const [popUpFor, setPopUpFor] = useState<popUpWindow | null>(null)
  const [imageViewObj, setImageViewObj] = useState<ImageElement | undefined>(
    undefined,
  )
  const menuContextValue: EditorMenuState = {
    elementMenuId,
    setElementMenuId,
    showLeftSb,
    showRightSb,
    popUpFor,
    setPopUpFor,
    imageViewObj,
    setImageViewObj,
  }
  const dispatch = useAppDispatch()

  const { activeContent, activeDocumentInfo } = useAppSelector(
    (state) => state.documents,
  )
  const [searchParams, setSearchParams] = useSearchParams()
  const URLParams = useParams()

  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const { docId } = URLParams
    if (docId) {
      const docIdNum = parseInt(docId, 10)
      //Cheking if current active Content and info is related to this doc
      if (
        docIdNum === activeContent?.docId &&
        activeDocumentInfo?._id === docIdNum
      ) {
        //Cheking if readonly param is defined
        const readonly = searchParams.get("readonly") ? true : false
        setCurrentDocDetails({ ...activeDocumentInfo, readonly })

        dispatch(readonly ? disableAddingElements() : enableAddingElements())
      } else {
        throw new Error("ERROR: Wasn't able to find full doc info")
      }
    }
  }, [URLParams, activeContent?.docId, activeDocumentInfo, searchParams])

  // useEffect(() => {
  //   //preparing doc content data based on URL id
  //   const docId0 = location.pathname.replace("/docs/", "")
  //   const docId = parseInt(docId0, 10)
  //   if (docId !== activeDocumentId) {
  //     // dispatch(cacheContent())
  //     dispatch(setDocAsCurrent(docId))
  //   }
  //   const currentDoc = documents.find((doc) => doc._id === docId)
  //   if (!currentDoc) {
  //     navigate("/not-found")
  //   } else {
  //     const readonly = searchParams.get("readonly")

  //     setCurrentDocDetails({
  //       ...currentDoc,
  //       readonly: readonly ? true : false,
  //     })

  //     console.log(currentDocDetails)
  //   }

  //   dispatch(enableAddingElements())
  // }, [
  //   dispatch,
  //   documents,
  //   location.pathname,
  //   activeDocumentId,
  //   navigate,
  //   searchParams,
  //   currentDocDetails,
  // ])

  const handleEditorClicks = () => {
    dispatch(setActiveElementId(null))
    setElementMenuId(null)
  }

  const handleResize = () => {
    const { innerWidth } = window
    if (innerWidth < screenwidth_editor.only_one_sb) {
      setShowRightSb(false)
      if (innerWidth < screenwidth_editor.no_sb) {
        setShowLeftSb(false)
      } else {
        setShowLeftSb(true)
      }
    } else {
      setShowLeftSb(true)
      setShowRightSb(true)
    }
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    document.body.style.overflow = !popUpFor ? "auto" : "hidden"
  }, [popUpFor])

  if (!currentDocDetails) {
    return <Loading />
  }
  return (
    <CurrentDocContext.Provider value={currentDocDetails}>
      <MenuState.Provider value={menuContextValue}>
        <CurrentThemeContext.Provider value={themeObj}>
          <StyledEditorPage
            onClick={handleEditorClicks}
            style={{
              backgroundColor: `rgb(${rgbObjToString(doc_bg_colour.colour)})`,
              color: `rgb(${rgbObjToString(font_colour.colour)})`,
            }}
          >
            {showLeftSb && <LeftSidebar />}
            <Canvas />
            {showRightSb && <RightSidebar />}
          </StyledEditorPage>
          {popUpFor !== null && <PopUpWindow />}
        </CurrentThemeContext.Provider>
      </MenuState.Provider>
    </CurrentDocContext.Provider>
  )
}

export default Editor

// type styledProps = {
//   $theme: ColourTheme
// }

const StyledEditorPage = styled.div`
  display: flex;

  * {
    outline: none;
    caret-color: black;
  }
`
