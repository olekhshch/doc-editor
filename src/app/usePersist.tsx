import React from "react"
import { useAppDispatch, useAppSelector } from "./hooks"
import {
  disableAddingElements,
  enableAddingElements,
} from "../features/documents/documentsSlice"
import { StylingTemplate } from "../features/styling/initialState"
import { setStylingTemplates } from "../features/styling/stylingSlice"

export type LocalStorageKey = "styling_templates" | "docContent"

const usePersist = () => {
  const dispatch = useAppDispatch()
  const stylingState = useAppSelector((state) => state.styling)

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
    dispatch(disableAddingElements())

    let value: any = null
    let stringifiedValue: string = ""

    switch (key) {
      case "styling_templates":
        //adding to other templates if exists and stringifing the array for LS
        value = [...stylingState.templates] as StylingTemplate[]

        stringifiedValue = JSON.stringify(value)
    }

    localStorage.setItem(key, stringifiedValue)

    dispatch(enableAddingElements())

    return value
  }

  /**
   * Saves current styling parameters to the local storage
   */
  function saveStylingTemplates_LS(updateStore?: boolean) {
    const templates = saveToLocalStorage("styling_templates")
    if (updateStore === true) {
      dispatch(setStylingTemplates(templates))
    }
  }

  function getStylingTemplates_LS() {
    const stylingTemplates = getLocalStorageValue("styling_templates")
    //validation
    if (!Array.isArray(stylingTemplates)) {
      return [] as StylingTemplate[]
    }

    return (stylingTemplates ?? []) as StylingTemplate[]
  }

  return { saveStylingTemplates_LS, getStylingTemplates_LS }
}

export default usePersist
