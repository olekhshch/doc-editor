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
import setColumnsElDevisationAction from "./columns/setColumnsElDeviation"
import setTableWidthsArrayAction from "./table/setTableWidthsArray"
import toggleHeadingAction from "./table/toggleHeading"
import setMarginsAction from "./separator/setSeparatorMargins"

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
        if (state.activeContent.docId !== 0) {
          //avoiding persist of the initial "placeholder" doc

          //persist of the current active doc to the state.documents
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
      }
      //new doc creation
      const _id = Math.round(Math.random() * 10000000)
      const newDocumentInfo: DocumentPreviewInterface = {
        _id,
        title: "Title",
        createdOn: new Date().getTime(),
      }
      //initial text block in the new doc
      const newTBId = new Date().getTime()
      const initialTextBlock: ParagraphElement = {
        ...initialParagraph,
        _id: newTBId,
      }
      const newDocContent: DocumentContent = {
        _id,
        docId: _id,
        components: [initialTextBlock],
      }

      state.activeContent = newDocContent
      state.activeDocumentInfo = newDocumentInfo

      state.activeDocumentId = _id
      state.activeElementId = newTBId
      state.activeElementType = "paragraph"

      state.disableElementsAdding = false
    },

    cacheActiveDoc: (state) => {
      state.disableElementsAdding = true

      if (state.activeContent && state.activeDocumentInfo) {
        try {
          const idx = state.documents.findIndex(
            (document) => document.documentInfo._id === state.activeDocumentId,
          )

          const fullDoc: DocumentFull = {
            content: state.activeContent!,
            documentInfo: state.activeDocumentInfo!,
          }

          if (idx >= 0) {
            state.documents[idx] = fullDoc
          } else {
            state.documents = [...state.documents, fullDoc]
          }
          console.log({ documents: state.documents })
        } catch (err) {
          console.log("ERROR while persisting active doc")
        } finally {
          state.disableElementsAdding = false
        }
      }
    },

    cacheDocuments: (state, { payload }: PayloadAction<DocumentFull[]>) => {
      state.documents = payload
    },

    deleteDoc: (state, { payload }: PayloadAction<number>) => {
      state.documents = state.documents.filter(
        (doc) => doc.documentInfo._id !== payload,
      )

      if (state.activeDocumentId === payload) {
        state.activeDocumentId = null
        state.activeDocumentInfo = null
        state.activeContent = null
      }
    },

    renameActiveDoc: (state, { payload }: PayloadAction<string>) => {
      if (state.activeDocumentInfo) {
        state.activeDocumentInfo.title = payload
      }
    },

    setDocAsCurrent: (state, { payload }: PayloadAction<number>) => {
      try {
        state.disableElementsAdding = true

        const targetDoc = state.documents.find(
          (doc) => doc.documentInfo._id === payload,
        )

        if (targetDoc) {
          state.activeDocumentId = targetDoc.documentInfo._id
          state.activeDocumentInfo = targetDoc.documentInfo
          state.activeContent = targetDoc.content
        }
      } catch (err) {
        console.log("ERROR while opening the document")
      } finally {
        state.disableElementsAdding = false
      }
    },

    toggleBegingsWithTitle: (state) => {
      state.beginsWithTitle = !state.beginsWithTitle
    },

    addHeading: addHeadingAction,
    setHeadingLevel: setHeadingLevelAction,
    setHeadingContent: setHeadingContentAction,

    addParagraph: addTextBlockAction,
    setParagraphContent: setTextBlockContentAction,

    // addFocusCb: (
    //   state,
    //   {
    //     payload,
    //   }: PayloadAction<{
    //     elementId: number
    //     column: columnParam
    //     focus_cb: () => void
    //     element_type: ContentComponentType
    //     position_cb: (f: FocusType) => void
    //   }>,
    // ) => {
    //   const { elementId, column, focus_cb, element_type, position_cb } = payload
    //   const pl = { elementId, column, focus_cb, position_cb }
    //   switch (element_type) {
    //     case "paragraph":
    //       addFocusCb_textblock(state, pl)
    //       break
    //     case "heading":
    //       addFocusCb_heading(state, pl)
    //   }
    // },

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
    setSeparatorMargins: setMarginsAction,

    addImage: addImageAction,
    setImageWidth: setImageWidthAction,
    setImageDescription: setImageDescriptionAction,

    insertColumn: insertColumnAction,
    deleteSideOfColumn: deleteColumnSideAction,
    addTextBlockToEmptyColumn: addTextBlockToEmptyColumnAction,
    setColumnsElDeviation: setColumnsElDevisationAction,

    addTable: addTableAction,
    insertRowToTable: addRowAction,
    insertColumnToTable: addColumnAction,
    deleteTableRow: deleteRowAction,
    deleteTableColumn: deleteColumnAction,
    setTableCellContent: setCellContentAction,
    setTableColumnWidth: setTableColumnWidthAction,
    setTableColumnsWidths: setTableWidthsArrayAction,
    toggleTableHeading: toggleHeadingAction,

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
    },

    setDocumentFromObject: (
      state,
      {
        payload,
      }: PayloadAction<{
        content: DocumentContent
        docInfo: DocumentPreviewInterface
      }>,
    ) => {
      try {
        state.activeContent = payload.content
        state.activeDocumentInfo = payload.docInfo
        state.activeDocumentId = payload.docInfo._id
      } catch (err) {}
    },
  },
})

export default documentsSlice.reducer

export const {
  disableAddingElements,
  enableAddingElements,
  deleteDoc,
  renameActiveDoc,
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
  setColumnsElDeviation,
  setTableColumnsWidths,
  toggleTableHeading,
  setSeparatorMargins,
  setDocumentFromObject,
  cacheDocuments,
  cacheActiveDoc,
} = documentsSlice.actions
