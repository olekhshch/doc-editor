import React, { useCallback, useContext } from "react"
import styled from "styled-components"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import MainTitle from "./canvasElements/MainTitle"
import Elements from "./canvasElements/Elements"
import { CurrentDocContext, CurrentThemeContext } from "./Editor"
import MainToolbar from "./MainToolbar"
import { BiHide, BiShowAlt } from "react-icons/bi"
import { toggleBegingsWithTitle } from "../../features/documents/documentsSlice"
import { IconContext } from "react-icons"
import useDocElements from "../../app/useDocElements"

const ContentCanvas = () => {
  const { beginsWithTitle } = useAppSelector((state) => state.documents)
  const { canvas_width } = useAppSelector((state) => state.styling.parameters)
  const { maxWidth, focusLast } = useDocElements()

  const docContext = useContext(CurrentDocContext)
  const { main } = useContext(CurrentThemeContext)

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      focusLast()
    },
    [focusLast],
  )

  if (!docContext) {
    return <></>
  }

  const { title, _id, readonly } = docContext

  return (
    <StyledContentContainer>
      <div id="main_wrapper" onClick={(e) => handleClick(e)}>
        <MainToolbar />
        {!readonly && (
          <ShowTitleBtn beginsWithTitle={beginsWithTitle} mainColour={main} />
        )}
        {beginsWithTitle && <MainTitle docId={_id} docTitle={title} />}
        <Elements />
      </div>
    </StyledContentContainer>
  )
}

export default ContentCanvas

const StyledContentContainer = styled.main`
  position: relative;
  left: 0;
  right: 0;
  /* flex-basis: 297mm; */
  /* min-width: 297mm; */
  min-width: 100vw;
  display: flex;
  justify-content: center;
  min-height: 100vh;
  font-family: var(--font-2);
  /* overflow: hidden; */

  #main_wrapper {
    padding: 0 var(--editor-left-mg) 0 0;
    margin: 0 auto;
    min-width: 540px;
    max-width: 70vw;
    /* width: 100%; */
    flex-grow: 1;
    width: fit-content;
  }

  .show-title-btn {
    opacity: 0;
    border: none;
    background: none;
  }

  #show-title-btn-wrap {
    position: absolute;
    text-align: center;
    width: 60px;
    height: 60px;
  }

  #show-title-btn-wrap:hover .show-title-btn {
    opacity: 0.3;
  }

  #show-title-btn-wrap:hover .show-title-btn:hover {
    opacity: 1;
  }

  /* border: 1px solid blue; */
`

const ShowTitleBtn = ({
  beginsWithTitle,
  mainColour,
}: {
  beginsWithTitle: boolean
  mainColour: string
}) => {
  const dispatch = useAppDispatch()

  return (
    <IconContext.Provider value={{ size: "1.6em", color: mainColour }}>
      <div id="show-title-btn-wrap">
        <button
          title={beginsWithTitle ? "Hide title" : "Show title"}
          className="show-title-btn"
          onClick={() => dispatch(toggleBegingsWithTitle())}
        >
          {!beginsWithTitle ? <BiShowAlt /> : <BiHide />}
        </button>
      </div>
    </IconContext.Provider>
  )
}
