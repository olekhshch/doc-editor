import { rgbColour } from "../../types"

export interface StylingState {
  stylingOptions: stylingOrderState
  general: {
    doc_bg_colour: rgbColour
    font_colour: string
  }
  main_title: {
    font_colour: string
    underline: null | string //if !== null => underline colour
  }
}

const stylingOptionsState0: stylingOrderState = [
  { option: "general", collapsed: false },
  { option: "main_title", collapsed: true },
  { option: "headings", collapsed: true },
  { option: "text_blocks", collapsed: true },
]

export const initialState: StylingState = {
  stylingOptions: stylingOptionsState0,
  general: {
    doc_bg_colour: { r: 243, g: 237, b: 243 },
    font_colour: "black",
  },
  main_title: {
    font_colour: "main",
    underline: "main",
  },
}

export type stylingOption =
  | "general"
  | "main_title"
  | "headings"
  | "text_blocks"

export type stylingOrderState = { option: stylingOption; collapsed: boolean }[]
