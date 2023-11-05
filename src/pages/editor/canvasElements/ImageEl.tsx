import React, { useEffect, useState, useRef, useContext } from "react"
import { ImageElement } from "../../../types"
import styled from "styled-components"
import StyledElementToolbar from "./StyledElementToolbar"
import { useAppDispatch } from "../../../app/hooks"
import { setImageWidth } from "../../../features/documents/documentsSlice"
import { CurrentThemeContext } from "../Editor"

type props = {
  imageElObj: ImageElement
  column: null | [number, "left" | "right"]
}

const ImageEl = ({ imageElObj, column }: props) => {
  const dispatch = useAppDispatch()
  const { width, _id, description, left_margin } = imageElObj

  const fitWidth = column === null ? 860 - left_margin : 400 - left_margin
  const [imgWidth, setImgWidth] = useState<number>(width ?? fitWidth)

  // const [resizeMode, setResizeMode] = useState<boolean>(width === undefined)

  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!width) {
      const { naturalWidth } = imgRef.current!
      if (naturalWidth > imgWidth) {
        setImgWidth(Math.min(fitWidth, naturalWidth))
      }
    } else {
      setImgWidth(Math.min(width, fitWidth))
    }
  }, [imgWidth, width, fitWidth])

  const handleCutomeWidthMode = () => {
    dispatch(setImageWidth({ imageElId: _id, column, newWidth: fitWidth }))
  }

  //resize handlers
  const handleRightResize = (e: React.MouseEvent) => {
    //right handle set new image width only
    const x0 = e.clientX

    const handleMouseMove = (ev: MouseEvent) => {
      const x = ev.clientX
      const difference = x - x0
      dispatch(
        setImageWidth({
          newWidth: Math.min(fitWidth, imgWidth + difference),
          imageElId: _id,
          column,
        }),
      )
    }

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    e.stopPropagation()
  }

  const handleLeftResize = (e: React.MouseEvent) => {
    //sets new width AND left margin
    const x0 = e.clientX

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX
      const difference = x - x0
      const new_left_mrg = left_margin + difference
      const new_width = width! - difference
      dispatch(
        setImageWidth({
          imageElId: _id,
          column,
          newLeftMargin: new_left_mrg,
          newWidth: Math.min(fitWidth, new_width),
        }),
      )
    }

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
  }

  //styling options
  const { main } = useContext(CurrentThemeContext)

  const ImgToolbar = () => {
    return (
      <StyledElementToolbar>
        <>
          <div className="toolbar-section">
            {!width ? (
              <button
                className="element-toolbar-btn"
                onClick={handleCutomeWidthMode}
              >
                Resize
              </button>
            ) : (
              <button className="element-toolbar-btn">Auto width</button>
            )}
          </div>
        </>
      </StyledElementToolbar>
    )
  }

  return (
    <StyledImgWrapper $main={main} $left_margin={left_margin}>
      <ImgToolbar />
      <img
        src={imageElObj.src}
        width={imgWidth}
        ref={imgRef}
        alt={description}
      />
      {width && (
        <div className="resize-handles">
          <div className="handle left" onMouseDown={handleLeftResize} />
          <div className="handle right" onMouseDown={handleRightResize} />
        </div>
      )}
    </StyledImgWrapper>
  )
}

export default ImageEl

type styledProps = {
  $main: string
  $left_margin: number
}

const StyledImgWrapper = styled.div<styledProps>`
  margin-left: ${(props) => props.$left_margin}px;
  position: relative;

  .resize-handles {
    position: absolute;
    display: flex;
    justify-content: space-between;
    align-items: center;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;

    opacity: 0;
  }

  &:hover .resize-handles {
    opacity: 1;
  }

  .handle {
    background-color: ${(props) => props.$main};
    width: 4px;
    height: 30%;
    min-height: 30px;
    cursor: e-resize;
  }

  .left {
    border-radius: 0 4px 4px 0;
  }
  .right {
    border-radius: 4px 0 0 4px;
  }
`
