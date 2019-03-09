
let pd = []
let a = 0
function setup() {
  createCanvas(400, 400)
  pd = new BDraw(10, 10, 0.1)
  rectMode(CENTER)
}

function draw() {
  background(128)

  push()
  translate(width / 4, height / 4)
  rotate(a)
  fill(255)
  pd.circle(0, 0, 50)
  noFill()
  circle(0, 0, 75)
  pop()

  push()
  noFill()
  translate(3 * width / 4, height / 4)
  rotate(a)
  pd.line(0, -50, 0, 50)
  pd.line(-50, 0, 50, 0)
  pd.line(-50, -50, 50, 50)
  pd.line(50, -50, -50, 50)
  pop()

  push()
  translate(width / 4, 3 * height / 4)
  noFill()
  rect(0, 0, 150, 150)
  rotate(a)
  fill(255)
  pd.square(0, 0, 100)
  pop()

  push()
  translate(3 * width / 4, 3 * height / 4)
  noFill()
  rect(0, 0, 125, 150)
  rotate(-a)
  fill(255)
  pd.rect(0, 0, 75, 100)
  pop()

  BDraw.zoff += 0.02
  a += 0.01
}

class BDraw {
  constructor(noiseX, noiseY, error = BDraw.error) {
    this.noiseX = noiseX
    this.noiseY = noiseY
    this.error = error
  }

  line(x1, y1, x2, y2) {
    push()
    translate(x1, y1)
    let dx = x1 - x2
    let dy = y1 - y2
    let l = sqrt(dx * dx + dy * dy)
    let a = asin(dx / l)
    rotate(a)
    let segments = max(2, l / 10)

    beginShape()
    for (let i = 0; i <= segments; i++) {
      let a = map(i, 0, segments, 0, 2 * PI)
      let xoff = cos(a)
      let yoff = sin(a)
      let n = noise(this.noiseX + xoff, this.noiseY + yoff, BDraw.zoff)
      let e = map(n, 0, 1, -this.error / 2, this.error / 2)
      let y = map(i, 0, segments, 0, l)
      vertex(e * l, y)
    }
    endShape()
    pop()
  }

  circle(x, y, r) {
    beginShape()
    for (let i = 0; i < BDraw.segments; i++) {
      let a = map(i, 0, BDraw.segments, 0, 2 * PI)
      let xoff = cos(a)
      let yoff = sin(a)
      let n = noise(this.noiseX + xoff, this.noiseY + yoff, BDraw.zoff)
      let d = map(n, 0, 1, 1 - this.error, 1 + this.error)
      vertex(x + d * r * xoff, y + d * r * yoff)
    }
    endShape(CLOSE)
  }

  square(x, y, s) {
    beginShape()
    // Depends on rect mode
    // assumes CENTER
    let xc = x
    let yc = y
    // let xc = x + s / 2
    // let yc = y + s / 2
    for (let i = 0; i < BDraw.segments; i++) {
      let a = map(i, 0, BDraw.segments, 0, 2 * PI)

      let xoff = cos(a)
      let yoff = sin(a)
      let n = noise(this.noiseX + xoff, this.noiseY + yoff, BDraw.zoff)
      let d = map(n, 0, 1, 1 - this.error, 1 + this.error)

      let r = min(1 / abs(cos(a)), 1 / abs(sin(a)))
      let xr = d * s / 2 * r * cos(a)
      let yr = d * s / 2 * r * sin(a)
      vertex(xc + xr, yc + yr)
    }
    endShape(CLOSE)
  }

  rect(x, y, w, h) {
    let circumfence = 2 * w + 2 * h
    beginShape()
    for (let i = 0; i < BDraw.segments; i++) {
      let a = map(i, 0, BDraw.segments, 0, 2 * PI)
      let ld = map(i, 0, BDraw.segments, 0, circumfence)

      let xoff = cos(a)
      let yoff = sin(a)
      let n = noise(this.noiseX + xoff, this.noiseY + yoff, BDraw.zoff)
      let d = map(n, 0, 1, -this.error, this.error)

      // Depends on rect mode
      // assumes CENTER
      let xt = x - w / 2
      let yt = y - h / 2
      // top side
      if (ld < w) {
        xt += ld
      }
      // right side
      else if (ld < w + h) {
        xt += w
        yt += ld - w
      }
      // bottom side
      else if (ld < 2 * w + h) {
        xt += w - (ld - w - h)
        yt += h
      }
      // left side 
      else {
        yt += 2 * w + 2 * h - ld
      }
      vertex(xt + d * w, yt + d * h)
    }
    endShape(CLOSE)
  }
}
BDraw.segments = 40
BDraw.error = 0.2
BDraw.zoff = 0
