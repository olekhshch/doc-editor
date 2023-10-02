import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { initialState } from "./initialState"
import { DocumentInterface, DocumentPreviewInterface } from "../../types"

const documentsSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {
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
        payload: { docId, newTitle },
      }: PayloadAction<{ docId: number; newTitle: string }>,
    ) => {
      console.log({ docId, newTitle })
      state.documents = state.documents.map((doc) => {
        if (doc._id === docId) {
          return { ...doc, title: newTitle }
        }
        return doc
      })
    },
  },
})

export default documentsSlice.reducer

export const { createDoc, deleteDoc, renameDoc } = documentsSlice.actions
