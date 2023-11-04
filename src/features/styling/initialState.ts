import { rgbColour } from "../../types"

export interface StylingState {
  readonly themes: ColourTheme[]
  activeTheme: ThemeName
  stylingOptions: stylingOrderState
  general: GeneralStyling
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
  themes: [
    {
      name: "violet",
      main: { r: 153, g: 0, b: 224 },
      gray: { r: 217, g: 200, b: 228 },
      lighter: { r: 167, g: 59, b: 234 },
    },
    {
      name: "blue",
      main: { r: 52, g: 72, b: 248 },
      gray: { r: 182, g: 186, b: 222 },
      lighter: { r: 226, g: 229, b: 255 },
    },
  ],
  activeTheme: "violet",
  stylingOptions: stylingOptionsState0,
  general: {
    doc_bg_colour: {
      title: "Background colour",
      colour: { r: 243, g: 237, b: 243 },
    },
    font_colour: { title: "General font colour", colour: { r: 3, g: 7, b: 3 } },
    main_colour: { title: "Main colour", colour: { r: 153, g: 0, b: 224 } },
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

export type GeneralParam = "doc_bg_colour" | "font_colour" | "main_colour"

export type GeneralStyling = {
  [key in keyof GeneralParam as `${GeneralParam}`]: {
    title: string
    colour: rgbColour
  }
}

export type ThemeName = "violet" | "blue" | "red"

export interface ColourTheme {
  name: ThemeName
  main: rgbColour
  gray: rgbColour
  lighter: rgbColour
}
