import './App.css'
import reactLogo from './assets/react.svg'
import { asyncComputedAtom, useAsyncComputedAtom } from './atomix/asycComputedAtom'
import { asyncAtom, useAsyncAtom } from './atomix/asyncAtom'
import { atom, useAtom, useAtomSetter, useAtomValue } from './atomix/atom'
import { computedAtom, useComputedAtom } from './atomix/computedAtom'
import viteLogo from '/vite.svg'

const wait = () => new Promise(resolve => setTimeout(resolve, 2000))
const titleAtom = atom('Atomix demo!')
const countAtom = atom(2)
const multiplierAtom = atom(2)
const countTimesMultiplierAtom = computedAtom(get => get(countAtom) * get(multiplierAtom))

const countWithDelay = asyncAtom(async () => {
  await wait()
  return 2
})

const delayedCountTimesMultiplierAtom = asyncComputedAtom(
  async get => (await get(countWithDelay)) * get(multiplierAtom)
)

function App() {
  const title = useAtomValue(titleAtom)
  const countSetter = useAtomSetter(countAtom)
  const resetCount = () => countSetter(0)
  const delayedCountSetter = useAtomSetter(countWithDelay)
  const resetDelayedCount = () => delayedCountSetter(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>{title}</h1>
      <div style={{ display: 'flex' }}>
        <div className="card" style={{ display: 'flex', gap: '1em', flexDirection: 'column' }}>
          <Count />
          <Multiplier />
          <button onClick={resetCount}>reset count</button>
        </div>
        <div className="card" style={{ display: 'flex', gap: '1em', flexDirection: 'column' }}>
          <DelayedCount />
          <DelayedMultiplier />
          <button onClick={resetDelayedCount}>reset count</button>
        </div>
      </div>
    </>
  )
}

const Count = () => {
  const [count, setCount] = useAtom(countAtom)
  const readOnlyCount = useAtomValue(countAtom)

  return (
    <button onClick={() => setCount(count + 1)}>
      count is {count}, on read only is {readOnlyCount}
    </button>
  )
}

const Multiplier = () => {
  const [multiplier, setMultiplier] = useAtom(multiplierAtom)
  const computedCount = useComputedAtom(countTimesMultiplierAtom)

  return (
    <button onClick={() => setMultiplier(multiplier + 1)}>
      <span>
        the multiplier of the count is {multiplier} and the value is {computedCount}
      </span>
    </button>
  )
}

const DelayedCount = () => {
  const [delayedCount, setDelayedCount] = useAsyncAtom(countWithDelay)
  console.log(delayedCount)
  return (
    <button
      disabled={delayedCount === undefined}
      onClick={() => setDelayedCount(delayedCount! + 1)}
    >
      <span>this {delayedCount ?? '...'} will take 2 seconds to load</span>
    </button>
  )
}

const DelayedMultiplier = () => {
  const [multiplier, setMultiplier] = useAtom(multiplierAtom)
  const computedCount = useAsyncComputedAtom(delayedCountTimesMultiplierAtom)

  return (
    <button onClick={() => setMultiplier(multiplier + 1)}>
      <span>
        the multiplier of the count is {multiplier} and the value is {computedCount ?? '...'}
      </span>
    </button>
  )
}

export default App
