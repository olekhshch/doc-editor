import React, { useEffect, useState, useRef } from "react"
import styled from "styled-components"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { useNavigate } from "react-router-dom"
import {
  createNewDoc,
  setDocumentFromObject,
} from "../../features/documents/documentsSlice"
import DocumentsList from "./DocumentsList"
import StylingManager from "../editor/sidebarMenus/StylingManager"
import StylingTemplatesList from "./StylingTemplatesList"
import Bg from "./Bg"
import AppButton from "../../components/AppButton"
import usePersist from "../../app/usePersist"
import { DocumentContent, DocumentPreviewInterface } from "../../types"

const Root = () => {
  const dispatch = useAppDispatch()
  const navigation = useNavigate()
  const { validateJSON } = usePersist()

  const { documents } = useAppSelector((state) => state.documents)
  const { templates } = useAppSelector((state) => state.styling)

  const handleNewDocCreation = () => {
    dispatch(createNewDoc())
    navigation("/docs")
  }

  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const triggerFileUpload = () => {
    fileInputRef.current!.click()
  }

  const handleFileUpload = () => {
    const { files } = fileInputRef.current!
    if (files && files.length > 0) {
      setFile(files[0])
    }
  }

  useEffect(() => {
    if (file) {
      const reader = new FileReader()

      reader.addEventListener("load", () => {
        const result = reader.result as string
        try {
          const fetchedJSON = JSON.parse(result)

          const isValid = validateJSON(fetchedJSON)
          if (isValid) {
            dispatch(
              setDocumentFromObject({
                content: fetchedJSON.content as DocumentContent,
                docInfo: fetchedJSON.docInfo as DocumentPreviewInterface,
              }),
            )
            navigation("/docs")
          }
        } catch (err) {
          console.log("COULDNT LOAD FROM FILE")
        }
      })

      reader.readAsText(file)
    }
  }, [dispatch, file, navigation, validateJSON])

  return (
    <StyledRoot>
      <Bg />
      <div className="margin" />
      <div className="root-wrapper">
        <section className="root-panel" id="recent-docs">
          <div className="flex" style={{ gap: "12px", alignItems: "center" }}>
            <h3>Recent docs</h3>
          </div>
        </section>
        <section className="root-panel" id="create-doc-panel">
          <div className="flex" style={{ gap: "12px", alignItems: "center" }}>
            <span>Create</span>
            <span>a</span>
            <AppButton
              title="New page"
              onClick={handleNewDocCreation}
              isMain={true}
            />
            <span> or </span>
            <AppButton
              isMain={true}
              title="Load from file"
              onClick={triggerFileUpload}
            />
            <input
              type="file"
              accept="application/json"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
          </div>
        </section>
        <section className="root-panel" id="tutorials">
          <div className="flex" style={{ gap: "12px", alignItems: "center" }}>
            <h3>Documentation</h3>
          </div>
        </section>
      </div>
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

  #canvas-bg {
    position: absolute;
  }

  @keyframes moving {
    from {
      width: 240px;
    }

    to {
      width: 650px;
    }
  }

  @keyframes appearance {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  .root-wrapper {
    /* position: fixed; */
    margin-right: 48px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    width: 100%;
    max-width: 100vw;
    min-height: 100vh;

    /* animation: moving 2s forwards; */
  }

  .root-panel {
    padding: 36px 48px;
    margin-right: auto;
    margin-left: auto;
    min-width: 440px;
    height: fit-content;
    color: var(--main);
    background-color: rgba(250, 228, 247, 0.523);
    border-radius: 14px;
    flex-shrink: 0;

    display: flex;
    justify-content: center;
    /* gap: 8px; */
    align-items: center;
    backdrop-filter: blur(12px);
    opacity: 0;
  }

  .root-panel-wrapper {
    display: flex;
  }

  .margin {
    width: 240px;
    flex-shrink: 1;
    background-color: transparent;

    animation: moving 2s forwards;
  }

  #create-doc-panel {
    margin-left: unset;
    animation: appearance 1s forwards;
    font-size: 24px;
  }

  @media screen and (max-width: 700px) {
    .margin {
      display: none;
    }

    #create-doc-panel {
      margin-left: auto;
    }
  }

  #recent-docs {
    animation: appearance 1s 1s forwards;
  }

  #tutorials {
    animation: appearance 1s 0.4s forwards;
  }

  .main-btn {
    padding: 8px 12px;
    /* border: 1px solid var(--main-light); */
    border: none;
    border-radius: 4px;
    background-color: var(--main);
    color: white;
  }

  input[type="file"] {
    display: none;
  }
`
