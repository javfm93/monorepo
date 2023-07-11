import { useEffect, useRef, useState } from 'react'
import './App.css'

type StickyProps = { size: number; position: { x: number; y: number }; text: string }
type ArrowProps = {
  startingPoint: { x: number; y: number }
  endingPoints: { x: number; y: number }[]
}
const stickiesMap: Map<Path2D, StickyProps> = new Map()
const arrowsMap: Map<Path2D, ArrowProps> = new Map()
let selectedSticky: Path2D | null = null
let arrowInCreation: { x: number; y: number } | null = null

const StickyIcon = () => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    role="presentation"
    focusable="false"
    data-testid="svg-icon"
    className="h-8"
  >
    <path
      xmlns="http://www.w3.org/2000/svg"
      d="M4 4v16h9v-5a2 2 0 0 1 2-2h5V4H4zm0-2h16a2 2 0 0 1 2 2v10.172a2 2 0 0 1-.586 1.414l-5.828 5.828a2 2 0 0 1-1.414.586H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
      fillRule="nonzero"
      fill="currentColor"
    ></path>
  </svg>
)

const ArrowIcon = () => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    role="presentation"
    focusable="false"
    data-testid="svg-icon"
    className="h-8"
  >
    <path
      xmlns="http://www.w3.org/2000/svg"
      d="M14.293 8.293l-11 11a1 1 0 0 0 1.414 1.414l11-11L18 12l3-9-9 3 2.293 2.293z"
      fillRule="nonzero"
      fill="currentColor"
    ></path>
  </svg>
)

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

const reDrawArrows = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d')

  if (ctx) {
    for (const arrow of arrowsMap) {
      const { startingPoint, endingPoints } = arrow[1]
      const newArrow = createArrow(startingPoint, endingPoints)
      ctx.stroke(newArrow)
    }
  }
}

const createArrow = (
  startingPoint: { x: number; y: number },
  endingPoints: { x: number; y: number }[]
) => {
  const arrow = new Path2D()
  arrow.moveTo(startingPoint.x, startingPoint.y)
  endingPoints.forEach(endingPoint => arrow.lineTo(endingPoint.x, endingPoint.y))

  arrow.lineTo(
    endingPoints[endingPoints.length - 1].x - 20,
    endingPoints[endingPoints.length - 1].y - 20
  )
  arrow.moveTo(endingPoints[endingPoints.length - 1].x, endingPoints[endingPoints.length - 1].y)
  arrow.lineTo(
    endingPoints[endingPoints.length - 1].x - 20,
    endingPoints[endingPoints.length - 1].y + 20
  )

  return arrow
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

const findStickyByPosition = (
  stickiesMap: Map<Path2D, StickyProps>,
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number
) => Array.from(stickiesMap.keys()).find(sticky => ctx.isPointInPath(sticky, x, y))

function App() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [selectedShape, setSelectedShape] = useState<'sticky' | 'arrow'>('sticky')

  useEffect(() => {
    const onCanvasDoubleClick = (e: MouseEvent) => {
      const ctx = canvas.current?.getContext('2d')
      if (canvas.current && ctx) {
        const mouseX = e.offsetX
        const mouseY = e.offsetY

        if (selectedShape === 'sticky') {
          const clickedSticky = findStickyByPosition(stickiesMap, ctx, mouseX, mouseY)

          if (clickedSticky && ctx) {
            textOnSticky(clickedSticky, ctx)
          } else {
            drawSquareIn(mouseX, mouseY, canvas.current)
          }
        }

        if (selectedShape === 'arrow' && ctx) {
          const newArrow = createArrow({ x: mouseX, y: mouseY }, [
            { x: mouseX + 10, y: mouseY + 10 }
          ])
          ctx.stroke(newArrow)
          arrowInCreation = { x: mouseX, y: mouseY }
        }
      }
    }

    if (canvas.current) {
      canvas.current.addEventListener('dblclick', onCanvasDoubleClick)
      canvas.current.addEventListener('click', (e: MouseEvent) => {
        const ctx = canvas.current?.getContext('2d')
        if (canvas.current && ctx) {
          ctx.lineWidth = 5

          const mouseX = e.offsetX
          const mouseY = e.offsetY

          if (arrowInCreation) {
            ctx.clearRect(0, 0, canvas.current.width, canvas.current.height)
            const newArrow = createArrow(arrowInCreation, [{ x: mouseX, y: mouseY }])
            arrowsMap.set(newArrow, {
              startingPoint: arrowInCreation,
              endingPoints: [{ x: mouseX, y: mouseY }]
            })
            reDrawSquares(canvas.current)
            reDrawArrows(canvas.current)
            arrowInCreation = { x: mouseX, y: mouseY }
            arrowInCreation = null
          } else {
            const clickedSticky = findStickyByPosition(stickiesMap, ctx, mouseX, mouseY)

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
        }
      })
      canvas.current.addEventListener('mousedown', (e: MouseEvent) => {
        const ctx = canvas.current?.getContext('2d')
        if (canvas.current && ctx) {
          const mouseX = e.offsetX
          const mouseY = e.offsetY
          const clickedSticky = findStickyByPosition(stickiesMap, ctx, mouseX, mouseY)
          if (clickedSticky && ctx) {
            selectedSticky = clickedSticky
          }
        }
      })
      canvas.current.addEventListener('mousemove', (e: MouseEvent) => {
        const ctx = canvas.current?.getContext('2d')
        if (canvas.current && ctx) {
          if (selectedSticky) {
            const mouseX = e.offsetX
            const mouseY = e.offsetY
            const text = stickiesMap.get(selectedSticky)!.text
            stickiesMap.delete(selectedSticky)
            ctx.clearRect(0, 0, canvas.current.width, canvas.current.height)
            selectedSticky = drawSquareIn(mouseX, mouseY, canvas.current)
            reDrawSquares(canvas.current)
            reDrawArrows(canvas.current)
            drawText(mouseX, mouseY, text, ctx, selectedSticky!)
          }

          if (arrowInCreation) {
            const mouseX = e.offsetX
            const mouseY = e.offsetY
            ctx.clearRect(0, 0, canvas.current.width, canvas.current.height)
            const newArrow = createArrow(arrowInCreation, [{ x: mouseX, y: mouseY }])
            ctx.stroke(newArrow)
            reDrawSquares(canvas.current)
            reDrawArrows(canvas.current)
          }
        }
      })

      canvas.current.addEventListener('mouseup', (_: MouseEvent) => {
        if (selectedSticky) selectedSticky = null
      })
    }
    return () => canvas.current?.removeEventListener('dblclick', onCanvasDoubleClick)
  }, [canvas, selectedShape])

  return (
    <>
      <aside className="w-fit m-3 p-1 sticky top-1/3 shadow bg-white">
        <ul className="flex flex-col gap-1">
          <li>
            <button
              className={`hover:bg-blue-50 hover:text-blue-600 rounded p-1 ${
                selectedShape === 'sticky' && 'bg-blue-50 text-blue-600'
              }`}
              onClick={() => setSelectedShape('sticky')}
            >
              <StickyIcon />
            </button>
          </li>
          <li>
            <button
              className={`hover:bg-blue-50 hover:text-blue-600 rounded p-1 ${
                selectedShape === 'arrow' && 'bg-blue-50 text-blue-600'
              }`}
              onClick={() => setSelectedShape('arrow')}
            >
              <ArrowIcon />
            </button>
          </li>
        </ul>
      </aside>
      <canvas ref={canvas} className="m-8 border-2" id="canvas" width="1400" height="600">
        Your browser does not support HTML5 canvas.
      </canvas>
      <button onClick={() => downloadCanvas(canvas.current as HTMLCanvasElement)}>Download</button>
    </>
  )
}

export default App
