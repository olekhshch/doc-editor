import {
  DocumentContent,
  DocumentPreviewInterface,
  ParagraphElement,
} from "../../types"

export type activeElementInColumn = [number, number, "left" | "right"] //element id, column id, column side

export interface DocumentsState {
  documents: DocumentFull[]
  activeDocumentId: number | null
  activeDocumentInfo: DocumentPreviewInterface | null
  activeContent: DocumentContent | undefined
  beginsWithTitle: boolean
  activeElementId: number | null | activeElementInColumn
  disableElementsAdding: boolean
}

export interface DocumentFull {
  documentInfo: DocumentPreviewInterface
  content: DocumentContent
  styling?: any
}

export const initialState: DocumentsState = {
  documents: [],
  activeDocumentId: null,
  activeDocumentInfo: null,
  activeContent: {
    _id: 987,
    docId: 123,
    components: [],
  },
  beginsWithTitle: true,
  activeElementId: null,
  disableElementsAdding: true,
}

export const initialParagraph: ParagraphElement = {
  _id: 0,
  type: "paragraph",
  content: [{ type: "paragraph", content: [{ type: "text", text: " " }] }],
}
