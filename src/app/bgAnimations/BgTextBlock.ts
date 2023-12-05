import { BasicBgElement } from "../useBackground"

export class BgTextBlock implements BasicBgElement {
  public finished = false
  public underlined = false
  public line_height
  public left_column
  readonly initial_line_count
  private last_line_width

  constructor(
    public x: number,
    public y: number,
    public w: number,
    public h: number,
    public fill_colour: (o: number) => string,
    public opacity: number,
    public lines_count: number,
    public change_to_column: boolean,
    // public last_line_width: number,
    public top_mrg: number = 10,
  ) {
    this.line_height = this.h / this.lines_count
    this.initial_line_count = this.lines_count
    this.last_line_width = this.w
    this.left_column = !this.change_to_column
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.fill_colour(this.opacity)
    for (let i = 0; i <= this.lines_count; i++) {
      ctx.fillRect(
        this.x,
        this.y + this.top_mrg + this.line_height * i,
        i === this.lines_count ? this.last_line_width : this.w,
        10,
      )
    }
  }

  update(dO: number = 0.02) {
    if (this.opacity < 1) {
      this.opacity = Math.min(1, this.opacity + dO)
    } else if (!this.left_column && this.w > 240) {
      this.w = Math.max(240, this.w - 6)
      this.last_line_width += -6
      if (this.w < 320) {
        this.lines_count = this.initial_line_count + 1
        this.last_line_width = 320 - this.w
      }
    } else {
      this.finished = true
    }
  }
}
