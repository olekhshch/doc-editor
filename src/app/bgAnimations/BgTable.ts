import { BasicBgElement } from "../useBackground"

export class BgTable implements BasicBgElement {
  public finished = false
  public header = false
  public columns_widths: number[] = [80, 80]
  public row_height

  constructor(
    public x: number,
    public y: number,
    public w: number,
    public h: number,
    public fill_colour: (o: number) => string,
    public opacity: number,
    public max_width: number,
    public row_num: number = 3,
    public top_mrg: number = 20,
  ) {
    this.row_height = this.h / this.row_num
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = this.fill_colour(this.opacity)
    ctx.beginPath()
    ctx.moveTo(this.x, this.y + this.top_mrg)
    ctx.lineTo(this.x, this.y + this.h + this.top_mrg)
    ctx.rect(this.x, this.y + this.top_mrg, this.w, this.h)
    ctx.stroke()

    this.columns_widths.forEach((width, i, array) => {
      const sum = array.reduce((acc, w, idx) => {
        if (idx < i) {
          return (acc += w)
        }

        return acc
      }, 0)
      ctx.beginPath()
      ctx.moveTo(this.x + sum + width, this.y + this.top_mrg)
      ctx.lineTo(this.x + sum + width, this.y + this.h + this.top_mrg)
      ctx.stroke()
    })

    ctx.beginPath()
    for (let i = 1; i <= this.row_num; i++) {
      ctx.moveTo(this.x, this.y + i * this.row_height + this.top_mrg)
      ctx.lineTo(this.x + this.w, this.y + i * this.row_height + this.top_mrg)
    }
    ctx.stroke()

    if (this.header) {
      ctx.fillRect(this.x, this.y + this.top_mrg, this.w, this.row_height)
    }
  }

  update(dO: number = 0.1) {
    if (this.opacity < 1) {
      this.opacity = Math.min(1, this.opacity + dO)
    } else if (this.columns_widths.length < 3) {
      this.columns_widths.push(80)
    } else if (this.w < this.max_width) {
      this.w = Math.min(this.max_width, this.w + 2)
    } else if (!this.header) {
      this.header = true
    } else if (this.row_num <= 5) {
      this.row_num += 1
      this.h += this.row_height
    } else if (this.columns_widths.length < 4) {
      this.columns_widths.push(80)
    } else if (this.columns_widths[3] <= 100) {
      this.columns_widths[3] += 0.5
    } else {
      this.finished = true
    }
  }
}
