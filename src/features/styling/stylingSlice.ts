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
    setTextBlocksFontSize: (state, { payload }: PayloadAction<number>) => {
      state.text_blocks.font_size = payload
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
} = stylingSlice.actions
