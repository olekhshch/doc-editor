import React, { useContext, useState, useRef, useEffect, useMemo } from "react"
import styled from "styled-components"
import { MenuState } from "./Editor"

const ImageViewer = () => {
  const imageRef = useRef<HTMLImageElement>(null)
  const { setPopUpFor, imageViewObj } = useContext(MenuState)

  const [maxScale, minScale] = useMemo(() => [4, 0.25], [])

  const { src, description } = imageViewObj!

  const [scale, setScale] = useState(1)
  const [imgCoordinates, setImgCoordinates] = useState({ x: 100, y: 100 })
  const [imgDimensions, setImgDimensions] = useState({ w: 0, h: 0 })

  const closeViewer = () => {
    setPopUpFor(null)
  }

  useEffect(() => {
    //centering the image and getting netural dimentions
    const { innerWidth, innerHeight } = window
    const { naturalHeight, naturalWidth } = imageRef.current!

    const x = (innerWidth - naturalWidth) / 2
    const y = (innerHeight - naturalHeight) / 2

    setImgCoordinates({ x, y })
    setImgDimensions({ w: naturalWidth, h: naturalHeight })
  }, [])

  useEffect(() => {
    //scaling with wheel
    const handleWheel = (e: WheelEvent) => {
      const scaleStep = scale < 2 ? 0.25 : 0.5

      let newScale = Math.sign(e.deltaY) * scaleStep + scale
      newScale =
        newScale < minScale
          ? minScale
          : newScale > maxScale
          ? maxScale
          : newScale

      setScale(newScale)
    }

    window.addEventListener("wheel", handleWheel)

    return () => window.removeEventListener("wheel", handleWheel)
  }, [scale, maxScale, minScale])

  const handleMoving = (e: React.MouseEvent) => {
    const x0 = e.clientX
    const y0 = e.clientY

    const handleMove = (ev: Event) => {
      const x1 = (ev as MouseEvent).clientX
      const y1 = (ev as MouseEvent).clientY

      const dx = x1 - x0
      const dy = y1 - y0

      const x = imgCoordinates.x + dx
      const y = imgCoordinates.y + dy

      setImgCoordinates({ x, y })
    }

    e.target.addEventListener("mousemove", handleMove)
    e.target.addEventListener("mouseup", () => {
      e.target.removeEventListener("mousemove", handleMove)
    })
  }

  return (
    <StyledWrapper>
      <button className="close-btn" onClick={closeViewer}>
        X
      </button>
      <div
        className="drag-wrapper"
        onDragStart={handleMoving}
        style={{ left: imgCoordinates.x, top: imgCoordinates.y }}
        draggable
      >
        <img
          ref={imageRef}
          src={src}
          alt={description}
          className="image"
          draggable={false}
          width={imgDimensions.w * scale}
          height={imgDimensions.h * scale}
          // onMouseDown={handleMoving}
        />
      </div>
      <div className="scale-info">
        <p>Scale: {scale}</p>
        {scale !== 1 && <button onClick={() => setScale(1)}>Reset</button>}
      </div>
    </StyledWrapper>
  )
}

export default ImageViewer

const StyledWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;

  .close-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 100;
    width: 2em;
    height: 2em;
    border: 1px solid white;
    border-radius: 50%;
    background-color: black;
    color: white;
  }

  .scale-info {
    display: flex;
    gap: 8px;
    padding: 2px 4px;
    position: absolute;
    bottom: 12px;
    left: 12px;
    color: white;
    background-color: black;
  }

  .scale-info button {
    padding: 2px 4px;
    color: white;
    border: 1px solid white;
    border-radius: 4px;
    background-color: transparent;
  }

  .drag-wrapper {
    position: absolute;
  }

  .image {
    cursor: grab;
  }
`
