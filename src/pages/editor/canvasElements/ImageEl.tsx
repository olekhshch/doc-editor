import React, {
  useState,
  useMemo,
  useEffect,
  useContext,
  ChangeEvent,
  FormEvent,
} from "react"
import styled from "styled-components"
import { ImageElement, columnParam } from "../../../types"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import useDebounce from "../../../app/useDebounce"
import {
  deleteElement,
  duplicateElement,
  setActiveElementData,
  setImageDescription,
  setImageWidth,
} from "../../../features/documents/documentsSlice"
import { CurrentThemeContext, MenuState } from "../Editor"
import StyledElementToolbar from "./StyledElementToolbar"
import { PiPencilSimpleLineFill } from "react-icons/pi"
import { HiDuplicate } from "react-icons/hi"
import { FaTrash } from "react-icons/fa"
import { ColumnsElementContext } from "./ColumnsDocElement"
import { MdOutlineDragIndicator } from "react-icons/md"
import { useDrag } from "react-dnd"
import { DnDTypes } from "../../../DnDtypes"
import useDocElements from "../../../app/useDocElements"

type props = {
  imageElObj: ImageElement
  column: columnParam
}

const ImageEl = ({ imageElObj, column }: props) => {
  const dispatch = useAppDispatch()
  const { maxWidth } = useDocElements()
  const isColumn = column !== null

  const columnContext = useContext(ColumnsElementContext)
  const maxImgWidth = useMemo(
    () => (isColumn ? columnContext[column[1]] : maxWidth),
    [isColumn, columnContext, maxWidth],
  )!

  const {
    width,
    _id,
    description,
    left_margin,
    naturalWidth,
    description_position,
    showDescription,
    src,
  } = imageElObj

  const [imgWidth, setImgWidth] = useState(Math.min(width, maxImgWidth))
  const [margin, setMargin] = useState(
    Math.min(left_margin, maxWidth - imgWidth),
  )

  const debouncedWidth = useDebounce(imgWidth, 200)
  const debouncedMargin = useDebounce(margin, 200)

  useEffect(() => {
    dispatch(
      setImageWidth({
        imageElId: _id,
        newLeftMargin: debouncedMargin,
        newWidth: debouncedWidth,
        column: isColumn ? [column[0], column[1]] : null,
      }),
    )
  }, [_id, isColumn, debouncedMargin, dispatch, debouncedWidth])

  const handleSlide = (e: React.MouseEvent) => {
    e.stopPropagation()
    makeActive()
    if (imgWidth < maxWidth) {
      const x0 = e.clientX

      const handleMouseMove = (ev: MouseEvent) => {
        const x = ev.clientX
        const difference = x - x0
        const new_mrg = Math.max(left_margin + difference, 0)
        setMargin(Math.min(new_mrg, maxWidth - imgWidth))
      }

      const handleMouseUp = () => {
        window.removeEventListener("mousemove", handleMouseMove)
      }

      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    }
  }

  const handleLeftResize = (e: React.MouseEvent) => {
    makeActive()
    //sets new width AND left margin
    const x0 = e.clientX
    e.stopPropagation()

    const handleMouseMove = (ev: MouseEvent) => {
      const x = ev.clientX
      const difference = x - x0
      const new_left_mrg = Math.max(left_margin + difference, 0)
      const new_width = Math.max(imgWidth - difference, 10)
      const maxAllowedWidth = maxWidth - new_left_mrg
      setImgWidth(Math.min(new_width, maxAllowedWidth))
      setMargin(Math.min(new_left_mrg, maxWidth - 10))
    }

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
  }

  const handleRightResize = (e: React.MouseEvent) => {
    makeActive()
    //right handle set new image width only
    const x0 = e.clientX

    const handleMouseMove = (ev: MouseEvent) => {
      const x = ev.clientX
      const difference = x - x0
      const maxAllowedWidth = maxWidth - margin
      const newWidth = Math.max(10, imgWidth + difference)
      setImgWidth(Math.min(maxAllowedWidth, newWidth))
    }

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    e.stopPropagation()
  }

  //DESCRIPTION
  const [showDescriptionSettings, setShowDescriptionSettings] = useState(false)

  const Description = () => {
    return <p className="image-description">{description}</p>
  }

  const DescriptionMenu = () => {
    const [descriptionDraft, setDescriptionDraft] = useState(description)
    const [descrPosition, setDescrPosition] = useState<
      "top" | "bottom" | "left" | "right"
    >(description_position)

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      const { value } = e.target
      if (value.length <= 160) {
        setDescriptionDraft(value)
      }
    }

    const handleSubmit = (e: FormEvent) => {
      e.preventDefault()
      dispatch(
        setImageDescription({
          elementId: _id,
          column,
          newDescription: descriptionDraft,
          newPosition: descrPosition,
          showDescription: true,
        }),
      )

      setShowDescriptionSettings(false)
    }

    const saveAndHide = () => {
      dispatch(
        setImageDescription({
          elementId: _id,
          column,
          newDescription: descriptionDraft,
          newPosition: descrPosition,
          showDescription: false,
        }),
      )
      setShowDescriptionSettings(false)
    }

    const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { value } = e.target!
      setDescrPosition(value as "top" | "bottom")
    }

    return (
      <div className="description-settings">
        <p>Description: </p>
        <form onSubmit={handleSubmit}>
          <textarea value={descriptionDraft} onChange={handleChange} />
          <div>
            <span>Position:</span>
            <select
              name="position"
              value={descrPosition}
              onChange={handlePositionChange}
            >
              <option value="top">top</option>
              <option value="bottom">bottom</option>
              {/* <option value="left">left</option>
              <option value="right">right</option> */}
            </select>
          </div>
          <div className="btn-container">
            <button type="submit">Save & show</button>
            <button onClick={saveAndHide}>Save & hide</button>
            <button onClick={() => setShowDescriptionSettings(false)}>
              Cancel
            </button>
          </div>
        </form>
        <p>{descriptionDraft.length}/160</p>
      </div>
    )
  }

  //#TODO: top and bottom margins as parametrs of a toolbar
  //#TODO: Resize listener - img width adjustment
  //#TODO: Remove resize handles when readonly

  //DnD setup
  const [{ isDragging }, dragHandle, dragPreview] = useDrag({
    type: DnDTypes.ELEMENT,
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
    item: { _id, columnSource: column },
  })

  //TOOLBAR
  const ImgToolbar = () => {
    const { setImageViewObj, setPopUpFor } = useContext(MenuState)

    const handleZoom = () => {
      setImageViewObj(imageElObj)
      setPopUpFor("image_view")
    }

    const handleDuplicate = () => {
      dispatch(duplicateElement({ elementId: _id, column }))
    }

    const handleDelete = () => {
      dispatch(deleteElement({ column, elementId: _id }))
    }

    const resetWidth = () => {
      if (margin + naturalWidth > maxWidth) {
        setMargin(0)
      }
      setImgWidth(naturalWidth)
    }

    return (
      <StyledElementToolbar>
        <>
          {column !== null && (
            <div className="toolbar-section">
              <button className="dnd-handle" ref={dragHandle}>
                <MdOutlineDragIndicator />
              </button>
            </div>
          )}
          {naturalWidth !== width && (
            <div className="toolbar-section">
              <button className="element-toolbar-btn" onClick={resetWidth}>
                Reset width
              </button>
            </div>
          )}
          <div className="toolbar-section">
            <button className="element-toolbar-btn" onClick={handleZoom}>
              Zoom
            </button>
          </div>
          <div className="toolbar-section">
            <button
              className="element-toolbar-btn"
              title="Edit description"
              onClick={() => {
                setShowDescriptionSettings(!showDescriptionSettings)
              }}
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

  const makeActive = () => {
    dispatch(
      setActiveElementData({
        id: column === null ? _id : [_id, ...column],
        type: "image",
      }),
    )
  }

  //STYLING
  const { main, gray } = useContext(CurrentThemeContext)

  return (
    <>
      <ImgToolbar />
      <StyledImgWrapper
        $left_margin={margin}
        $main={main}
        $gray={gray}
        onClick={makeActive}
      >
        {showDescriptionSettings && <DescriptionMenu />}
        <div className="flex-col">
          {showDescription && <Description />}
          <div className="handlers-wrapper" onMouseDown={handleSlide}>
            <img
              src={src}
              alt={description}
              width={imgWidth}
              className="image-element"
              draggable={false}
            />
            <div className="resize-handles">
              <div className="handle left" onMouseDown={handleLeftResize} />
              <div className="handle right" onMouseDown={handleRightResize} />
            </div>
          </div>
        </div>
      </StyledImgWrapper>
    </>
  )
}

export default ImageEl

type styledProps = {
  $left_margin: number
  $main: string
  $gray: string
}

const StyledImgWrapper = styled.div<styledProps>`
  margin-left: ${(pr) => pr.$left_margin}px;
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
    width: 6px;
    height: 30%;
    min-height: 30px;
    cursor: e-resize;
  }

  .description-settings {
    padding: 4px 8px;
    position: absolute;
    z-index: 200;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 0 8px ${(pr) => pr.$gray};
    font-size: var(--small-size);
  }

  .description-settings form {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .btn-container {
    display: flex;
    gap: 8px;
  }

  .description-settings textarea {
    resize: none;
    height: 140px;
    width: 240px;
  }

  .image-description {
    max-width: 240px;
    width: max-content;
    font-size: var(--small-size);
    font-style: italic;
    color: ${(props) => props.$main};
  }
`
