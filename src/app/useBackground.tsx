import React, { useRef, useState, useEffect, useCallback } from "react"
import { BgCanvas } from "./bgAnimations/BgCanvas"
import { BgMainTitle } from "./bgAnimations/BgMainTitle"
import { BgTextBlock } from "./bgAnimations/BgTextBlock"
import { BgImage } from "./bgAnimations/BgImage"
import { BgHeading } from "./bgAnimations/BgHeading"
import { BgTable } from "./bgAnimations/BgTable"

/**
 * Base interface for all animated elements
 */
export interface BasicBgElement {
  x: number
  y: number
  w: number
  h: number
  fill_colour: (o: number) => string
  finished: boolean
  actions?: animationAction[]
  draw: (c: CanvasRenderingContext2D) => void
  update: () => void
  column?: "left" | "right"
}

export type animationAction = {
  opacity?: number
}

//LOGIC IMPLEMENTED HERE IS WRITTEN FOR QUICK ANIMATION OF PLANED MOCKUP ONLY
const useBackground = () => {
  const CanvasBgRef = useRef<HTMLCanvasElement>(null)

  //BACKGROUD DIMENTIONS TO FIT WINDOW SIZE
  const [canvasBgDims, setCanvasBgDims] = useState({
    w: window.innerWidth,
    h: window.innerHeight,
  })

  useEffect(() => {
    window.addEventListener("resize", () => {
      const { innerWidth, innerHeight } = window
      setCanvasBgDims({ w: innerWidth, h: innerHeight })
    })
  }, [])

  //2D CONTEXT

  const [ctx, setCtx] = useState(
    CanvasBgRef.current?.getContext("2d")! ?? null,
  )!

  useEffect(() => {
    if (!ctx) {
      const ctx = CanvasBgRef.current!.getContext("2d")!
      setCtx(ctx)
    }
  }, [ctx, setCtx])

  //DRAWING
  const clearCanvas = useCallback(() => {
    ctx.clearRect(0, 0, canvasBgDims.w, canvasBgDims.h)
  }, [ctx])

  // const canvasColour = "white"
  // const elementWidth = 420
  // const elementsStartX = 150
  // const elementsStartY = 70

  // interface bgElement {
  //   x: number
  //   y: number
  //   w: number
  //   h: number
  //   opacity: number
  //   updateOpacity: (dO?: number) => void
  //   finished?: boolean
  // }

  // class DocTitle implements bgElement {
  //   constructor(
  //     public x: number = elementsStartX,
  //     public y: number = 70,
  //     public w: number = 140,
  //     public h: number = 30,
  //     public opacity = 0,
  //   ) {}

  //   set v_start(s: number) {
  //     this.y = s
  //   }

  //   set x_start(s: number) {
  //     this.x = s
  //   }

  //   set width(a: number) {
  //     this.w = a
  //   }

  //   clearTitle() {
  //     ctx.fillStyle = canvasColour
  //     ctx.fillRect(this.x, this.y, this.w, this.h)
  //   }

  //   draw() {
  //     ctx.fillStyle = `rgba(153, 0, 224, ${this.opacity})`
  //     ctx.beginPath()
  //     ctx.roundRect(this.x, this.y, this.w, this.h, [this.w / 2])
  //     ctx.fill()
  //   }

  //   drawUnderline() {
  //     ctx.fillRect(this.x, this.y + this.h + 10, 420, 4)
  //   }

  //   updateOpacity() {
  //     if (this.opacity < 1) {
  //       this.opacity += 0.05
  //     }
  //     this.draw()
  //   }

  //   updateTitle() {
  //     this.clearTitle()
  //     this.w -= 2
  //     this.draw()
  //   }
  // }

  // class Heading implements bgElement {
  //   constructor(
  //     public x = 130,
  //     public y = 70,
  //     public w = 160,
  //     public h = 40,
  //     public opacity = 0,
  //     public finished = false,
  //   ) {}

  //   finish() {
  //     this.finished = true
  //   }

  //   set v_start(s: number) {
  //     this.y = s
  //   }

  //   set x_start(s: number) {
  //     this.x = s
  //   }

  //   draw() {
  //     ctx.fillStyle = `rgba(153, 0, 224, ${this.opacity})`
  //     ctx.beginPath()
  //     ctx.roundRect(
  //       this.x + 20 * this.opacity,
  //       this.y + 10 * this.opacity,
  //       this.w - 10 * this.opacity,
  //       this.h - 20 * this.opacity,
  //       [this.w / 2],
  //     )
  //     ctx.fill()
  //   }

  //   updateOpacity() {
  //     if (this.opacity < 1) {
  //       this.opacity += 0.1
  //     }
  //     this.draw()
  //   }

  //   updateWidth(dW = 1) {
  //     this.w += dW
  //   }
  // }

  // class TextBlock implements bgElement {
  //   constructor(
  //     public lines = 3,
  //     public x = elementsStartX,
  //     public y = 70,
  //     public w = elementWidth,
  //     public h = 8,
  //     public opacity = 0,
  //     public finished = false,
  //   ) {}

  //   finish() {
  //     this.finished = true
  //   }

  //   set v_start(v: number) {
  //     this.y = v
  //   }

  //   set x_start(s: number) {
  //     this.x = s
  //   }

  //   draw() {
  //     ctx.fillStyle = `rgba(153, 0, 224, ${this.opacity})`
  //     for (let i = 0; i < this.lines; i++) {
  //       ctx.fillRect(this.x, this.y + i * (this.h + 10), this.w, this.h)
  //     }
  //   }

  //   updateOpacity(dO = 0.1) {
  //     this.opacity += dO
  //   }

  //   makeLeftColumn(c_width: number = elementWidth / 2 - 4) {
  //     this.x = elementsStartX
  //     this.w = c_width
  //     this.lines = 5
  //   }
  // }

  // class Image implements bgElement {
  //   constructor(
  //     public x = elementsStartX + elementWidth * 0.5 + 62,
  //     public y = 30,
  //     public w = 160,
  //     public h = 90,
  //     public opacity = 0,
  //     public finished = false,
  //   ) {}

  //   finish() {
  //     this.finished = true
  //   }

  //   set v_start(s: number) {
  //     this.y = s
  //   }

  //   set x_start(s: number) {
  //     this.x = s
  //   }

  //   draw() {
  //     ctx.fillStyle = `rgba(153, 0, 224, ${this.opacity})`
  //     ctx.fillRect(this.x - 50 * this.opacity, this.y, this.w, this.h)
  //   }

  //   updateOpacity(dO: number = 0.05) {
  //     this.opacity += dO
  //   }

  //   updateWidth(dW: number = 1) {
  //     if (this.w < elementWidth * 0.5 - 12) {
  //       this.w += dW
  //       this.h += dW
  //     }
  //   }
  // }

  // class Table implements bgElement {
  //   constructor(
  //     public x = elementsStartX,
  //     public y = 30,
  //     public w = 160,
  //     public h = 60,
  //     public opacity = 0,
  //     public columns = [90],
  //     public finished = false,
  //     public heading = false,
  //   ) {}

  //   finish() {
  //     this.finished = true
  //   }

  //   set v_start(s: number) {
  //     this.y = s
  //   }

  //   set x_start(s: number) {
  //     this.x = s
  //   }

  //   set height(h: number) {
  //     if (h < 160) {
  //       this.h = h
  //     }
  //   }

  //   draw() {
  //     if (this.heading) {
  //       ctx.fillRect(this.x, this.y, this.w, 20)
  //     }
  //     ctx.strokeStyle = `rgba(153, 0, 224, ${this.opacity})`
  //     ctx.strokeRect(this.x, this.y, this.w, this.h)
  //     this.columns.forEach((column_w, idx) => {
  //       ctx.beginPath()
  //       const sum = this.columns.reduce((acc, w, i) => {
  //         if (i < idx) {
  //           return (acc += w)
  //         }
  //         return acc
  //       }, 0)
  //       ctx.moveTo(this.x + sum + column_w, this.y)
  //       ctx.lineTo(this.x + sum + column_w, this.y + this.h)
  //       ctx.stroke()
  //     })
  //     const rowNum = this.h / 20
  //     for (let i = 1; i < rowNum; i++) {
  //       ctx.beginPath()
  //       ctx.moveTo(this.x, this.y + i * 20)
  //       ctx.lineTo(this.x + this.w, this.y + i * 20)
  //       ctx.stroke()
  //     }
  //   }

  //   updateOpacity(dO: number = 0.05) {
  //     this.opacity += dO
  //   }

  //   updateWidth(dW = 1) {
  //     this.w += dW
  //   }

  //   addColumn(new_col_w = 90) {
  //     this.columns.push(new_col_w)
  //   }
  // }

  //MARCKUP

  const canvas_X = 90
  const canvas_Y = 70
  const canvas_margin = 30
  const canvas_width = 460
  const canvas_height = 580

  const main_title_size = 40

  //ANIMATION COLOURS
  const docBgColour = (o: number) => `rgba(235, 191, 255, ${o})`
  const mainDarkColour = (o: number) => `rgba(138, 60, 174, ${o})`

  useEffect(() => {
    const docCanvas = new BgCanvas(
      canvas_X + 60,
      canvas_Y,
      canvas_width + 2 * canvas_margin,
      canvas_height,
      docBgColour,
      mainDarkColour,
      0.1,
      [{ opacity: 1 }],
    )

    const bgElements: BasicBgElement[] = [
      new BgMainTitle(
        canvas_X + canvas_margin,
        canvas_Y + 20,
        110,
        main_title_size,
        mainDarkColour,
        0.2,
        canvas_width,
      ),
      new BgTextBlock(
        canvas_X + canvas_margin,
        canvas_Y + 100,
        canvas_width,
        100,
        mainDarkColour,
        0,
        5,
        true,
        10,
      ),
      new BgImage(
        canvas_X + canvas_margin,
        canvas_Y + 100,
        160,
        110,
        mainDarkColour,
        0,
        180,
        "right",
      ),
      new BgHeading(
        canvas_X + canvas_margin,
        100,
        120,
        30,
        mainDarkColour,
        0,
        140,
      ),
      new BgTextBlock(
        canvas_X + canvas_margin,
        canvas_Y + 100,
        canvas_width,
        100,
        mainDarkColour,
        0,
        5,
        false,
        10,
      ),
      new BgTable(
        canvas_X + canvas_margin,
        canvas_Y + 100,
        320,
        90,
        mainDarkColour,
        0,
        canvas_width,
      ),
    ]

    const drawBg = () => {
      const animationID = requestAnimationFrame(drawBg)
      clearCanvas()

      // DOC WHITE BACKGROUND AND SHADOW
      docCanvas.draw(ctx)
      if (docCanvas.opacity < 1) {
        docCanvas.update_opacity(0.01)
      } else {
        docCanvas.finished = true
      }

      let arrayFinished = false
      if (docCanvas.finished) {
        bgElements.forEach((element, idx, array) => {
          if (idx !== 0) {
            const prevElement = array[idx - 1]
            if (!element.column) {
              element.y = prevElement.y + prevElement.h + 10
            } else if (element.column === "right") {
              element.y = prevElement.y
              element.x = prevElement.x + prevElement.w + 12
            }
            if (prevElement.finished) {
              element.draw(ctx)
              if (!element.finished) {
                element.update()
              }
            }
          } else {
            element.draw(ctx)
            if (!element.finished) {
              element.update()
            }
          }

          if (idx === array.length - 1 && element.finished) {
            arrayFinished = true
          }
        })
      }

      if (arrayFinished) {
        if (bgElements[1].w < 260) {
          bgElements[1].w += 1
        } else {
          cancelAnimationFrame(animationID)
        }
      }
    }

    if (ctx) {
      drawBg()
    }
  }, [clearCanvas, ctx])

  return { CanvasBgRef, canvasBgDims }
}

export default useBackground
