import { rgbColour } from "../../types"

export interface StylingState {
  readonly themes: ColourTheme[]
  readonly stylingOptions: stylingOrderState
  parameters: StylingParameters
  // activeTheme: ThemeName
  // general: StylingGeneral
  // main_title: {
  //   font_size: number
  //   text_colour?: rgbColour
  //   underlined: boolean
  //   margin_bottom: number
  // }
  // text_blocks: StylingTextBlock
  templates: StylingTemplate[]
}

export interface StylingTemplate {
  _id: number
  name: string
  state: StylingParameters
}

interface StylingParameters {
  activeTheme: ThemeName
  general: StylingGeneral
  main_title: {
    font_size: number
    text_colour?: rgbColour
    underlined: boolean
    margin_bottom: number
    margin_top: number
  }
  text_blocks: StylingTextBlock
  columns: {
    gap: number
  }
  canvas_width: number
  headings: {
    1: StylingHeading
    2: StylingHeading
    3: StylingHeading
  }
}

const stylingOptionsState0: stylingOrderState = [
  { option: "general", collapsed: false },
  { option: "main_title", collapsed: true },
  { option: "headings", collapsed: true },
  { option: "text_blocks", collapsed: true },
]

export const themes: ColourTheme[] = [
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
]

export const initialState: StylingState = {
  templates: [],
  themes,

  stylingOptions: stylingOptionsState0,
  parameters: {
    activeTheme: "violet",
    general: {
      doc_bg_colour: {
        title: "Background colour",
        colour: { r: 243, g: 237, b: 243 },
      },
      font_colour: {
        title: "General font colour",
        colour: { r: 3, g: 7, b: 3 },
      },
      main_colour: { title: "Main colour", colour: { r: 153, g: 0, b: 224 } },
    },
    main_title: {
      font_size: 48,
      underlined: true,
      margin_bottom: 16,
      margin_top: 12,
    },
    text_blocks: {
      font_size: 20,
      spacing_paragraph: 0,
      indent: [false, 36],
      spacing_letter: 0,
      spacing_line: 1,
      spacing_word: 4,
    },
    columns: {
      gap: 4,
    },
    canvas_width: 996,
    headings: {
      1: {
        align: "left",
        font_size: 48,
      },
      2: {
        align: "left",
        font_size: 36,
      },
      3: {
        align: "left",
        font_size: 28,
      },
    },
  },
}

export type stylingOption =
  | "general"
  | "main_title"
  | "headings"
  | "text_blocks"

export type stylingOrderState = { option: stylingOption; collapsed: boolean }[]

export type GeneralParam = "doc_bg_colour" | "font_colour" | "main_colour"

export type StylingGeneral = {
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

export type StylingTextBlock = {
  font_size: number
  spacing_paragraph: number
  spacing_line: number
  spacing_letter: number
  spacing_word: number
  indent: [boolean, number]
}

export interface StylingHeading {
  font_size: number
  font_colour?: rgbColour
  align: "left" | "center" | "right"
}
