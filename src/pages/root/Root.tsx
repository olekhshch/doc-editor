import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { useNavigate } from "react-router-dom"
import { createNewDoc } from "../../features/documents/documentsSlice"
import DocumentsList from "./DocumentsList"
import StylingManager from "../editor/sidebarMenus/StylingManager"
import StylingTemplatesList from "./StylingTemplatesList"
import Bg from "./Bg"

const Root = () => {
  const dispatch = useAppDispatch()
  const navigation = useNavigate()

  const { documents } = useAppSelector((state) => state.documents)
  const { templates } = useAppSelector((state) => state.styling)

  const handleNewDocCreation = () => {
    dispatch(createNewDoc())
    navigation("/docs")
  }

  return (
    <StyledRoot>
      <Bg />
      <div className="root-wrapper">
        <section id="root-main-panel">
          <div className="flex" style={{ gap: "12px", alignItems: "center" }}>
            <span>Create</span>
            <span>a</span>
            <button className="main-btn" onClick={handleNewDocCreation}>
              {" "}
              New doc{" "}
            </button>
            <span> or </span>
            <button className="main-btn"> Load from file</button>
          </div>
          {templates && (
            <>
              <p>Manage styling templates: </p>
              <StylingTemplatesList templates={templates} />
            </>
          )}
        </section>
      </div>
      {/* <section id="root-main-panel">
        <article id="panel-content">
          <div className="flex" style={{ gap: "12px", alignItems: "center" }}>
            <span>Create</span>
            <span>a</span>
            <button className="main-btn" onClick={handleNewDocCreation}>
              {" "}
              New doc{" "}
            </button>
            <span> or </span>
            <button className="main-btn"> Load from file</button>
          </div> */}
      {/* <div>
            <p>Recent documents:</p>
            <DocumentsList docs={documents} />
          </div> */}
      {/* {templates.length > 0 && (
            <div>
              <p>Manage styling templates: </p>
              <StylingTemplatesList templates={templates} />
            </div>
          )}
        </article>
      </section> */}
    </StyledRoot>
  )
}

export default Root

const StyledRoot = styled.main`
  width: 100vw;
  height: 100vh;
  background-color: var(--main);
  display: flex;
  color: white;
  overflow: hidden;

  .root-wrapper {
    position: fixed;
    display: flex;
    width: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  #root-main-panel {
    margin: 48px auto;
    margin-right: 72px;
    padding: 36px 48px;
    min-width: 440px;
    min-height: 40vh;
    background-color: rgba(249, 239, 248, 0.4);
    border-radius: 12px;

    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    backdrop-filter: blur(12px);
  }

  .main-btn {
    padding: 8px 12px;
    /* border: 1px solid var(--main-light); */
    border: none;
    border-radius: 4px;
    background-color: var(--main);
    color: white;
  }

  /* #root-main-panel {
    position: absolute;
    width: 560px;
    top: 36px;
    left: calc(50% - calc(560 / 2));
    border-radius: 8px;
    height: fit-content;
    max-height: 90vh;
    max-width: 60vw;
    overflow: hidden;
    background-color: rgba(249, 239, 248, 0.4);
  }

  #panel-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  #panel-content div {
    left: 24px;
  }

  #canvas-bg {
    margin: 0;
    background-color: var(--main);
  }

  .main-btn {
    padding: 8px 12px;
    border: 1px solid var(--main-light);
    border-radius: 4px;
    background-color: var(--main);
    color: white;
  } */
`
