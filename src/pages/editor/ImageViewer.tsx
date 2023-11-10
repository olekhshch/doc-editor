import React, { useContext, useState, useRef, useEffect, useMemo } from "react"
import styled from "styled-components"
import { MenuState } from "./Editor"

const ImageViewer = () => {
  const imageRef = useRef<HTMLImageElement>(null)
  const { setPopUpFor, imageViewObj } = useContext(MenuState)

  const [maxScale, minScale] = useMemo(() => [0.25, 5], [])

  const { src, description } = imageViewObj!

  const [scale, setScale] = useState(1)
  const [imgCoordinates, setImgCoordinates] = useState({ x: 100, y: 100 })

  const closeViewer = () => {
    setPopUpFor(null)
  }

  useEffect(() => {
    //centering image
    const { innerWidth, innerHeight } = window
    const { naturalHeight, naturalWidth } = imageRef.current!

    const x = (innerWidth - naturalWidth) / 2
    const y = (innerHeight - naturalHeight) / 2

    setImgCoordinates({ x, y })
  }, [])

  const handleMoving = (e: React.MouseEvent) => {
    const x0 = e.clientX
    const y0 = e.clientY

    const handleMove = (ev: MouseEvent) => {
      const x1 = ev.clientX
      const y1 = ev.clientY

      const dx = x1 - x0
      const dy = y1 - y0

      const x = imgCoordinates.x + dx
      const y = imgCoordinates.y + dy

      setImgCoordinates({ x, y })
    }

    imageRef.current!.addEventListener("mousemove", handleMove)
    imageRef.current!.addEventListener("mouseup", () => {
      imageRef.current!.removeEventListener("mousemove", handleMove)
    })
  }

  return (
    <StyledWrapper>
      <button className="close-btn" onClick={closeViewer}>
        X
      </button>
      <img
        ref={imageRef}
        src={src}
        alt={description}
        className="image"
        style={{ left: imgCoordinates.x, top: imgCoordinates.y }}
        // draggable={false}
        onMouseDown={handleMoving}
      />
      <p className="scale-info">Scale: {scale}</p>
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
    padding: 2px 4px;
    position: absolute;
    bottom: 12px;
    left: 12px;
    color: white;
    background-color: black;
  }

  .image {
    position: absolute;
    cursor: grab;
  }
`
