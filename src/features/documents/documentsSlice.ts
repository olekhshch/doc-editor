import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import {
  activeElementInColumn,
  initialState,
  initialParagraph,
} from "./initialState"
import {
  ColumnsElement,
  DocContentComponent,
  DocumentInterface,
  DocumentPreviewInterface,
  HeadingElement,
  ParagraphElement,
} from "../../types"
import { reoderArray } from "../../functions/reorderArray"
import { insertElementIntoArray } from "../../functions/insertElementIntoArray"
import { RemirrorJSON } from "remirror"
import { removeElementFromArray } from "../../functions/removeElementFromArray"

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
        _id: Math.round(Math.random() * 1000000),
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
        const _id = new Date().getMilliseconds()
        const initialP: ParagraphElement = {
          ...initialParagraph,
          _id,
        }

        state.activeContent = {
          _id: 100000000,
          docId: payload,
          components: [initialP],
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
        payload: { level, where },
      }: PayloadAction<{
        level: 1 | 2 | 3
        where?: number | [number, number, "left" | "right"]
      }>,
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

      const currentActiveElId = where
        ? where
        : state.activeElementId ?? state.activeContent!.components.length

      const _id = Math.round(Math.random() * 10000)
      const newHeadingEl: HeadingElement = {
        _id,
        type: "heading",
        content,
        level,
        orderIndex: 100,
      }

      if (!Array.isArray(currentActiveElId)) {
        //insert as an separate element (not part of a column)
        const activeEl = state.activeContent!.components.find(
          (el) => el._id === currentActiveElId,
        )
        const orderIndex = activeEl ? activeEl.orderIndex : 0
        const newElements = insertElementIntoArray(
          newHeadingEl,
          state.activeContent!.components,
          orderIndex,
        ) as (DocContentComponent | ColumnsElement)[]
        state.activeContent!.components = newElements
        state.activeElementId = _id
      } else {
        //heading will be inserted inside of a existing column
        const [elementId, columnsElId, side] = currentActiveElId

        const targetColumnsEl = state.activeContent!.components.find(
          (el) => el._id === columnsElId && el.type === "columns",
        ) as ColumnsElement | undefined

        if (targetColumnsEl) {
          const { orderIndex } = targetColumnsEl[side].find(
            (el) => el._id === elementId,
          )!
          const newSide = insertElementIntoArray(
            newHeadingEl,
            targetColumnsEl[side],
            orderIndex,
          )
          const newColumnsEl: ColumnsElement = {
            ...targetColumnsEl,
            [side]: newSide,
          }

          state.activeContent!.components = state.activeContent!.components.map(
            (el) => {
              if (el._id === columnsElId) {
                return newColumnsEl
              }
              return el
            },
          )
          state.activeElementId = [_id, columnsElId, side]
        }
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
      {
        payload,
      }: PayloadAction<{
        headingId?: number
        newContent: string
      }>,
    ) => {
      //checking if heading is a part of a column
      const isPartOfAColumn = Array.isArray(state.activeElementId)

      //cb for map
      const setNewContentCb =
        (targetId: number) =>
        (element: DocContentComponent | ColumnsElement) => {
          if (element._id === targetId && element.type === "heading") {
            const newValue =
              payload.newContent.trim() !== ""
                ? payload.newContent
                : element.content
            return { ...element, content: newValue } as HeadingElement
          }
          return element
        }

      //if heading is not part of a column
      if (!isPartOfAColumn) {
        const targetId = payload.headingId ?? (state.activeElementId as number)

        state.activeContent!.components = state.activeContent!.components.map(
          (element) => setNewContentCb(targetId)(element),
        )
      } else {
        //if heading is a part of a column
        const [headingId, columnId, side] =
          state.activeElementId as activeElementInColumn

        //original column which contains heading
        const targetColumn = state.activeContent!.components.find(
          (el) => el._id === columnId && el.type === "columns",
        ) as ColumnsElement | undefined

        if (targetColumn) {
          //updated column
          const newColumnsElement = {
            ...targetColumn,
            [side]: targetColumn[side].map((el) =>
              setNewContentCb(headingId)(el),
            ),
          }

          state.activeContent!.components = state.activeContent!.components.map(
            (el) => {
              if (el._id === columnId) {
                return newColumnsElement
              }
              return el
            },
          )
        }
      }
    },

    addParagraph: (
      state,
      {
        payload,
      }: PayloadAction<{ where?: number | [number, number, "left" | "right"] }>,
    ) => {
      const currentActiveElId = payload.where
        ? payload.where
        : state.activeElementId ?? state.activeContent!.components.length

      const _id = Math.round(Math.random() * 10000)
      const newPEl: ParagraphElement = {
        ...initialParagraph,
        _id,
      }

      if (!Array.isArray(currentActiveElId)) {
        //insert as an separate element (not part of a column)
        const activeEl = state.activeContent!.components.find(
          (el) => el._id === currentActiveElId,
        )
        const orderIndex = activeEl ? activeEl.orderIndex : 0
        const newElements = insertElementIntoArray(
          newPEl,
          state.activeContent!.components,
          orderIndex,
        ) as (DocContentComponent | ColumnsElement)[]
        state.activeContent!.components = newElements
        state.activeElementId = _id
      } else {
        //paragraph will be inserted inside of a existing column
        const [elementId, columnsElId, side] = currentActiveElId

        const targetColumnsEl = state.activeContent!.components.find(
          (el) => el._id === columnsElId && el.type === "columns",
        ) as ColumnsElement | undefined

        if (targetColumnsEl) {
          const { orderIndex } = targetColumnsEl[side].find(
            (el) => el._id === elementId,
          )!
          const newSide = insertElementIntoArray(
            newPEl,
            targetColumnsEl[side],
            orderIndex,
          )
          const newColumnsEl: ColumnsElement = {
            ...targetColumnsEl,
            [side]: newSide,
          }

          state.activeContent!.components = state.activeContent!.components.map(
            (el) => {
              if (el._id === columnsElId) {
                return newColumnsEl
              }
              return el
            },
          )
          state.activeElementId = [_id, columnsElId, side]
        }
      }
    },

    setParagraphContent: (
      state,
      {
        payload,
      }: PayloadAction<{
        newContentArray: RemirrorJSON[]
        elementId?: number
        column: null | [number, "left" | "right"]
      }>,
    ) => {
      if (state.activeContent) {
        if (!Array.isArray(state.activeElementId) && payload.column === null) {
          //element is not a part of a column
          const elementId = payload.elementId
            ? payload.elementId
            : state.activeElementId

          state.activeContent.components = state.activeContent.components.map(
            (el) => {
              if (el._id === elementId && el.type === "paragraph") {
                return { ...el, content: payload.newContentArray }
              }
              return el
            },
          )
        } else {
          //element is a part of a column
          let elementId: number
          let columnsElId: number
          let side: "left" | "right"

          if (!payload.elementId && Array.isArray(state.activeElementId)) {
            //active element is a target
            elementId = state.activeElementId[0]
            columnsElId = state.activeElementId[1]
            side = state.activeElementId[2]
          } else if (payload.elementId && payload.column !== null) {
            //target element is deffined, not specifically active one
            elementId = payload.elementId
            columnsElId = payload.column[0]
            side = payload.column[1]
          }

          //finds columns with a target element and replaces
          state.activeContent.components = state.activeContent.components.map(
            (element) => {
              if (element._id === columnsElId && element.type === "columns") {
                const updatedColumn = element[side].map((el) => {
                  if (el._id === elementId && el.type === "paragraph") {
                    return { ...el, content: payload.newContentArray }
                  }
                  return el
                })
                return { ...element, [side]: updatedColumn }
              }
              return element
            },
          )
        }
      }
    },

    setActiveElementId: (
      state,
      { payload }: PayloadAction<number | null | activeElementInColumn>,
    ) => {
      state.activeElementId = payload
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
                orderIndex: idx,
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
      if (state.activeContent) {
        const newParagraphEl: ParagraphElement = {
          ...initialParagraph,
          _id: Math.round(Math.random() * 1000000),
        }

        state.activeContent.components = state.activeContent.components.map(
          (element) => {
            if (
              element._id === payload.elementId &&
              element.type !== "columns"
            ) {
              const { orderIndex } = element
              if (payload.side === "left") {
                const newElement: ColumnsElement = {
                  _id: new Date().getMilliseconds(),
                  orderIndex,
                  type: "columns",
                  left: [element],
                  right: [newParagraphEl],
                }
                return newElement
              }
              const newElement: ColumnsElement = {
                _id: new Date().getMilliseconds(),
                orderIndex,
                type: "columns",
                left: [newParagraphEl],
                right: [element],
              }
              return newElement
            }
            return element
          },
        )
      }
    },

    duplicateElement: (
      state,
      {
        payload,
      }: PayloadAction<{
        elementId: number
        column: null | [number, "left" | "right"]
      }>,
    ) => {
      if (payload.column === null) {
        //element is not a part of a column
        const targetElement = state.activeContent!.components.find(
          (el) => el._id === payload.elementId,
        )

        if (targetElement) {
          const duplicate: DocContentComponent | ColumnsElement = {
            ...targetElement,
            _id: Math.round(Math.random() * 1000000),
          }
          //inserting duplicate after the original
          const newComponentsArray = insertElementIntoArray(
            duplicate,
            state.activeContent!.components,
            targetElement.orderIndex,
          ) as (DocContentComponent | ColumnsElement)[]
          // fixing order indexes in the state array
          state.activeContent!.components = newComponentsArray.map(
            (el, idx) => ({ ...el, orderIndex: idx }),
          )
        }
      } else {
        //element is a part of a column
        const [columnId, side] = payload.column
        const targetColumn = state.activeContent!.components.find(
          (el) => el._id === columnId && el.type === "columns",
        ) as ColumnsElement | undefined

        if (targetColumn) {
          const targetElement = targetColumn[side].find(
            (el) => el._id === payload.elementId,
          ) as DocContentComponent | undefined

          if (targetElement) {
            const duplicate: DocContentComponent = {
              ...targetElement,
              _id: new Date().getMilliseconds(),
            }
            const newSide0 = insertElementIntoArray(
              duplicate,
              targetColumn[side],
              targetElement.orderIndex,
            ) as DocContentComponent[]
            //fixing order indexes
            const newSide = newSide0.map((el, idx) => ({
              ...el,
              orderIndex: idx,
            }))
            const newColumn = { ...targetColumn, [side]: newSide }

            //replacing old columns with columns element with a duplicate
            state.activeContent!.components =
              state.activeContent!.components.map((el) => {
                if (el._id === columnId) {
                  return newColumn
                }
                return el
              })
          }
        }
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
  setHeadingContent,
  addParagraph,
  setParagraphContent,
  moveElement,
  deleteActiveElement,
  deleteElement,
  insertColumn,
  duplicateElement,
} = documentsSlice.actions
