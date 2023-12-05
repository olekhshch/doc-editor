import { BasicBgElement } from "../useBackground"

export class BgImage implements BasicBgElement {
  public finished = false

  constructor(
    public x: number,
    public y: number,
    public w: number,
    public h: number,
    public fill_colour: (o: number) => string,
    public opacity: number,
    public target_w: number,
    public column?: "right" | "left",
    public top_mrg: number = 10,
  ) {}

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.fill_colour(this.opacity)
    ctx.fillRect(this.x, this.y + this.top_mrg, this.w, this.h)
  }

  update(dO: number = 0.1) {
    if (this.opacity < 1) {
      this.opacity = Math.min(1, this.opacity + dO)
    } else if (this.w < this.target_w) {
      this.w = Math.min(this.target_w, this.w + 1)
      this.h += 1
    } else {
      this.finished = true
    }
  }
}
