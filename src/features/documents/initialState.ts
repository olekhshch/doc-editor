import {
  ContentComponentType,
  DocumentContent,
  DocumentPreviewInterface,
  ParagraphElement,
} from "../../types"

export type activeElementInColumn = [number, number, "left" | "right"] //element id, column id, column side

export interface DocumentsState {
  documents: DocumentFull[]
  activeDocumentId: number | null
  activeDocumentInfo: DocumentPreviewInterface | null
  activeContent: DocumentContent | null
  beginsWithTitle: boolean
  activeElementId: number | null | activeElementInColumn
  activeElementType: ContentComponentType | null
  disableElementsAdding: boolean
}

export interface DocumentFull {
  documentInfo: DocumentPreviewInterface
  content: DocumentContent
  styling?: any
}

export const initialParagraph: ParagraphElement = {
  _id: 0,
  type: "paragraph",
  content: [{ type: "paragraph", content: [] }],
}

export const initialState: DocumentsState = {
  documents: [],
  activeDocumentId: null,
  activeDocumentInfo: null,
  activeContent: null,
  beginsWithTitle: true,
  activeElementId: null,
  activeElementType: null,
  disableElementsAdding: true,
}
