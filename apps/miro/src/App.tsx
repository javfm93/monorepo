import { useEffect, useRef } from 'react'
import './App.css'

let stickiesIndex: Path2D[] = []
const stickiesMap: Map<Path2D, { size: number; position: { x: number; y: number }; text: string }> =
  new Map()
let selectedSticky: Path2D | null = null

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
    return square
  }
  return null
}

const reDrawSquares = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d')

  if (ctx) {
    for (const sticky of stickiesMap) {
      const { position, size } = sticky[1]
      ctx.fillRect(position.x - size / 2, position.y - size / 2, size, size)
    }
    // texts should be on their own map
    for (const sticky of stickiesMap) {
      const { position, text } = sticky[1]
      drawText(position.x, position.y, text, ctx, sticky[0])
    }
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
  if (oldSticky && text) {
    if (oldSticky.text !== '') {
      ctx.fillStyle = 'red'
      ctx.fill(sticky)
    }
    oldSticky.text = text
    stickiesMap.set(sticky, oldSticky)
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
          textOnSticky(clickedSticky, ctx)
        } else {
          drawSquareIn(mouseX, mouseY, canvas.current)
        }
      }
    }

    if (canvas.current) {
      canvas.current.addEventListener('dblclick', onCanvasDoubleClick)
      canvas.current.addEventListener('click', (e: MouseEvent) => {
        if (canvas.current) {
          const ctx = canvas.current.getContext('2d')
          const mouseX = e.offsetX
          const mouseY = e.offsetY

          const clickedSticky = stickiesIndex.find(sticky =>
            ctx?.isPointInPath(sticky, mouseX, mouseY)
          )

          if (clickedSticky && ctx) {
            const sticky = stickiesMap.get(clickedSticky)
            if (sticky) {
              ctx.strokeStyle = 'black'
              ctx.lineWidth = 5
              ctx.strokeRect(
                sticky.position.x - sticky.size / 2,
                sticky.position.y - sticky.size / 2,
                sticky.size,
                sticky.size
              )
            }
          }
        }
      })
      canvas.current.addEventListener('mousedown', (e: MouseEvent) => {
        if (canvas.current) {
          const ctx = canvas.current.getContext('2d')
          const mouseX = e.offsetX
          const mouseY = e.offsetY
          const clickedSticky = stickiesIndex.find(sticky =>
            ctx?.isPointInPath(sticky, mouseX, mouseY)
          )
          if (clickedSticky && ctx) {
            selectedSticky = clickedSticky
          }
        }
      })
      canvas.current.addEventListener('mousemove', (e: MouseEvent) => {
        const ctx = canvas.current?.getContext('2d')
        if (canvas.current && ctx && selectedSticky) {
          const mouseX = e.offsetX
          const mouseY = e.offsetY
          stickiesIndex = stickiesIndex.filter(sticky => sticky !== selectedSticky)
          const text = stickiesMap.get(selectedSticky)!.text
          stickiesMap.delete(selectedSticky)
          ctx.clearRect(0, 0, canvas.current.width, canvas.current.height)
          selectedSticky = drawSquareIn(mouseX, mouseY, canvas.current)
          reDrawSquares(canvas.current)
          drawText(mouseX, mouseY, text, ctx, selectedSticky!)
        }
      })

      canvas.current.addEventListener('mouseup', (_: MouseEvent) => {
        if (selectedSticky) selectedSticky = null
      })

      const ctx = canvas.current.getContext('2d')
      if (ctx) {
        drawArrow(
          { x: 400, y: 100 },
          [
            { x: 400, y: 300 },
            { x: 500, y: 300 }
          ],
          ctx
        )
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
