import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { initialState } from "./initialState"
import {
  DocumentInterface,
  DocumentPreviewInterface,
  HeadingElement,
  ParapraphElement,
} from "../../types"

const documentsSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {
    disableAddingElements: (state) => {
      state.disableElementsAdding = true
    },
    enableAddingElements: (state) => {
      state.disableElementsAdding = false
    },
    createDoc: (
      state,
      { payload }: PayloadAction<{ projectId: number | null }>,
    ) => {
      const newDocPreview: DocumentPreviewInterface = {
        _id: Math.round(Math.random() * 10000),
        projectId: payload.projectId,
        title: "New doc",
        createdOn: new Date().getTime(),
      }
      const newDoc: DocumentInterface = { ...newDocPreview }
      state.documents = [...state.documents, newDocPreview]
    },
    deleteDoc: (state, { payload }: PayloadAction<number>) => {
      state.documents = state.documents.filter((doc) => doc._id !== payload)
    },
    renameDoc: (
      state,
      {
        payload: { newTitle, docId },
      }: PayloadAction<{ docId?: number | undefined; newTitle: string }>,
    ) => {
      const targetDocId = docId ?? state.activeDocumentId
      state.documents = state.documents.map((doc) => {
        if (doc._id === targetDocId) {
          return { ...doc, title: newTitle }
        }
        return doc
      })
    },
    setDocAsCurrent: (state, { payload }: PayloadAction<number>) => {
      state.activeDocumentId = payload
      //Untill persist functionality is created
      state.activeContent.docId = payload
    },
    toggleBegingsWithTitle: (state) => {
      state.beginsWithTitle = !state.beginsWithTitle
    },
    addHeading: (
      state,
      {
        payload: { level, after },
      }: PayloadAction<{ level: 1 | 2 | 3; after?: number }>,
    ) => {
      let content = "Main heading"
      switch (level) {
        case 2:
          content = "Medium heading"
          break
        case 3:
        default:
          content = "Small heading"
          break
      }
      const orderIdx = after ?? state.activeContent.components.length
      const id = new Date().getMilliseconds()
      const newHeading: HeadingElement = {
        id,
        type: "heading",
        level,
        content,
        orderIdx,
      }
      state.disableElementsAdding = true
      try {
        const newComponents = [...state.activeContent.components, newHeading]
        state.activeContent.components = newComponents
        state.currentElementId = id
      } catch (e) {
        alert("Couldn't add new heading")
      }
      state.disableElementsAdding = false
    },
    setHeadingLevel: (
      state,
      { payload }: PayloadAction<{ newLevel: 1 | 2 | 3; headingElId: number }>,
    ) => {
      state.activeContent.components = state.activeContent.components.map(
        (component) => {
          if (component.id === payload.headingElId) {
            try {
              const heading = component as HeadingElement
              return { ...heading, level: payload.newLevel }
            } catch (e) {
              console.log(
                "HEADING LEVEL CHANGE: Smth went wrong while changing " +
                  payload.headingElId +
                  " heading level",
              )
              return component
            }
          }
          return component
        },
      )
    },
    addParagraph: (state, { payload }: PayloadAction<{ after?: number }>) => {
      const orderIdx = payload.after ?? state.activeContent.components.length
      const newPEl: ParapraphElement = {
        id: new Date().getMilliseconds(),
        type: "paragraph",
        content: "",
        orderIdx,
      }
      const newElements = [...state.activeContent.components, newPEl]
      state.activeContent.components = newElements
    },
  },
})

export default documentsSlice.reducer

export const {
  disableAddingElements,
  enableAddingElements,
  createDoc,
  deleteDoc,
  renameDoc,
  setDocAsCurrent,
  toggleBegingsWithTitle,
  addHeading,
  setHeadingLevel,
  addParagraph,
} = documentsSlice.actions
