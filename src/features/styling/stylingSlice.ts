import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { StylingTemplate, ThemeName, initialState } from "./initialState"
import { rgbColour } from "../../types"

const stylingSlice = createSlice({
  name: "Styling",
  initialState,
  reducers: {
    setGeneralBg: (state, { payload }: PayloadAction<rgbColour>) => {
      state.parameters.general.doc_bg_colour.colour = payload
    },

    setGeneralFontColour: (state, { payload }: PayloadAction<rgbColour>) => {
      state.parameters.general.font_colour.colour = payload
    },

    setTheme: (state, { payload }: PayloadAction<ThemeName>) => {
      state.parameters.activeTheme = payload
    },

    toggleTitleUnderline: (state) => {
      state.parameters.main_title.underlined =
        !state.parameters.main_title.underlined
    },

    setMainTitleTextColour: (
      state,
      { payload }: PayloadAction<rgbColour | undefined>,
    ) => {
      state.parameters.main_title.text_colour = payload
    },

    setMainTitleMargins: (
      state,
      { payload }: PayloadAction<{ margin_bottom?: number }>,
    ) => {
      state.parameters.main_title = {
        ...state.parameters.main_title,
        ...payload,
      }
    },

    setMainTitleFontSize: (state, { payload }: PayloadAction<number>) => {
      state.parameters.main_title.font_size = payload
    },

    setTextBlocksFontSize: (state, { payload }: PayloadAction<number>) => {
      state.parameters.text_blocks.font_size = payload
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
      state.parameters.text_blocks = {
        ...state.parameters.text_blocks,
        ...payload,
      }
    },

    setTextBlockIndent: (
      state,
      { payload }: PayloadAction<[boolean, number]>,
    ) => {
      state.parameters.text_blocks.indent = payload
    },

    saveActiveStylingAsTemplate: (state) => {
      const createdOn = new Date()
      const newTemplate: StylingTemplate = {
        _id: createdOn.getTime(),
        name: `Styling | ${createdOn.getUTCDate()}.${createdOn.getMonth()}`,
        state: { ...state.parameters },
      }
      state.templates = [...state.templates, newTemplate]
    },

    setStylingTemplates: (
      state,
      { payload }: PayloadAction<StylingTemplate[]>,
    ) => {
      state.templates = payload
    },

    setStylingFromTemplate: (state, { payload }: PayloadAction<number>) => {
      const targetTemplate = state.templates.find((t) => t._id === payload)

      if (targetTemplate) {
        state.parameters = targetTemplate.state
      }
    },

    deleteStylingTemplate: (state, { payload }: PayloadAction<number>) => {
      state.templates = state.templates.filter(
        (template) => template._id !== payload,
      )
    },

    renameStylingTemplate: (
      state,
      { payload }: PayloadAction<{ id: number; new_name: string }>,
    ) => {
      state.templates = state.templates.map((template) => {
        if (template._id === payload.id) {
          return { ...template, name: payload.new_name }
        }
        return template
      })
    },

    setColumnsElementsGap: (state, { payload }: PayloadAction<number>) => {
      state.parameters.columns.gap = payload
    },

    setMaxCanvasWidth: (state, { payload }: PayloadAction<number>) => {
      state.parameters.canvas_width = payload
    },

    setHeadingsAlignment: (
      state,
      {
        payload,
      }: PayloadAction<{
        align: "left" | "right" | "center"
        levels: (1 | 2 | 3)[]
      }>,
    ) => {
      payload.levels.forEach((level) => {
        state.parameters.headings[level].align = payload.align
      })
    },

    setHeadingsFontSize: (
      state,
      { payload }: PayloadAction<{ font_size: number; levels: (1 | 2 | 3)[] }>,
    ) => {
      payload.levels.forEach(
        (level) =>
          (state.parameters.headings[level].font_size = payload.font_size),
      )
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
  setStylingTemplates,
  setStylingFromTemplate,
  deleteStylingTemplate,
  saveActiveStylingAsTemplate,
  renameStylingTemplate,
  setColumnsElementsGap,
  setMaxCanvasWidth,
  setHeadingsAlignment,
  setHeadingsFontSize,
} = stylingSlice.actions
