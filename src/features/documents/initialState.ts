import {
  DocumentContent,
  DocumentPreviewInterface,
  ParagraphElement,
} from "../../types"

export type activeElementInColumn = [number, number, "left" | "right"] //element id, column id, column side

export interface DocumentsState {
  documents: DocumentPreviewInterface[]
  activeDocumentId: number | null
  activeContent: DocumentContent | undefined
  cachedContents: DocumentContent[]
  beginsWithTitle: boolean
  activeElementId: number | null | activeElementInColumn
  disableElementsAdding: boolean
}

export const initialState: DocumentsState = {
  documents: [
    {
      _id: 123,
      createdOn: 1234232222,
      projectId: null,
      title: "Test first doc",
    },
  ],
  activeDocumentId: 123,
  activeContent: {
    _id: 987,
    docId: 123,
    components: [],
  },
  cachedContents: [],
  beginsWithTitle: true,
  activeElementId: null,
  disableElementsAdding: true,
}
