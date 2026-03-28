export class PerlinService {
  private gradients: {
    x: number
    y: number
  }[][]

  constructor() {
    this.gradients = []
  }

  get(x: number, y: number) {
    const xf = Math.floor(x)
    const yf = Math.floor(y)

    const top_left = this.dotProdGrid(x, y, xf, yf)
    const top_right = this.dotProdGrid(x, y, xf+1, yf)
    const bottom_left = this.dotProdGrid(x, y, xf, yf+1)
    const bottom_right = this.dotProdGrid(x, y, xf+1, yf+1)
    const x_top = this.linearInterpolation(x-xf, top_left, top_right)
    const x_bottom = this.linearInterpolation(x-xf, bottom_left, bottom_right)
    return this.linearInterpolation(y-yf, x_top, x_bottom)
  }

  private randomUnitVector() {
    const theta = Math.random() * 2 * Math.PI
    return {
      x: Math.cos(theta),
      y: Math.sin(theta)
    }
  }

  private dotProdGrid(x: number, y: number, vert_x: number, vert_y: number){
    let g_vect
    const d_vect = {
      x: x - vert_x,
      y: y - vert_y
    }

    if (this.gradients[vert_x]){
      if (this.gradients[vert_x][vert_y]) {
        g_vect = this.gradients[vert_x][vert_y]
      } else {
        g_vect = this.randomUnitVector()
        this.gradients[vert_x][vert_y] = g_vect
      }
    } else {
      g_vect = this.randomUnitVector()
      this.gradients[vert_x] = []
      this.gradients[vert_x][vert_y] = g_vect
    }

    return d_vect.x * g_vect.x + d_vect.y * g_vect.y
  }

  private linearInterpolation(x: number, a: number, b: number) {
    return a + this.smoothStep(x) * (b-a)
  }

  private smoothStep(x: number) {
    return 6*x**5 - 15*x**4 + 10*x**3
  }
}
