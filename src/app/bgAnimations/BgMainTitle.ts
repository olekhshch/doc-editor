import { AiFillThunderbolt } from "react-icons/ai"
import { BasicBgElement } from "../useBackground"

export class BgMainTitle implements BasicBgElement {
  public finished = false
  public underlined = false

  constructor(
    public x: number,
    public y: number,
    public w: number,
    public h: number,
    public fill_colour: (o: number) => string,
    public opacity: number,
    public max_width: number,
    public top_mrg: number = 10,
  ) {}

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.fill_colour(this.opacity)
    ctx.roundRect(this.x, this.y, this.w, this.h - 4 - 4, 18)
    ctx.fill()

    if (this.underlined) {
      ctx.fillRect(this.x, this.y + this.h - 4, this.max_width, 4)
    }
  }

  update(dO: number = 0.1) {
    if (this.opacity < 1) {
      this.opacity = Math.min(1, (this.opacity += dO))
    } else if (this.w < 210) {
      this.w = Math.min(210, this.w + 2)
    } else if (!this.underlined) {
      this.underlined = true
      this.finished = true
    }
  }
}
