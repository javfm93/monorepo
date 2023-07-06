import { useEffect, useRef } from 'react'
import './App.css'

const stickiesIndex: Path2D[] = []
const stickiesMap: Map<Path2D, { size: number; position: { x: number; y: number }; text: string }> =
  new Map()

function handleEnter(input: HTMLInputElement, ctx: CanvasRenderingContext2D, sticky: Path2D) {
  return (e: KeyboardEvent) => {
    if (e.code === 'Enter') {
      drawText(parseInt(input.style.left), parseInt(input.style.top), input.value, ctx, sticky)
      document.body.removeChild(input)
    }
  }
}
function handleBlur(input: HTMLInputElement, ctx: CanvasRenderingContext2D, sticky: Path2D) {
  return () => {
    drawText(parseInt(input.style.left), parseInt(input.style.top), input.value, ctx, sticky)
    document.body.removeChild(input)
  }
}

function addInput(
  x: number,
  y: number,
  ctx: CanvasRenderingContext2D,
  text: string,
  sticky: Path2D
) {
  var input = document.createElement('input')

  input.type = 'text'
  input.style.position = 'fixed'
  input.style.left = x + 'px'
  input.style.top = y + 'px'
  // todo: store the text in the map once it is saved
  console.log(text)
  input.value = text

  input.onkeydown = handleEnter(input, ctx, sticky)
  input.onblur = handleBlur(input, ctx, sticky)

  document.body.appendChild(input)

  input.focus()
}
const textOnSticky = (sticky: Path2D, ctx: CanvasRenderingContext2D) => {
  const stickyProps = stickiesMap.get(sticky)
  if (stickyProps) {
    const { x, y } = stickyProps.position
    const { text } = stickyProps
    addInput(x, y, ctx, text, sticky)
  } else {
    console.log('sticky not foudn!')
  }
}

const drawSquareIn = (x: number, y: number, canvas: HTMLCanvasElement, size = 100) => {
  const ctx = canvas.getContext('2d')

  if (ctx) {
    const square = new Path2D()
    square.rect(x - size / 2, y - size / 2, size, size)
    ctx.fillStyle = 'red'
    ctx.fill(square)
    stickiesIndex.push(square)
    stickiesMap.set(square, { size, position: { x, y }, text: '' })
  }
}

const drawArrow = (
  startingPoint: { x: number; y: number },
  endingPoints: { x: number; y: number }[],
  ctx: CanvasRenderingContext2D
) => {
  ctx.beginPath()
  ctx.strokeStyle = 'blue'
  ctx.lineWidth = 5
  ctx.moveTo(startingPoint.x, startingPoint.y)
  endingPoints.forEach(endingPoint => ctx.lineTo(endingPoint.x, endingPoint.y))

  ctx.lineTo(endingPoints[1].x - 20, endingPoints[1].y - 20)
  ctx.moveTo(endingPoints[1].x, endingPoints[1].y)
  ctx.lineTo(endingPoints[1].x - 20, endingPoints[1].y + 20)

  ctx.stroke()
}

const drawText = (
  x: number,
  y: number,
  text: string,
  ctx: CanvasRenderingContext2D,
  sticky: Path2D
) => {
  const oldSticky = stickiesMap.get(sticky)
  if (oldSticky) {
    if (oldSticky.text !== '') {
      ctx.fillStyle = 'red'
      ctx.fill(sticky)
    }
    oldSticky.text = text
    ctx.font = '24px serif'
    ctx.fillStyle = 'white'
    ctx.textAlign = 'center'
    ctx.fillText(text, x, y)
  }
}

const drawImage = (image: HTMLImageElement, ctx: CanvasRenderingContext2D) => {
  ctx.drawImage(image, 600, 100)
}

const downloadCanvas = (canvas: HTMLCanvasElement) => {
  const link = document.createElement('a')
  link.download = 'canvas.png'
  link.href = canvas.toDataURL()
  link.click()
}
function App() {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const onCanvasDoubleClick = (e: MouseEvent) => {
      if (canvas.current) {
        const ctx = canvas.current.getContext('2d')
        const mouseX = e.offsetX
        const mouseY = e.offsetY

        const clickedSticky = stickiesIndex.find(sticky =>
          ctx?.isPointInPath(sticky, mouseX, mouseY)
        )

        if (clickedSticky && ctx) {
          console.log('text on sticky')
          textOnSticky(clickedSticky, ctx)
        } else {
          drawSquareIn(mouseX, mouseY, canvas.current)
          console.log('squared created')
        }
      }
    }
    if (canvas.current) {
      canvas.current.addEventListener('dblclick', onCanvasDoubleClick)

      const ctx = canvas.current.getContext('2d')
      if (ctx) {
        drawSquareIn(100, 100, canvas.current)
        drawSquareIn(200, 300, canvas.current)
        drawArrow(
          { x: 400, y: 100 },
          [
            { x: 400, y: 300 },
            { x: 500, y: 300 }
          ],
          ctx
        )
        const image = new Image()
        image.src = 'https://picsum.photos/200/300'

        image.onload = () => {
          drawImage(image, ctx)
        }
      }
    }
    return () => canvas.current?.removeEventListener('dblclick', onCanvasDoubleClick)
  }, [canvas])

  return (
    <>
      <canvas ref={canvas} className="m-8 border-2" id="canvas" width="1400" height="600">
        Your browser does not support HTML5 canvas.
      </canvas>
      <button onClick={() => downloadCanvas(canvas.current as HTMLCanvasElement)}>Download</button>
    </>
  )
}

export default App
