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
  const { readJSONContent, validateJSON } = usePersist()

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
  }, [dispatch, file, navigation, readJSONContent, validateJSON])

  return (
    <StyledRoot>
      <Bg />
      <div className="root-wrapper">
        <section id="root-main-panel">
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
          {templates.length > 0 && (
            <>
              <p>Manage styling templates: </p>
              <StylingTemplatesList templates={templates} />
            </>
          )}
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

  input[type="file"] {
    display: none;
  }
`
