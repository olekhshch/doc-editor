import React, { useContext, useState, useEffect } from "react"
import styled from "styled-components"
import { CurrentThemeContext, MenuState } from "./Editor"
import { BsCardText, BsListNested } from "react-icons/bs"
import { useNavigate } from "react-router-dom"
import { BiHeading, BiImage } from "react-icons/bi"
import { ImTable } from "react-icons/im"
import { CgFormatSeparator } from "react-icons/cg"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  addHeading,
  addParagraph,
  addSeparator,
  addTable,
} from "../../features/documents/documentsSlice"
import DocNavigation from "./sidebarMenus/DocNavigation"
import useDocElements from "../../app/useDocElements"

const MainToolbar = () => {
  const { showLeftSb, showRightSb } = useContext(MenuState)
  const { gray, main } = useContext(CurrentThemeContext)

  const {
    getVerticalPosition,
    elementRef,
    addHeadingElement,
    addParagraphElement,
    addSeparatorElement,
    addTableElement,
  } = useDocElements()
  const [toolbarFixed, setToolbarFixed] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (elementRef.current) {
        const v_position = getVerticalPosition()
        if (v_position < -60) {
          setToolbarFixed(true)
        } else if (window.scrollY < 20) {
          setToolbarFixed(false)
        }
      }
    }

    document.addEventListener("scroll", handleScroll)

    return () => document.removeEventListener("scroll", handleScroll)
  }, [elementRef, getVerticalPosition])

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { setPopUpFor } = useContext(MenuState)
  const { activeTheme } = useAppSelector((state) => state.styling.parameters)
  //#TODO: Nav btn
  //#TODO: Style btns
  //#TODO: Doc Navigation align headings

  if (showLeftSb && showRightSb) {
    return <></>
  }

  //ADD ELEMENTS FUNCTIONS

  const addHeadingEl = (e: React.MouseEvent) => {
    dispatch(addHeading({ level: 2, column: null }))
    e.stopPropagation()
  }

  const addParagraphEl = (e: React.MouseEvent) => {
    dispatch(addParagraph({ column: null }))
    e.stopPropagation()
  }

  const addSeparatorEl = (e: React.MouseEvent) => {
    dispatch(addSeparator({ currentTheme: activeTheme }))
    e.stopPropagation()
  }

  const addImageEl = (e: React.MouseEvent) => {
    setPopUpFor("new_image")
    e.stopPropagation()
  }

  const addTableEl = (e: React.MouseEvent) => {
    dispatch(addTable({ rows: 2, columns: 3, column: null }))
    e.stopPropagation()
  }

  return (
    <StyledMainToolbar
      $gray={gray}
      $main={main}
      id="main-toolbar"
      ref={elementRef}
      style={{ position: toolbarFixed ? "fixed" : "unset" }}
    >
      {!showLeftSb && (
        <>
          <div className="left-sb-section">
            <button className="back-btn" onClick={() => navigate("/")}>
              {"<"}
            </button>
            <button>
              <BsListNested />
              <section className="window">
                <DocNavigation />
              </section>
            </button>
          </div>
          <div className="divider" />
        </>
      )}
      <div className="add-btns">
        <button title="add header" onClick={addHeadingElement}>
          <BiHeading />
        </button>
        <button title="add text block" onClick={addParagraphElement}>
          <BsCardText />
        </button>
        <button title="add image" onClick={addImageEl}>
          <BiImage />
        </button>
        <button title="add table" onClick={addTableElement}>
          <ImTable />
        </button>
        <button title="add separator" onClick={addSeparatorElement}>
          <CgFormatSeparator />
        </button>
      </div>
      <div className="divider" />
    </StyledMainToolbar>
  )
}

export default MainToolbar

type styledProps = {
  $gray: string
  $main: string
}

const StyledMainToolbar = styled.aside<styledProps>`
  margin: 12px auto;
  padding: 12px;

  z-index: 600;
  width: 100%;
  max-width: 80vw;
  height: 32px;
  box-shadow: 0 0 12px ${(props) => props.$gray};
  border-radius: 8px;
  display: flex;
  gap: 12px;
  align-items: center;
  background-color: white;

  .divider {
    width: 2px;
    height: 100%;
    background-color: ${(props) => props.$gray};
  }

  button {
    padding: 4px;
    height: 24px;
    min-width: 24px;
    background-color: transparent;
    border: 1px solid ${(props) => props.$gray};
    border-radius: 4px;
    display: flex;
    justify-content: center;
  }

  button:hover {
    border-color: ${(props) => props.$main};
    color: ${(props) => props.$main};
  }

  .toggle-mode-btn {
    color: ${(props) => props.$gray};
    border-radius: 10px;
  }

  .toggle-mode-btn:hover {
    color: ${(props) => props.$main};
  }

  .right-sb-section {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .left-sb-section {
    position: relative;
    display: flex;
    gap: 4px;
  }

  .window {
    padding: 4px 8px;
    position: absolute;
    z-index: 200;
    top: 36px;
    left: 12px;
    width: 240px;
    box-shadow: 0 0 4px ${(props) => props.$gray};
    border-radius: 8px;
    background-color: white;
    color: black;
  }

  .back-btn {
    background-color: ${(props) => props.$main};
    color: white;
  }

  .add-btns {
    display: flex;
    gap: 4px;
  }
`
