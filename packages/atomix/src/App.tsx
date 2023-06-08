import './App.css'
import reactLogo from './assets/react.svg'
import { atom, useAtom, useAtomValue } from './atomix'
import viteLogo from '/vite.svg'

const wait = () => new Promise(resolve => setTimeout(resolve, 1000))
const countAtom = atom(2)
const countTimes2Atom = atom(get => get(countAtom) * 2, 'computed count')
const countWithDelay = atom(async () => {
  console.log('countWithDelay')
  await wait()
  console.log('countWithDelay after')
  return 2
}, 'delayed count')

const DelayedCount = () => {
  const [delayedCount] = useAtom(countWithDelay)
  return <span>this count will take 2 seconds and the value is {delayedCount ?? '...'}</span>
}

function App() {
  const [count, setCount] = useAtom(countAtom)
  const count2 = useAtomValue(countAtom)
  const [countTimes2] = useAtom(countTimes2Atom)

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
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount(count + 1)}>
          count is {count}, on read only is {count2} and times two is {countTimes2} <br></br>
          <DelayedCount />
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  )
}

export default App
