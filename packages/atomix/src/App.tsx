import { Suspense } from 'react'
import './App.css'
import reactLogo from './assets/react.svg'
import { suspendedComputedAtom, useSuspendedComputedAtom } from './atomix/SuspendedComputedAtom'
import { atom, useAtom, useAtomSetter, useAtomValue } from './atomix/atom'
import { computedAtom, useComputedAtom } from './atomix/computedAtom'
import { suspendedAtom, useSuspendedAtom } from './atomix/suspendedAtom'
import viteLogo from '/vite.svg'

export const wait = () => new Promise(resolve => setTimeout(resolve, 2000))
const titleAtom = atom('Atomix demo!')
const countAtom = atom(2)
const multiplierAtom = atom(2)
const countTimesMultiplierAtom = computedAtom(get => get(countAtom) * get(multiplierAtom))

const suspendedCountAtom = suspendedAtom(async () => {
  await wait()
  return 2
})

const delayedCountTimesMultiplierAtom = suspendedComputedAtom(
  async get => (await get(suspendedCountAtom)) * get(multiplierAtom)
)

const suspendedCountTimesMultiplierAtom = suspendedComputedAtom(
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
  const [delayedCount, setDelayedCount] = useSuspendedAtom(suspendedCountAtom, false)
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
  const computedCount = useSuspendedComputedAtom(delayedCountTimesMultiplierAtom, false)

  return (
    <button onClick={() => setMultiplier(multiplier + 1)}>
      <span>
        the multiplier of the count is {multiplier} and the value is {computedCount ?? '...'}
      </span>
    </button>
  )
}

const SuspendedCount = () => {
  const [suspendedCount, setSuspendedCount] = useSuspendedAtom(suspendedCountAtom)
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

// TODO:
const SuspendedMultiplier = () => {
  const [multiplier, setMultiplier] = useAtom(multiplierAtom)
  const computedCount = useSuspendedComputedAtom(suspendedCountTimesMultiplierAtom)

  console.log({ computedCount })
  return (
    <button onClick={() => setMultiplier(multiplier + 1)}>
      <span>
        the multiplier of the count is {multiplier} and the value is {computedCount}
      </span>
    </button>
  )
}
export default App
