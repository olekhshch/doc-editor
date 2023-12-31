import { FocusType, RemirrorJSON } from "remirror"
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
  | TableElement

export type ContentComponentType =
  | "heading"
  | "paragraph"
  | "image"
  | "columns"
  | "separator"
  | "table"

export interface BasicComponent {
  _id: number
  type: ContentComponentType
  // orderIndex: number
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
  deviation: number
}

export interface SeparatorElement extends BasicComponent {
  type: "separator"
  width: number
  line: string
  margin_top: number
  margin_bottom: number
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
  width: number
  naturalWidth: number
  left_margin: number
}

export type columnParam = null | [number, "left" | "right"]

export interface TableCell {
  _id: number
  content: RemirrorJSON[]
}

export interface TableElement extends BasicComponent {
  type: "table"
  lastCellId: number
  content: TableCell[][]
  column_widths: (number | null)[]
  heading: boolean
  main_column: boolean
}

export type focusable = {
  focus?: () => void
  position?: (f: FocusType) => void
}
