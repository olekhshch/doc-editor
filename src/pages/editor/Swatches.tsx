import React from "react"
import styled from "styled-components"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { rgbObjToString } from "../../functions/rgbObjToString"
import { setTheme } from "../../features/styling/stylingSlice"
import { ThemeName } from "../../features/styling/initialState"

type props = {
  handleChange?: (a: ThemeName) => void
  activeThemeName?: ThemeName
}

//default behaviour - to change doc's theme, but can be reused to set colour for other components using handleChange cb
const ThemeSwatches = ({ handleChange, activeThemeName }: props) => {
  const {
    themes,
    parameters: { activeTheme },
  } = useAppSelector((state) => state.styling)
  const dispatch = useAppDispatch()

  const refTheme = activeThemeName ?? activeTheme

  const changeHandler = (theme: ThemeName) => {
    if (!handleChange) {
      dispatch(setTheme(theme))
    } else {
      handleChange(theme)
    }
  }

  return (
    <StyledSwatches>
      {themes.map(({ name, main }) => {
        const classes = refTheme === name ? "swatch active" : "swatch"
        return (
          <li title={name} key={name}>
            <button
              style={{ backgroundColor: `rgb(${rgbObjToString(main)}` }}
              className={classes}
              onClick={() => changeHandler(name)}
            />
          </li>
        )
      })}
    </StyledSwatches>
  )
}

export default ThemeSwatches

const StyledSwatches = styled.ul`
  padding: 4px 8px;
  display: flex;
  gap: 4px;
  align-items: center;

  list-style: none;

  .swatch {
    border: none;
    border-radius: 6px;
    width: 20px;
    height: 20px;
    box-sizing: unset;
  }

  .active {
    /* border: 4px solid white; */
    width: 24px;
    height: 24px;
  }
`
