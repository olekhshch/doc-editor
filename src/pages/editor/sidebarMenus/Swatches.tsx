import React, { useCallback } from "react"
import styled from "styled-components"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { ColourTheme, ThemeName } from "../../../features/styling/initialState"
import { rgbObjToString } from "../../../functions/rgbObjToString"
import { setTheme } from "../../../features/styling/stylingSlice"

const ThemeSwatches = () => {
  const { themes, activeTheme } = useAppSelector((state) => state.styling)
  const dispatch = useAppDispatch()

  return (
    <StyledSwatches>
      {themes.map(({ name, main }) => {
        const classes = activeTheme === name ? "swatch active" : "swatch"
        return (
          <li title={name}>
            <button
              style={{ backgroundColor: `rgb(${rgbObjToString(main)}` }}
              className={classes}
              onClick={() => dispatch(setTheme(name))}
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
