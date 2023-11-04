import React, { ChangeEvent, useEffect, useMemo, useState } from "react"
import { ChromePicker, ColorChangeHandler } from "react-color"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { rgbObjToString } from "../../../functions/rgbObjToString"
import { rgbColour } from "../../../types"
import { setGeneralBg } from "../../../features/styling/stylingSlice"

type props = {
  colour: rgbColour
  changeHandler: ColorChangeHandler
}
const ColourPicker = ({ colour, changeHandler }: props) => {
  return (
    <div className="picker" style={{ width: "100%" }}>
      <ChromePicker
        color={colour}
        onChange={changeHandler}
        disableAlpha={true}
      />
    </div>
  )
}

export default React.memo(ColourPicker)
