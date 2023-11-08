import { RemirrorJSON } from "remirror"
import { ThemeName } from "./features/styling/initialState"

export interface ProjectInterface {
  _id: number
  title: string
  createdOn: number
  isCollapsed: boolean
  isPinned: boolean
  orderIndex: number
}
export interface DocumentPreviewInterface {
  _id: number
  projectId: number | null
  title: string
  createdOn: number
}
export interface DocumentInterface extends DocumentPreviewInterface {}

export interface DocumentContent {
  _id: number
  docId: number
  components: (DocContentComponent | ColumnsElement)[]
}

export type DocContentComponent =
  | HeadingElement
  | ParagraphElement
  | SeparatorElement
  | ImageElement

export type ContentComponentType =
  | "heading"
  | "paragraph"
  | "image"
  | "columns"
  | "separator"

export interface BasicComponent {
  _id: number
  type: ContentComponentType
  orderIndex: number
}

export interface HeadingElement extends BasicComponent {
  type: "heading"
  level: 1 | 2 | 3
  content: string
}

export interface ParagraphElement extends BasicComponent {
  type: "paragraph"
  content: RemirrorJSON[]
}

export interface ColumnsElement extends BasicComponent {
  type: "columns"
  left: DocContentComponent[]
  right: DocContentComponent[]
}

export interface SeparatorElement extends BasicComponent {
  type: "separator"
  width: number
  line: string
  colour: SwatchesColour
}

export type SwatchesColour = ThemeName //same colours as main theme colors
// export const availableSwatches: SwatchesColour[] = [
//   "--black",
//   "--main",
//   "--white",
// ]

export type rgbColour = {
  r: number
  g: number
  b: number
}

export interface ImageElement extends BasicComponent {
  type: "image"
  src: string
  description: string
  description_position: "top" | "bottom" | "left" | "right"
  showDescription: boolean
  width: undefined | number
  left_margin: number
}

export type columnParam = null | [number, "left" | "right"]
