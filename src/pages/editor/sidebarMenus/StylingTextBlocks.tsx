import React, { useContext, useState, useEffect } from "react"
import { StyledSection } from "./StyledSection"
import { MdOutlineDragIndicator } from "react-icons/md"
import { CurrentThemeContext } from "../Editor"
import { StylingParamsContext } from "./StylingMenu"
import { constantValues } from "../../../constants"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import useDebounce from "../../../app/useDebounce"
import { setTextBlocksFontSize } from "../../../features/styling/stylingSlice"

type props = {
  collapsed: boolean
}

const StylingTextBlocks = ({ collapsed }: props) => {
  const dispatch = useAppDispatch()
  const { font_size_presets } = constantValues
  const { set_active_styling_section } = useContext(StylingParamsContext)
  const {
    text_blocks: { font_size },
  } = useAppSelector((state) => state.styling)

  const [fontSize, setFontSize] = useState<string | number>(font_size)

  const debouncedFontSize = useDebounce(fontSize, 300)

  useEffect(() => {
    const sizeNum = parseInt(debouncedFontSize.toString(), 10)
    if (!Number.isNaN(sizeNum)) {
      dispatch(setTextBlocksFontSize(sizeNum))
    }
  }, [debouncedFontSize, dispatch])

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target!
    setFontSize(value)
  }

  //Styling
  const { main, gray } = useContext(CurrentThemeContext)

  return (
    <StyledSection $gray={gray} $main={main}>
      <div
        className="title"
        onClick={() =>
          set_active_styling_section(collapsed ? "text_blocks" : null)
        }
      >
        <h4>Text blocks</h4>
      </div>
      {!collapsed && (
        <section className="styling-params">
          <form>
            <label className="param-selector">
              <span>Size: </span>
              <input
                type="list"
                value={fontSize}
                onChange={handleFontSizeChange}
              />
            </label>
          </form>
        </section>
      )}
    </StyledSection>
  )
}

export default StylingTextBlocks
