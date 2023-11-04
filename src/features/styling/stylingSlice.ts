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
      console.log("PAYLOAD: " + payload)
      state.activeTheme = payload
      console.log("THEME REDUX: " + state.activeTheme)
    },
  },
})

export default stylingSlice.reducer

export const { setGeneralBg, setGeneralFontColour, setTheme } =
  stylingSlice.actions
