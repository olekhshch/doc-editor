import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import {
  activeElementInColumn,
  initialState,
  initialParagraph,
  DocumentsState,
  DocumentFull,
} from "./initialState"
import {
  BasicComponent,
  ColumnsElement,
  ContentComponentType,
  DocContentComponent,
  DocumentContent,
  DocumentInterface,
  DocumentPreviewInterface,
  HeadingElement,
  ParagraphElement,
  columnParam,
} from "../../types"
import { reoderArray } from "../../functions/reorderArray"
import { insertElementIntoArray } from "../../functions/insertElementIntoArray"
import { removeElementFromArray } from "../../functions/removeElementFromArray"
import addSeparator0 from "./separator/addSeparator"
import setSeparatorColourAction from "./separator/setSeparatorColour"
import addImageAction from "./image/addImage"
import setImageWidthAction from "./image/setImageWidth"
import setImageDescriptionAction from "./image/setImageDescription"
import setSeparatorWidthAction from "./separator/setSeparatorWidth"
import addHeadingAction from "./heading/addHeading"
import setHeadingLevelAction from "./heading/setHeadingLevel"
import setHeadingContentAction from "./heading/setHeadingContent"
import addTextBlockAction from "./textblock/addTextBlock"
import setTextBlockContentAction from "./textblock/setTextBlockContent"
import insertColumnAction from "./columns/insertColumn"
import deleteColumnSideAction from "./columns/deleteColumnSide"
import addElementsToState from "../../functions/addElementsToState"
import addTextBlockToEmptyColumnAction from "./textblock/addTextBlockToEmptyColumn"
import addTableAction from "./table/addTable"
import addRowAction from "./table/addRow"
import addColumnAction from "./table/addColumn"
import deleteRowAction from "./table/deleteRow"
import deleteColumnAction from "./table/deleteColumn"
import setCellContentAction from "./table/setCellContent"
import findElementFromState from "../../functions/findElementFromState"
import setTableColumnWidthAction from "./table/setColumnWidth"

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

    createNewDoc: (state) => {
      state.disableElementsAdding = true

      if (state.activeContent && state.activeDocumentInfo) {
        const docContentState = { ...state.activeContent }
        const idx = state.documents.findIndex(
          (document) => document.documentInfo._id === docContentState.docId,
        )

        const fullDoc: DocumentFull = {
          content: docContentState,
          documentInfo: state.activeDocumentInfo,
        }
        if (idx >= 0) {
          state.documents[idx] = fullDoc
        } else {
          state.documents = [...state.documents, fullDoc]
        }
      }
      const _id = Math.round(Math.random() * 1000000)
      const newDocumentInfo: DocumentPreviewInterface = {
        _id,
        title: "New doc",
        createdOn: new Date().getTime(),
      }

      const newDocContent: DocumentContent = {
        _id,
        docId: _id,
        components: [],
      }

      state.activeContent = newDocContent
      state.activeDocumentInfo = newDocumentInfo

      state.activeDocumentId = _id

      state.disableElementsAdding = false
    },

    // createDoc: (
    //   state,
    //   { payload }: PayloadAction<{ projectId: number | null }>,
    // ) => {
    //   const _id = Math.round(Math.random() * 1000000)
    //   const newDocPreview: DocumentPreviewInterface = {
    //     _id,
    //     projectId: payload.projectId,
    //     title: "New doc",
    //     createdOn: new Date().getTime(),
    //   }
    //   const newDoc: DocumentInterface = { ...newDocPreview }
    //   state.documents = [...state.documents, newDocPreview]
    // },

    deleteDoc: (state, { payload }: PayloadAction<number>) => {
      //#TODO: Document deletion
      // state.documents = state.documents.filter((doc) => doc._id !== payload)
    },

    renameDoc: (
      state,
      {
        payload: { newTitle, docId },
      }: PayloadAction<{ docId?: number | undefined; newTitle: string }>,
    ) => {
      //#TODO: Rename Doc functionality
      // const targetDocId = docId ?? state.activeDocumentId
      // state.documents = state.documents.map((doc) => {
      //   if (doc._id === targetDocId) {
      //     return { ...doc, title: newTitle }
      //   }
      //   return doc
      // })
    },

    setDocAsCurrent: (state, { payload }: PayloadAction<number>) => {
      // state.activeDocumentId = payload
      // //check if content was cached
      // const cachedDoc = state.cachedContents.find(
      //   (content) => content.docId === payload,
      // )
      // if (cachedDoc) {
      //   console.log("CONTENT FOUND IN THE CACHE")
      //   state.activeContent = cachedDoc
      // } else {
      //   //Untill persist functionality is created
      //   const _id = new Date().getMilliseconds()
      //   const initialP: ParagraphElement = {
      //     ...initialParagraph,
      //     _id,
      //   }
      //   state.activeContent = {
      //     _id: 100000000,
      //     docId: payload,
      //     components: [initialP],
      //   }
      // }
    },

    toggleBegingsWithTitle: (state) => {
      state.beginsWithTitle = !state.beginsWithTitle
    },

    addHeading: addHeadingAction,
    setHeadingLevel: setHeadingLevelAction,
    setHeadingContent: setHeadingContentAction,

    addParagraph: addTextBlockAction,
    setParagraphContent: setTextBlockContentAction,

    setActiveElementData: (
      state,
      {
        payload,
      }: PayloadAction<{
        id: number | null | activeElementInColumn
        type: ContentComponentType | null
      }>,
    ) => {
      state.activeElementId = payload.id
      state.activeElementType = payload.type
    },

    moveElement: (
      state,
      {
        payload,
      }: PayloadAction<{
        elementId: number
        newPlacementIdx: number
        columnSource: null | [number, "left" | "right"]
        columnTarget: null | [number, "left" | "right"]
      }>,
    ) => {
      const oldElements = [...state.activeContent!.components]
      try {
        if (payload.columnSource === null) {
          //moving element is not a part of a column
          if (payload.columnTarget === null) {
            //element is not moving into a column AND is not a column
            const newProjects = reoderArray(
              oldElements,
              payload.elementId,
              payload.newPlacementIdx,
            ) as DocContentComponent[]
            state.activeContent!.components = newProjects.map(
              (project, idx) => ({
                ...project,
                orderIndex: idx,
              }),
            )
          } else {
            //element is moving into a column

            //checking if moving element is not a ColumnsElement
            const sourceElement = state.activeContent?.components.find(
              (el) => el._id === payload.elementId,
            )
            const isNotColumnsElAndFound =
              sourceElement && sourceElement.type !== "columns"

            const [targetColumnId, targetSide] = payload.columnTarget

            const targetColumn = state.activeContent?.components.find(
              (el) => el._id === targetColumnId && el.type === "columns",
            ) as ColumnsElement | undefined

            if (targetColumn && isNotColumnsElAndFound) {
              //moving only if source elemnt is not ColumnsElement and targetColumn ss found
              const sideToUpdate = targetColumn[targetSide]
              const newSide0 = insertElementIntoArray(
                sourceElement,
                sideToUpdate,
                payload.newPlacementIdx,
              ) as DocContentComponent[]

              //fixing order Indexes
              const newSide = newSide0.map((el, idx) => ({
                ...el,
                orderIndex: idx,
              }))
              const newTargetColumnsEl: ColumnsElement = {
                ...targetColumn,
                [targetSide]: newSide,
              }

              //removing element from the old placement
              state.activeContent!.components =
                state.activeContent!.components.filter(
                  (el) => el._id !== payload.elementId,
                )

              //replacing old columnsEl with new one
              state.activeContent!.components =
                state.activeContent!.components.map((el) => {
                  if (el._id === targetColumnId) {
                    return newTargetColumnsEl
                  }
                  return el
                })
            }
          }
        } else {
          //moving element is a part of a column
          const [sourceColumnId, sourceColumnSide] = payload.columnSource

          //getting source column and source element
          const sourceColumnsEl = state.activeContent!.components.find(
            (el) => el._id === sourceColumnId && el.type === "columns",
          ) as ColumnsElement

          const sourceElement = sourceColumnsEl[sourceColumnSide].find(
            (el) => el._id === payload.elementId,
          )!

          if (payload.columnTarget !== null) {
            //element will be placed in a columns element
            const [targetColumnId, targetColumnSide] = payload.columnTarget

            if (
              targetColumnId === sourceColumnId &&
              targetColumnSide === sourceColumnSide
            ) {
              //element is placed in the same column => reorder operation
              const newSide0 = reoderArray(
                sourceColumnsEl[sourceColumnSide],
                payload.elementId,
                payload.newPlacementIdx,
              )
              //fixing order indexes
              const newSide = newSide0.map((el, idx) => ({
                ...el,
                // orderIndex: idx,
              })) as DocContentComponent[]

              //new ColumnsElement to replace the old one (with the old placement of element that was moved)
              const newColumnsEl: ColumnsElement = {
                ...sourceColumnsEl,
                [sourceColumnSide]: newSide,
              }
              state.activeContent!.components =
                state.activeContent!.components.map((el) => {
                  if (el._id === sourceColumnId) {
                    return newColumnsEl
                  }
                  return el
                })
            } else {
              //element is moved from one column to another

              //removing source element from the old column and fixing order indexes
              const newSourceSide = sourceColumnsEl[sourceColumnSide]
                .filter((el) => el._id !== payload.elementId)
                .map((el, idx) => ({ ...el, orderIndex: idx }))

              if (sourceColumnId === targetColumnId) {
                //if element is a part of the same ColumnsElement, but placed in a different column (side)
                const newTargetSide0 = insertElementIntoArray(
                  sourceElement,
                  sourceColumnsEl[targetColumnSide],
                  payload.newPlacementIdx,
                ) as DocContentComponent[]
                const newTargetSide = newTargetSide0.map((el, idx) => ({
                  ...el,
                  orderIndex: idx,
                }))

                const newSourceColumnsElement: ColumnsElement = {
                  ...sourceColumnsEl,
                  [sourceColumnSide]: newSourceSide,
                  [targetColumnSide]: newTargetSide,
                }

                state.activeContent!.components =
                  state.activeContent!.components.map((el) => {
                    if (el._id === sourceColumnId) {
                      return newSourceColumnsElement
                    }
                    return el
                  })
              } else {
                //element is placed from one columnsElement's side to another

                //ColumnsElement where element will be moved
                const targetColumnsElement =
                  state.activeContent!.components.find(
                    (el) => el._id === targetColumnId && el.type === "columns",
                  ) as ColumnsElement

                //source ColumnsElement without element that was moved
                const newSourceColumnsElement: ColumnsElement = {
                  ...sourceColumnsEl,
                  [sourceColumnSide]: newSourceSide,
                }

                //inserting moved element into a target column and fixing order indexes
                const newTargetSide0 = insertElementIntoArray(
                  sourceElement,
                  targetColumnsElement[targetColumnSide],
                  payload.newPlacementIdx,
                ) as DocContentComponent[]
                const newTargetSide = newTargetSide0.map((el, idx) => ({
                  ...el,
                  orderIndex: idx,
                }))

                //target ColumnsElement with the moved element
                const newTargetColumnsEl: ColumnsElement = {
                  ...targetColumnsElement,
                  [targetColumnSide]: newTargetSide,
                }

                state.activeContent!.components =
                  state.activeContent!.components.map((el) => {
                    if (el._id === sourceColumnId) {
                      return newSourceColumnsElement
                    }
                    if (el._id === targetColumnId) {
                      return newTargetColumnsEl
                    }
                    return el
                  })
              }
            }
          } else {
            //element is moved from a column to a canvas as a separate DocContent Element

            //removing element from the source columnsElement
            const newSourceSide = sourceColumnsEl[sourceColumnSide]
              .filter((el) => el._id !== payload.elementId)
              .map((el, idx) => ({ ...el, orderIndex: idx }))

            const newSourceColumnsElement: ColumnsElement = {
              ...sourceColumnsEl,
              [sourceColumnSide]: newSourceSide,
            }

            //inserting element in the components array
            const newComponents = insertElementIntoArray(
              sourceElement,
              oldElements,
              payload.newPlacementIdx,
            ) as (DocContentComponent | ColumnsElement)[]

            //fixing indexes and setting new source ColumnsElement (without moved element)
            state.activeContent!.components = newComponents.map((el, idx) => {
              if (el._id === sourceColumnId) {
                return { ...newSourceColumnsElement, orderIndex: idx }
              }
              return { ...el, orderIndex: idx }
            })
          }
        }
      } catch (e) {
        state.activeContent!.components = oldElements
      }
    },

    deleteActiveElement: (state) => {
      const oldContent = [...state.activeContent!.components]
      try {
        if (state.activeElementId !== null) {
          if (!Array.isArray(state.activeElementId)) {
            const targetId = state.activeElementId

            state.activeContent!.components = removeElementFromArray(
              targetId,
              oldContent,
            )
          } else {
            //active element is a part of a column
            const [targetId, columnId, columnSide] = state.activeElementId
            const targetColumnsEl = state.activeContent!.components.find(
              (el) => el._id === columnId && el.type === "columns",
            ) as ColumnsElement

            const newSide = removeElementFromArray(
              targetId,
              targetColumnsEl[columnSide],
            )
            const newColumn: ColumnsElement = {
              ...targetColumnsEl,
              [columnSide]: newSide,
            }

            state.activeContent!.components =
              state.activeContent!.components.map((el) => {
                if (el._id === columnId) {
                  return newColumn
                }
                return el
              })
          }
        }
      } catch (e) {
        state.activeContent!.components = oldContent
      }
      state.activeElementId = null
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
        const parId = Math.round(Math.random() * 100000)
        const newParEl: ParagraphElement = {
          ...initialParagraph,
          _id: parId,
        }

        if (payload.column === null) {
          state.activeContent.components =
            state.activeContent.components.filter((el) => deleteElementCb(el))

          if (state.activeContent.components.length === 0) {
            state.activeContent.components = [
              ...state.activeContent.components,
              newParEl,
            ]
          }
        } else {
          const [columnId, side] = payload.column

          state.activeContent.components = state.activeContent.components.map(
            (component) => {
              if (component._id === columnId && component.type === "columns") {
                const updatedSide = component[side].filter((el) =>
                  deleteElementCb(el),
                )
                if (updatedSide.length === 0) {
                  updatedSide.push(newParEl)
                }
                return { ...component, [side]: updatedSide }
              }
              return component
            },
          )
        }
        state.activeElementId = null
      }
    },

    addSeparator: addSeparator0,
    setColourForSeprator: setSeparatorColourAction,
    setSeparatorWidth: setSeparatorWidthAction,

    addImage: addImageAction,
    setImageWidth: setImageWidthAction,
    setImageDescription: setImageDescriptionAction,

    insertColumn: insertColumnAction,
    deleteSideOfColumn: deleteColumnSideAction,
    addTextBlockToEmptyColumn: addTextBlockToEmptyColumnAction,

    addTable: addTableAction,
    insertRowToTable: addRowAction,
    insertColumnToTable: addColumnAction,
    deleteTableRow: deleteRowAction,
    deleteTableColumn: deleteColumnAction,
    setTableCellContent: setCellContentAction,
    setTableColumnWidth: setTableColumnWidthAction,

    duplicateElement: (
      state,
      {
        payload,
      }: PayloadAction<{
        elementId: number
        column: columnParam
      }>,
    ) => {
      const { elementId, column } = payload
      const [targetEl, targetIdx] = findElementFromState(
        state.activeContent!.components,
        elementId,
        column,
      )

      if (targetEl) {
        const _id = new Date().getTime()
        const duplicate: BasicComponent = {
          ...targetEl,
          _id,
        }

        state.activeContent!.components = addElementsToState(
          state.activeContent!.components,
          targetEl._id,
          column,
          duplicate,
        ) as (DocContentComponent | ColumnsElement)[]
      }
      // if (payload.column === null) {
      //   //element is not a part of a column
      //   const targetElement = state.activeContent!.components.find(
      //     (el) => el._id === payload.elementId,
      //   )

      //   if (targetElement) {
      //     const duplicate: DocContentComponent | ColumnsElement = {
      //       ...targetElement,
      //       _id: new Date().getTime(),
      //     }
      //     //inserting duplicate after the original
      //     state.activeContent!.components = addElementsToState(
      //       state.activeContent!.components,
      //       payload.elementId,
      //       payload.column,
      //       duplicate,
      //     ) as (DocContentComponent | ColumnsElement)[]
      //   }
      // } else {
      //   //element is a part of a column
      //   const [columnId, side] = payload.column
      //   const targetColumn = state.activeContent!.components.find(
      //     (el) => el._id === columnId && el.type === "columns",
      //   ) as ColumnsElement | undefined

      //   if (targetColumn) {
      //     const targetColumnIdx = state.activeContent!.components.findIndex(
      //       (el) => el._id === columnId && el.type === "columns",
      //     )
      //     const targetElement = targetColumn[side].find(
      //       (el) => el._id === payload.elementId,
      //     ) as DocContentComponent | undefined

      //     if (targetElement) {
      //       const duplicate: DocContentComponent = {
      //         ...targetElement,
      //         _id: new Date().getTime(),
      //       }
      //       const newSide = addElementsToState(
      //         targetColumn[side],
      //         payload.elementId,
      //         null,
      //         duplicate,
      //       )
      //       const newColumn = { ...targetColumn, [side]: newSide }

      //       //replacing old columns with columns element with a duplicate
      //       state.activeContent!.components[targetColumnIdx] = newColumn
      //     }
      //   }
      // }
    },
  },
})

export default documentsSlice.reducer

export const {
  disableAddingElements,
  enableAddingElements,
  // createDoc,
  deleteDoc,
  renameDoc,
  setDocAsCurrent,
  toggleBegingsWithTitle,
  setActiveElementData,
  addHeading,
  setHeadingLevel,
  setHeadingContent,
  addParagraph,
  setParagraphContent,
  moveElement,
  deleteActiveElement,
  deleteElement,
  insertColumn,
  deleteSideOfColumn,
  duplicateElement,
  addSeparator,
  setColourForSeprator,
  addImage,
  setImageWidth,
  setImageDescription,
  setSeparatorWidth,
  addTextBlockToEmptyColumn,
  addTable,
  insertRowToTable,
  insertColumnToTable,
  createNewDoc,
  deleteTableRow,
  deleteTableColumn,
  setTableCellContent,
  setTableColumnWidth,
} = documentsSlice.actions
