import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { initialState } from "./initialState"
import {
  ColumnsElement,
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
      {
        payload,
      }: PayloadAction<{
        newLevel: 1 | 2 | 3
        headingElId: number
        column: null | [number, "left" | "right"]
      }>,
    ) => {
      const setNewLevelCb = (element: DocContentComponent) => {
        if (element._id === payload.headingElId) {
          return { ...element, level: payload.newLevel }
        }
        return element
      }

      state.activeContent!.components = state.activeContent!.components.map(
        (component) => {
          //if header is a part of a column
          if (payload.column !== null) {
            const [columnId, side] = payload.column

            if (component._id === columnId && component.type === "columns") {
              const updatedSide = component[side].map((el) => setNewLevelCb(el))
              return { ...component, [side]: updatedSide }
            }
            return component
          }
          //if not part of a column
          return setNewLevelCb(component as DocContentComponent)
        },
      )
    },
    setHeadingContent: (
      state,
      { payload }: PayloadAction<{ headingId?: number; newContent: string }>,
    ) => {
      const targetId = payload.headingId ?? state.activeElementId
      if (state.activeContent && targetId !== null) {
        state.activeContent.components = state.activeContent.components.map(
          (element) => {
            if (element._id === targetId) {
              if (element.type === "heading") {
                const newValue =
                  payload.newContent.trim() !== ""
                    ? payload.newContent
                    : element.content
                return { ...element, content: newValue }
              }
            }
            return element
          },
        )
      }
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
    deleteElement: (
      state,
      {
        payload,
      }: PayloadAction<{
        elementId: number
        column: null | [number, "left" | "right"]
      }>,
    ) => {
      const deleteElementCb = (element: DocContentComponent | ColumnsElement) =>
        element._id !== payload.elementId

      if (state.activeContent) {
        if (payload.column === null) {
          state.activeContent.components =
            state.activeContent.components.filter((el) => deleteElementCb(el))
        } else {
          const [columnId, side] = payload.column

          state.activeContent.components = state.activeContent.components.map(
            (component) => {
              if (component._id === columnId && component.type === "columns") {
                const updatedSide = component[side].filter((el) =>
                  deleteElementCb(el),
                )
                return { ...component, [side]: updatedSide }
              }
              return component
            },
          )
        }
      }
    },
    insertColumn: (
      state,
      { payload }: PayloadAction<{ elementId: number; side: "right" | "left" }>,
    ) => {
      if (state.activeContent)
        state.activeContent.components = state.activeContent.components.map(
          (element) => {
            if (
              element._id === payload.elementId &&
              element.type !== "columns"
            ) {
              const { _id, orderIndex } = element
              if (payload.side === "left") {
                const newElement: ColumnsElement = {
                  _id,
                  orderIndex,
                  type: "columns",
                  left: [element],
                  right: [],
                }
                return newElement
              }
              const newElement: ColumnsElement = {
                _id,
                orderIndex,
                type: "columns",
                left: [],
                right: [element],
              }
              return newElement
            }
            return element
          },
        )
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
  setHeadingContent,
  addParagraph,
  moveElement,
  deleteElement,
  insertColumn,
} = documentsSlice.actions
