import { rgbColour } from "../../types"

export interface StylingState {
  readonly themes: ColourTheme[]
  activeTheme: ThemeName
  stylingOptions: stylingOrderState
  general: GeneralStyling
  main_title: {
    text_colour?: rgbColour
    underlined: boolean
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
    {
      name: "red",
      main: { r: 244, g: 67, b: 131 },
      gray: { r: 250, g: 177, b: 204 },
      lighter: { r: 255, g: 224, b: 235 },
    },
    {
      name: "turquoise",
      main: { r: 51, g: 225, b: 249 },
      gray: { r: 178, g: 232, b: 239 },
      lighter: { r: 224, g: 251, b: 255 },
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
    underlined: true,
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

export type ThemeName = "violet" | "blue" | "red" | "yellow" | "turquoise"

export interface ColourTheme {
  name: ThemeName
  main: rgbColour
  gray: rgbColour
  lighter: rgbColour
}
