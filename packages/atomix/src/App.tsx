import { Suspense } from 'react'
import './App.css'
import reactLogo from './assets/react.svg'
import { Atom } from './atomix/atom'
import { useAtom } from './atomix/useAtom'
import { useAtomSetter } from './atomix/useAtomSetter'
import { useAtomValue } from './atomix/useAtomValue'
import viteLogo from '/vite.svg'

export const wait = () => new Promise(resolve => setTimeout(resolve, 2000))
const titleAtom = new Atom('Atomix demo!')
const countAtom = new Atom(2)
const multiplierAtom = new Atom(2)
const countTimesMultiplierAtom = new Atom(get => get(countAtom) * get(multiplierAtom))

const wait2Seconds = async () => {
  await wait()
  return 2
}
const suspendedCountAtom = new Atom(wait2Seconds)

const delayedCountTimesMultiplierAtom = new Atom(
  async get => (await get(suspendedCountAtom)) * get(multiplierAtom)
)

const suspendedCountTimesMultiplierAtom = new Atom(
  async get => (await get(suspendedCountAtom)) * get(multiplierAtom)
)

function App() {
  const title = useAtomValue(titleAtom)
  const countSetter = useAtomSetter(countAtom)
  const resetCount = () => countSetter(0)
  const delayedCountSetter = useAtomSetter(suspendedCountAtom)
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
        <div className="card" style={{ display: 'flex', gap: '1em', flexDirection: 'column' }}>
          <Suspense fallback={<SuspendedSkeleton />}>
            <SuspendedCount />
            <SuspendedMultiplier />
            <button onClick={resetDelayedCount}>reset count</button>
          </Suspense>
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
  const computedCount = useAtomValue(countTimesMultiplierAtom)

  return (
    <button onClick={() => setMultiplier(multiplier + 1)}>
      <span>
        the multiplier of the count is {multiplier} and the value is {computedCount}
      </span>
    </button>
  )
}

const DelayedCount = () => {
  const [delayedCount, setDelayedCount] = useAtom(suspendedCountAtom, false)

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
  const computedCount = useAtomValue(delayedCountTimesMultiplierAtom, false)

  return (
    <button onClick={() => setMultiplier(multiplier + 1)}>
      <span>
        the multiplier of the count is {multiplier} and the value is {computedCount ?? '...'}
      </span>
    </button>
  )
}

const SuspendedCount = () => {
  const [suspendedCount, setSuspendedCount] = useAtom(suspendedCountAtom)
  return (
    <button onClick={() => setSuspendedCount(suspendedCount + 1)}>
      <span>this {suspendedCount} was suspended</span>
    </button>
  )
}

const SuspendedSkeleton = () => {
  return (
    <>
      <button disabled>
        <span>suspended 2 sec...</span>
      </button>
      <button disabled>
        <span>this is also suspended during 2 seconds...</span>
      </button>
      <button disabled>reset count</button>
    </>
  )
}

const SuspendedMultiplier = () => {
  const [multiplier, setMultiplier] = useAtom(multiplierAtom)
  const computedCount = useAtomValue(suspendedCountTimesMultiplierAtom)

  return (
    <button onClick={() => setMultiplier(multiplier + 1)}>
      <span>
        the multiplier of the count is {multiplier} and the value is {computedCount}
      </span>
    </button>
  )
}

export default App
