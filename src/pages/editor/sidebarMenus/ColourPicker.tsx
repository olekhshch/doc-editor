import React, { ChangeEvent, useEffect, useMemo, useState } from "react"
import { ChromePicker, ColorChangeHandler } from "react-color"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { rgbObjToString } from "../../../functions/rgbObjToString"
import { rgbColour } from "../../../types"
import { setGeneralBg } from "../../../features/styling/stylingSlice"

type props = {
  colour: rgbColour | string
  changeHandler: (e: ChangeEvent) => void
}
const ColourPicker = ({ colour, changeHandler }: props) => {
  const dispatch = useAppDispatch()

  const memoPicker = useMemo(() => {
    console.log("MEMO picker rendered")

    return <input type="color" value="#000000" onChange={changeHandler} />
  }, [colour])

  return (
    <div className="picker" style={{ width: "100%" }}>
      {memoPicker}
    </div>
  )
}

export default ColourPicker
