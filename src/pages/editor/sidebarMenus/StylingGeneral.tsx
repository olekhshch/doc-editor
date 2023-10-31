import React, {
  useState,
  useEffect,
  useRef,
  FormEventHandler,
  FormEvent,
  ChangeEvent,
} from "react"
import { StyledSection } from "./StyledSection"
import { MdOutlineDragIndicator } from "react-icons/md"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { rgbColour } from "../../../types"
import { ChromePicker, ColorChangeHandler } from "react-color"
import { setGeneralBg } from "../../../features/styling/stylingSlice"
import ColourPicker from "./ColourPicker"
import useDebounce from "../../../app/useDebaunce"
import { rgbObjToString } from "../../../functions/rgbObjToString"

type props = {
  collapsed: boolean
}
const StylingGeneral = ({ collapsed }: props) => {
  const dispatch = useAppDispatch()

  const swatchRef = useRef<HTMLDivElement>(null)

  const {
    general: { doc_bg_colour },
  } = useAppSelector((state) => state.styling)

  const [bgColour, setBgColour] = useState<rgbColour>(doc_bg_colour)
  const [dragging, setDragging] = useState(false)

  const debauncedValue = useDebounce(bgColour, 70)

  // const handleBgChange = (ev: ChangeEvent) => {
  //   const colourInput = ev.target as HTMLInputElement
  //   const hex_colour = colourInput.value
  //   setBgColour(hex_colour)
  // }

  const handleBgChange: ColorChangeHandler = (colour) => {
    const { rgb } = colour
    setBgColour(rgb)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true)
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    setDragging(false)
  }

  useEffect(() => {
    if (!dragging) {
      dispatch(setGeneralBg(debauncedValue))
    }
  }, [debauncedValue, dispatch, dragging])

  return (
    <StyledSection>
      <div className="title">
        <div className="dnd-handle">
          <MdOutlineDragIndicator />
        </div>
        <h4>General</h4>
      </div>
      {!collapsed && (
        <section className="styling-params">
          <label className="param">
            <span>Backgroung colour:</span>
            {/* <div
              className="swatch"
              ref={swatchRef}
              style={{ backgroundColor: rgbObjToString(bgColour) }}
            /> */}
            {/* <ColourPicker
              colour={doc_bg_colour}
              changeHandler={handleBgChange}
            /> */}
            <div
              className="mouse-click-wraper"
              onMouseDown={(e) => handleMouseDown(e)}
              onMouseUp={(e) => handleMouseUp(e)}
            >
              <ChromePicker
                color={bgColour}
                disableAlpha={true}
                onChange={handleBgChange}
              />
              {/* <ColourPicker colour={bgColour} changeHandler={handleBgChange} /> */}
            </div>
          </label>
        </section>
      )}
    </StyledSection>
  )
}

export default React.memo(StylingGeneral)
