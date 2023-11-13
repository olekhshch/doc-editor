import React, { useEffect, useState, useRef, useContext, useMemo } from "react"
import { ImageElement } from "../../../types"
import styled from "styled-components"
import StyledElementToolbar from "./StyledElementToolbar"
import { useAppDispatch } from "../../../app/hooks"
import {
  deleteElement,
  duplicateElement,
  setActiveElementId,
  setImageDescription,
  setImageWidth,
} from "../../../features/documents/documentsSlice"
import { CurrentThemeContext, MenuState } from "../Editor"
import { HiDuplicate } from "react-icons/hi"
import { FaTrash } from "react-icons/fa"
import { PiPencilSimpleLineFill } from "react-icons/pi"
import useDebaunce from "../../../app/useDebounce"

type props = {
  imageElObj: ImageElement
  column: null | [number, "left" | "right"]
}

const ImageEl = ({ imageElObj, column }: props) => {
  const dispatch = useAppDispatch()
  const {
    width,
    _id,
    description,
    left_margin,
    description_position,
    showDescription,
  } = imageElObj

  //#TODO: Fix autowidth: no width specified => natural width <= max width

  const fitWidth = column === null ? 860 - left_margin : 400 - left_margin
  const [imgWidth, setImgWidth] = useState<number>(width ?? fitWidth)
  const [margin, setMargin] = useState(left_margin)

  const debouncedWidth = useDebaunce(imgWidth, 500)
  const debauncedMargin = useDebaunce(margin, 500)

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

  // set new values after delay (debounce)
  // useEffect(() => {
  //   dispatch(
  //     setImageWidth({
  //       imageElId: _id,
  //       column,
  //       newLeftMargin: debauncedMargin,
  //       newWidth: debouncedWidth,
  //     }),
  //   )
  // }, [_id, debauncedMargin, debouncedWidth, dispatch])

  const handleCutomeWidthMode = () => {
    dispatch(setImageWidth({ imageElId: _id, column, newWidth: fitWidth }))
  }

  const setWidthToFit = () => {
    dispatch(
      setImageWidth({
        imageElId: _id,
        column,
        newWidth: undefined,
        newLeftMargin: 0,
      }),
    )
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
          newWidth: Math.min(fitWidth, debouncedWidth + difference),
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
    e.stopPropagation()

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

  const handleSlide = (e: React.MouseEvent) => {
    if (width) {
      const x0 = e.clientX

      const handleMouseMove = (ev: MouseEvent) => {
        const x = ev.clientX
        const difference = x - x0
        const new_mrg = left_margin + difference
        dispatch(
          setImageWidth({
            imageElId: _id,
            column,
            newLeftMargin: Math.max(new_mrg, 0),
            newWidth: imgWidth,
          }),
        )
      }

      const handleMouseUp = () => {
        window.removeEventListener("mousemove", handleMouseMove)
      }

      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    }

    e.stopPropagation()
  }

  //styling options
  const { main, gray, lighter } = useContext(CurrentThemeContext)

  //popUpWindow context
  const { setImageViewObj, setPopUpFor } = useContext(MenuState)

  //#TODO: Round corners
  //#TODO: Box shadow
  const ImgToolbar = () => {
    const handleDelete = () => {
      dispatch(deleteElement({ column, elementId: _id }))
    }

    const handleDuplicate = () => {
      dispatch(duplicateElement({ elementId: _id, column }))
    }

    const handleZoom = () => {
      setImageViewObj(imageElObj)
      setPopUpFor("image_view")
    }

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
              <button className="element-toolbar-btn" onClick={setWidthToFit}>
                Auto width
              </button>
            )}
          </div>
          <div className="toolbar-section">
            <button className="element-toolbar-btn" onClick={handleZoom}>
              Zoom
            </button>
          </div>
          <div className="toolbar-section">
            <button
              className="element-toolbar-btn"
              title="Edit description"
              onClick={() => setShowDescriptionWindow(!showDescriptionWindow)}
            >
              <PiPencilSimpleLineFill />
            </button>
          </div>
          <div className="toolbar-section">
            <button
              className="element-toolbar-btn"
              onClick={handleDuplicate}
              title="Duplicate"
            >
              <HiDuplicate />
            </button>
            <button
              className="element-toolbar-btn delete-btn"
              onClick={handleDelete}
              title="Remove component"
            >
              <FaTrash />
            </button>
          </div>
        </>
      </StyledElementToolbar>
    )
  }

  const [showDescriptionWindow, setShowDescriptionWindow] = useState(false)

  const DescriptionWindow = () => {
    const [descr, setDescr] = useState(description)
    const [position, setPosition] = useState(description_position)

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (e.target.value.length <= 160) {
        setDescr(e.target.value)
      }
    }

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()

      if (descr.trim() !== "" && descr.length < 160) {
        dispatch(
          setImageDescription({
            elementId: _id,
            column,
            newDescription: descr,
            newPosition: position,
            showDescription: true,
          }),
        )
      } else {
        dispatch(
          setImageDescription({
            elementId: _id,
            column,
            newDescription: descr,
            newPosition: position,
            showDescription: false,
          }),
        )
      }

      setShowDescriptionWindow(false)
    }

    const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setPosition(e.target.value as "top" | "bottom" | "left" | "right")
    }

    const submitBtnText =
      descr.trim() !== "" || !showDescription ? "Show" : "Hide"

    return (
      <div
        className="description-window"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="flex-col">
          <label>
            <p>Image description:</p>
            <textarea value={descr} onChange={handleChange} />
          </label>
          <p>{descr.length}/160</p>
          <label className="flex">
            <span>Position:</span>
            <select
              name="position"
              value={position}
              onChange={handlePositionChange}
            >
              <option value="top">top</option>
              <option value="bottom">bottom</option>
              <option value="left">left</option>
              <option value="right">right</option>
            </select>
          </label>
          <div className="flex">
            <button type="submit">{submitBtnText}</button>
            <button>Save changes</button>
            <button onClick={() => setShowDescriptionWindow(false)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    )
  }

  //#TODO: Make left_margin, width and dimension position (left/right) cooperate
  const Description = useMemo(() => {
    return (
      <div
        title={description}
        className={`description descr-${description_position}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {description}
      </div>
    )
  }, [description_position, description])

  const setActiveOnClick = () => {
    if (column === null) {
      dispatch(setActiveElementId(_id))
    } else {
      dispatch(setActiveElementId([_id, ...column]))
    }
  }

  let wrapperClass = ["right", "left"].includes(description_position)
    ? "flex"
    : "flex-col"

  if (description_position === "right") {
    wrapperClass += " row-reverse"
  }

  if (description_position === "bottom") {
    wrapperClass += " column-reverse"
  }

  return (
    <>
      <ImgToolbar />
      <StyledImgWrapper
        $main={main}
        $left_margin={left_margin}
        $gray={gray}
        $lighter={lighter}
        $img_width={imgWidth}
        onClick={setActiveOnClick}
        onMouseDown={handleSlide}
      >
        <div className={wrapperClass}>
          {showDescription && Description}
          <div className="handlers-wrapper">
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
          </div>
        </div>
        {showDescriptionWindow && <DescriptionWindow />}
      </StyledImgWrapper>
    </>
  )
}

export default ImageEl

type styledProps = {
  $main: string
  $left_margin: number
  $gray: string
  $lighter: string
  $img_width: number
}

const StyledImgWrapper = styled.div<styledProps>`
  margin-left: ${(props) => props.$left_margin}px;
  position: relative;

  .handlers-wrapper {
    position: relative;
    width: fit-content;
  }

  .resize-handles {
    position: absolute;
    display: flex;
    justify-content: space-between;
    align-items: center;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    cursor: grab;

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

  .description-window {
    padding: 8px;
    position: absolute;
    top: 4px;
    background-color: white;
    font-size: var(--small-size);
    border-radius: 4px;
    box-shadow: 0 0 12px ${(props) => props.$gray};
  }

  .description-window select {
    margin-left: 4px;
  }

  .description-window textarea {
    resize: none;
    width: 100%;
    height: 140px;
  }

  .description-window button {
    margin: 2px;
    padding: 4px;
    border: 2px solid ${(props) => props.$lighter};
    border-radius: 4px;
    background-color: white;
  }

  .description-window button[type="submit"] {
    background-color: ${(props) => props.$main};
    border: 2px solid ${(props) => props.$main};
    color: ${(props) => props.$lighter};
  }

  .description {
    font-size: var(--small-size);
    color: ${(props) => props.$gray};
    font-style: italic;
    white-space: pre-wrap;
  }

  /* .descr-top,
  .descr-bottom {
    max-width: ${(props) => props.$img_width}px;
    text-overflow: ellipsis;
  } */

  .row-reverse {
    flex-direction: row-reverse;
  }

  .column-reverse {
    flex-direction: column-reverse;
  }
`
