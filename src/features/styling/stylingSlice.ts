import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { initialState } from "./initialState"
import { rgbColour } from "../../types"

const stylingSlice = createSlice({
  name: "Styling",
  initialState,
  reducers: {
    setGeneralBg: (state, { payload }: PayloadAction<rgbColour>) => {
      state.general.doc_bg_colour = payload
    },
  },
})

export default stylingSlice.reducer

export const { setGeneralBg } = stylingSlice.actions
