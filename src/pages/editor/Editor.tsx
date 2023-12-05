import React, { createContext, useEffect, useState } from "react"
import styled from "styled-components"
import LeftSidebar from "./LeftSidebar"
import Canvas from "./Canvas"
import RightSidebar from "./RightSidebar"
import { useParams, useSearchParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  addParagraph,
  disableAddingElements,
  enableAddingElements,
  setActiveElementData,
} from "../../features/documents/documentsSlice"
import { DocumentPreviewInterface, ImageElement } from "../../types"
import Loading from "../../Loading"
import { screenwidth_editor } from "../../screenwidth_treshholds"
import { rgbObjToString } from "../../functions/rgbObjToString"
import { ColourTheme } from "../../features/styling/initialState"
import PopUpWindow from "./PopUpWindow"
import useDocElements from "../../app/useDocElements"
import FocusContext, { focusCallback } from "./canvasElements/FocusContext"

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
  const dispatch = useAppDispatch()
  const { focusLast } = useDocElements()

  //INFO ABOUT THE ACTIVE DOC (readonly, metadata etc)
  const [currentDocDetails, setCurrentDocDetails] = useState<
    DocInfoContenxt | undefined
  >(undefined)

  const { activeContent, activeDocumentInfo, activeElementType } =
    useAppSelector((state) => state.documents)

  const [searchParams, setSearchParams] = useSearchParams()
  const URLParams = useParams()

  const setReadOnly = () => setSearchParams({ readonly: "true" })
  const setEditMode = () => setSearchParams({})

  const toggleMode = () => {
    const readonly = searchParams.get("readonly") ? true : false
    if (readonly) {
      setEditMode()
    } else {
      setReadOnly()
    }
  }

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
  }, [
    URLParams,
    activeContent?.docId,
    activeDocumentInfo,
    dispatch,
    searchParams,
  ])

  //SB DISPLAY
  const { innerWidth } = window

  const [showLeftSb, setShowLeftSb] = useState(
    innerWidth > screenwidth_editor.no_sb,
  )
  const [showRightSb, setShowRightSb] = useState(
    innerWidth > screenwidth_editor.only_one_sb,
  )

  //STYLING THEME
  const {
    parameters: {
      general: { doc_bg_colour, font_colour },
      activeTheme,
    },
    templates,
    themes,
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

  const handleEditorClicks = () => {
    // dispatch(setActiveElementData({ id: null, type: null }))
    setElementMenuId(null)
    // focusLast()
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

  //ELEMENTS ACTIONS HOOK
  const {
    addParagraphElement,
    addHeadingElement,
    addSeparatorElement,
    addTableElement,
  } = useDocElements()

  useEffect(() => {
    const handleShortcuts = (e: KeyboardEvent) => {
      // e.preventDefault()
      if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case "p":
            addParagraphElement(e)
            break
          case "h":
            addHeadingElement(e)
            break
          case "t":
            addTableElement(e)
            break
          case "s":
            addSeparatorElement(e)
            break
        }
      } else if (e.shiftKey) {
        if (
          e.key === "Enter" &&
          ["paragraph", "heading"].includes(activeElementType!)
        ) {
          addParagraphElement(e)
        } else if (e.ctrlKey) {
          switch (e.key.toLowerCase()) {
            case "e":
            case "r":
              toggleMode()
              e.preventDefault()
              break
          }
        }
      }
    }

    document.addEventListener("keydown", handleShortcuts)

    return () => document.removeEventListener("keydown", handleShortcuts)
  }, [addHeadingElement, addParagraphElement])

  //STORING FOCUS CALLBACKS FOR FOCUSING ELEMENTS EXTERNALLY
  const [focusCbs, setFocusCbs] = useState<focusCallback[]>([])

  const addFocusCallback = (fc: focusCallback) => {
    setFocusCbs([...focusCbs, fc])
  }

  const focusContextValue = {
    callbacks: focusCbs,
    addElementToContext: addFocusCallback,
  }

  //LOADING SCREEN WHEN NO DOC DATA
  if (!currentDocDetails) {
    return <Loading />
  }

  return (
    <CurrentDocContext.Provider value={currentDocDetails}>
      <MenuState.Provider value={menuContextValue}>
        <CurrentThemeContext.Provider value={themeObj}>
          <FocusContext.Provider value={focusContextValue}>
            <StyledEditorPage
              onClick={handleEditorClicks}
              // onKeyDown={handleShortcuts}
              style={{
                backgroundColor: `rgb(${rgbObjToString(doc_bg_colour.colour)})`,
                color: `rgb(${rgbObjToString(font_colour.colour)})`,
              }}
            >
              <Canvas />
              {showLeftSb && <LeftSidebar />}
              {showRightSb && <RightSidebar />}
            </StyledEditorPage>
            {popUpFor !== null && <PopUpWindow />}
          </FocusContext.Provider>
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
