import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { initialState } from "./initialState"
import {
  DocContentComponent,
  DocumentInterface,
  DocumentPreviewInterface,
  HeadingElement,
  ParagraphElement,
} from "../../types"
import { reoderArray } from "../../functions/reorderArray"

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
      //check if content was cached
      const cachedDoc = state.cachedContents.find(
        (content) => content.docId === payload,
      )
      if (cachedDoc) {
        console.log("CONTENT FOUND IN THE CACHE")
        state.activeContent = cachedDoc
      } else {
        //Untill persist functionality is created

        const initialParagraph: ParagraphElement = {
          _id: new Date().getMilliseconds(),
          type: "paragraph",
          content: "empty par",
          orderIndex: 0,
        }

        state.activeContent = {
          _id: 100000000,
          docId: payload,
          components: [initialParagraph],
        }
      }
    },
    cacheContent: (state) => {
      const alreadyCached = state.cachedContents.find(
        (content) => content.docId === state.activeDocumentId,
      )
      if (state.activeContent && !alreadyCached) {
        state.cachedContents = [
          ...state.cachedContents,
          { ...state.activeContent },
        ]
      }
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
      const orderIndex = after ?? state.activeContent!.components.length
      const _id = new Date().getMilliseconds()
      const newHeading: HeadingElement = {
        _id,
        type: "heading",
        level,
        content,
        orderIndex,
      }
      state.disableElementsAdding = true
      try {
        const newComponents = [...state.activeContent!.components, newHeading]
        state.activeContent!.components = newComponents
        state.activeElementId = _id
      } catch (e) {
        alert("Couldn't add new heading")
      }
      state.disableElementsAdding = false
    },
    setHeadingLevel: (
      state,
      { payload }: PayloadAction<{ newLevel: 1 | 2 | 3; headingElId: number }>,
    ) => {
      state.activeContent!.components = state.activeContent!.components.map(
        (component) => {
          if (component._id === payload.headingElId) {
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
      const orderIndex = payload.after ?? state.activeContent!.components.length
      const newPEl: ParagraphElement = {
        _id: new Date().getMilliseconds(),
        type: "paragraph",
        content: "",
        orderIndex,
      }
      const newElements = [...state.activeContent!.components, newPEl]
      state.activeContent!.components = newElements
    },
    setActiveElementId: (state, { payload }: PayloadAction<number | null>) => {
      state.activeElementId = payload
    },
    moveElement: (
      state,
      {
        payload,
      }: PayloadAction<{ elementId: number; newPlacementIdx: number }>,
    ) => {
      const oldElements = [...state.activeContent!.components]
      try {
        const newProjects = reoderArray(
          oldElements,
          payload.elementId,
          payload.newPlacementIdx,
        ) as DocContentComponent[]
        state.activeContent!.components = newProjects.map((project, idx) => ({
          ...project,
          orderIndex: idx,
        }))
      } catch (e) {
        state.activeContent!.components = oldElements
      }
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
  cacheContent,
  toggleBegingsWithTitle,
  setActiveElementId,
  addHeading,
  setHeadingLevel,
  addParagraph,
  moveElement,
} = documentsSlice.actions
