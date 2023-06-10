import { useEffect, useState } from 'react'
import { AsyncAtom } from './asyncAtom'
import { Atom, Subscriber } from './atom'

type Get = <T, A extends AsyncAtom<T> | Atom<T>>(atom: A) => ReturnType<A['get']>
export type AsyncComputedAtom<Type> = (get: Get) => Promise<Type>

export const asyncComputedAtom = <Type,>(
  initial: AsyncComputedAtom<Type>,
  name = 'unknown'
): AsyncAtom<Type> => {
  const subscribeToAtomsDependencies: Get = atom => {
    const onSubscribe = async () => {
      const newValue = await onSubscribeComputeAtom()
      subscribers.forEach(callback => callback(newValue))
    }
    atom.subscribe(onSubscribe)
    return getAtom(atom)
  }

  let value: Type | undefined = undefined
  const subscribers = new Set<Subscriber<Type>>()

  const getAtom: Get = atom => {
    return atom.get() as ReturnType<(typeof atom)['get']>
  }

  const onSubscribeComputeAtom = async () => {
    value = await initial(getAtom)
    return value
  }

  const set = (newValue: Type) => {
    value = newValue
    subscribers.forEach(callback => callback(newValue))
  }

  const get = async () => {
    value ? value : (value = await initial(subscribeToAtomsDependencies))
    return value
  }

  return {
    name,
    get,
    set,
    subscribe: (callback: Subscriber<Type>) => {
      subscribers.add(callback)

      return () => {
        subscribers.delete(callback)
      }
    }
  }
}

export const useAsyncComputedAtom = <Type,>(atom: AsyncAtom<Type>) => {
  const [value, setValue] = useState<Type>()

  useEffect(() => {
    atom.get().then(setValue)
    const unsubscribe = atom.subscribe(async newValue => {
      setValue(await newValue)
    })
    return unsubscribe
  }, [atom])

  return value
}
