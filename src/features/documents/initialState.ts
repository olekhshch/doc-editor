import { DocumentContent, DocumentPreviewInterface } from "../../types"

export interface DocumentsState {
  documents: DocumentPreviewInterface[]
  activeDocumentId: number | null
  activeContent: DocumentContent
  begginsWithTitle: boolean
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
  begginsWithTitle: true,
}
