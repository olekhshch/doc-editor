import React from "react"
import { useAppDispatch, useAppSelector } from "./hooks"
import {
  cacheActiveDoc,
  disableAddingElements,
  enableAddingElements,
  setDocumentFromObject,
} from "../features/documents/documentsSlice"
import { StylingTemplate } from "../features/styling/initialState"
import { setStylingTemplates } from "../features/styling/stylingSlice"
import { useNavigate } from "react-router-dom"
import { DocumentContent, DocumentPreviewInterface } from "../types"
import { DocumentFull } from "../features/documents/initialState"

export type LocalStorageKey = "styling_templates" | "documents"

const usePersist = () => {
  const dispatch = useAppDispatch()
  const stylingState = useAppSelector((state) => state.styling)
  const { activeContent, activeDocumentInfo, documents } = useAppSelector(
    (state) => state.documents,
  )

  //WHEN PERSISTING DOC STATE = remove focus callbacks

  //LOCAL STORAGE
  function getLocalStorageValue(key: LocalStorageKey) {
    const strValue = localStorage.getItem(key)

    if (strValue) {
      const jsValue = JSON.parse(strValue)
      return jsValue
    }

    return null
  }

  /**
   * updates data in the local storage, return JS obj of persisted data
   *
   * @param key local storage key
   */
  function saveToLocalStorage(key: LocalStorageKey) {
    // dispatch(disableAddingElements())

    let value: any = null
    let stringifiedValue: string = ""

    switch (key) {
      case "styling_templates":
        //adding to other templates if exists and stringifing the array for LS
        value = [...stylingState.templates] as StylingTemplate[]

        // stringifiedValue = JSON.stringify(value)
        break
      case "documents":
        if (activeContent !== null) {
          const active_value = {
            documentInfo: activeDocumentInfo,
            content: activeContent,
          } as DocumentFull

          const targetIdx = documents.findIndex(
            (doc) => doc.documentInfo._id === active_value.documentInfo._id,
          )

          if (targetIdx >= 0) {
            value = [...documents]
            value[targetIdx] = active_value
          } else {
            value = [...documents, active_value]
          }
        }
        break
    }
    stringifiedValue = JSON.stringify(value)
    localStorage.setItem(key, stringifiedValue)

    return value
  }

  /**
   * Saves current styling parameters to the local storage
   */
  function saveStylingTemplates_LS(updateStore?: boolean) {
    const templates = saveToLocalStorage("styling_templates")
    // if (updateStore === true) {
    //   dispatch(setStylingTemplates(templates))
    // }
  }

  function getStylingTemplates_LS() {
    const stylingTemplates = getLocalStorageValue("styling_templates")
    //validation
    if (!Array.isArray(stylingTemplates)) {
      return [] as StylingTemplate[]
    }

    return (stylingTemplates ?? []) as StylingTemplate[]
  }

  function getCachedDocuments_LS() {
    const docs = getLocalStorageValue("documents")

    if (!Array.isArray(docs)) {
      return [] as DocumentFull[]
    }

    return (docs ?? []) as DocumentFull[]
  }

  function saveAllDocuments_LS() {
    const docState = saveToLocalStorage("documents")
  }

  //JSON

  //DOC STATE
  function downloadToJSON(e: React.MouseEvent) {
    e.stopPropagation()
    const basicDocJSON = { content: activeContent, docInfo: activeDocumentInfo }
    const content = JSON.stringify(basicDocJSON, null, 2)
    const file = new Blob([content], { type: "json" })

    const fileURL = URL.createObjectURL(file)
    const a = document.createElement("a")
    a.href = fileURL
    a.download = `${activeDocumentInfo?.title ?? "Doc"}.json`
    a.click()
    a.remove()
  }

  //STYLING

  function downloadStylingToJSON() {
    const creationDate = new Date()
    const styling: StylingTemplate = {
      _id: creationDate.getTime(),
      name: `Styling`,
      state: stylingState.parameters,
    }
    const styling_string = JSON.stringify(styling, null, 2)
    const file = new Blob([styling_string], { type: "json" })

    const fileURL = URL.createObjectURL(file)
    const a = document.createElement("a")
    a.href = fileURL
    a.download = `${styling.name}.json`
    a.click()
    a.remove()
  }

  //VALIDATION
  const validateDocJSON = (JSONFile: any) => {
    const keys = Object.keys(JSONFile)

    return keys.includes("content") && keys.includes("docInfo")
  }

  return {
    saveStylingTemplates_LS,
    getStylingTemplates_LS,
    downloadToJSON,
    downloadStylingToJSON,
    validateDocJSON,
    saveAllDocuments_LS,
    getCachedDocuments_LS,
  }
}

export default usePersist
