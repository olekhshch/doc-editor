import React, { useEffect, useState, useRef } from "react"
import useBackground from "../../app/useBackground"

const Bg = () => {
  const { CanvasBgRef, canvasBgDims } = useBackground()

  return (
    <canvas
      ref={CanvasBgRef}
      id="canvas-bg"
      height={canvasBgDims.h}
      width={canvasBgDims.w}
    />
  )
}

export default Bg
