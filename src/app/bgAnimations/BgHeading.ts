import { BasicBgElement } from "../useBackground"

export class BgHeading implements BasicBgElement {
  public finished = false

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
    ctx.roundRect(this.x, this.y + this.top_mrg, this.w, this.h - 4 - 4, 18)
    ctx.fill()
  }

  update(dO: number = 0.1) {
    if (this.opacity < 1) {
      this.opacity = Math.min(1, (this.opacity += dO))
    } else if (this.w < this.max_width) {
      this.w = Math.min(this.max_width, this.w + 2)
    } else {
      this.finished = true
    }
  }
}
