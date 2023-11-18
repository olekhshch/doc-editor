import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { ThemeName, initialState } from "./initialState"
import { rgbColour } from "../../types"

const stylingSlice = createSlice({
  name: "Styling",
  initialState,
  reducers: {
    setGeneralBg: (state, { payload }: PayloadAction<rgbColour>) => {
      state.general.doc_bg_colour.colour = payload
    },

    setGeneralFontColour: (state, { payload }: PayloadAction<rgbColour>) => {
      state.general.font_colour.colour = payload
    },

    setTheme: (state, { payload }: PayloadAction<ThemeName>) => {
      state.activeTheme = payload
    },

    toggleTitleUnderline: (state) => {
      state.main_title.underlined = !state.main_title.underlined
    },

    setMainTitleTextColour: (
      state,
      { payload }: PayloadAction<rgbColour | undefined>,
    ) => {
      state.main_title.text_colour = payload
    },

    setMainTitleMargins: (
      state,
      { payload }: PayloadAction<{ margin_bottom?: number }>,
    ) => {
      state.main_title = { ...state.main_title, ...payload }
    },

    setMainTitleFontSize: (state, { payload }: PayloadAction<number>) => {
      state.main_title.font_size = payload
    },

    setTextBlocksFontSize: (state, { payload }: PayloadAction<number>) => {
      state.text_blocks.font_size = payload
    },

    setTextBlockSpacings: (
      state,
      {
        payload,
      }: PayloadAction<{
        spacing_paragraph?: number
        spacing_letter?: number
        spacing_line?: number
        spacing_word?: number
      }>,
    ) => {
      state.text_blocks = { ...state.text_blocks, ...payload }
    },

    setTextBlockIndent: (
      state,
      { payload }: PayloadAction<[boolean, number]>,
    ) => {
      state.text_blocks.indent = payload
    },
  },
})

export default stylingSlice.reducer

export const {
  setGeneralBg,
  setGeneralFontColour,
  setTheme,
  toggleTitleUnderline,
  setMainTitleTextColour,
  setTextBlocksFontSize,
  setMainTitleFontSize,
  setMainTitleMargins,
  setTextBlockSpacings,
  setTextBlockIndent,
} = stylingSlice.actions
