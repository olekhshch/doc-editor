import { BasicBgElement, animationAction } from "../useBackground"

export class BgCanvas implements BasicBgElement {
  public finished: boolean = false
  constructor(
    public x: number,
    public y: number,
    public w: number,
    public h: number,
    public fill_colour: (o: number) => string,
    public shadow_colour: (o: number) => string,
    public opacity: number,
    public actions: animationAction[], // public finished: boolean = false,
  ) {}

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.shadow_colour(this.opacity)
    ctx.fillRect(this.x - 20, this.y + 30, this.w, this.h)
    ctx.fillStyle = this.fill_colour(this.opacity)
    ctx.fillRect(this.x - 60 * this.opacity, this.y, this.w, this.h)
  }

  update_opacity(dO: number = 0.1) {
    if (this.opacity < 1) {
      this.opacity = Math.min(1, (this.opacity += dO))
    }
  }
  update() {}
}
