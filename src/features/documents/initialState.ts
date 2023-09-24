import { DocumentInterface, DocumentPreviewInterface } from "../../types"

export interface DocumentsState {
  documents: DocumentPreviewInterface[]
  activeDocument: DocumentInterface | null
}

export const initialState: DocumentsState = {
  documents: [],
  activeDocument: null,
}
