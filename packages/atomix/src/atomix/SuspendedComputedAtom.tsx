import { useEffect, useState } from 'react'
import { AsyncAtom, AsyncAtomValue, use } from './asyncAtom'
import { Subscriber } from './atom'
import { SyncAtom } from './syncAtom'

export type SuspendedAtomGetter = <T, A extends AsyncAtom<T> | SyncAtom<T>>(atom: A) => ReturnType<A['get']>
export type SuspendedComputedAtomGetter<Type> = (get: SuspendedAtomGetter) => Promise<Type>

export const suspendedComputedAtom = <Type,>(
  initial: SuspendedComputedAtomGetter<Type>,
  name = 'unknown'
): AsyncAtom<Type> => {
  const subscribeToAtomsDependencies: SuspendedAtomGetter = atom => {
    const onSubscribe = async () => {
      const newValue = await onSubscribeComputeAtom()
      subscribers.forEach(callback => callback(newValue))
    }
    atom.subscribe(onSubscribe)
    return getAtom(atom)
  }

  let value: AsyncAtomValue<Type> | undefined = undefined
  const subscribers = new Set<Subscriber<Type>>()

  const getAtom: SuspendedAtomGetter = atom => {
    return atom.get() as ReturnType<(typeof atom)['get']>
  }

  const onSubscribeComputeAtom = async () => {
    const newValue = await initial(getAtom)
    value = { status: 'fulfilled', result: newValue }
    return newValue
  }

  const set = (newValue: Type) => {
    value = { status: 'fulfilled', result: newValue }
    subscribers.forEach(callback => callback(newValue))
  }

  const init = () => {
    if (!value) {
      const result = initial(subscribeToAtomsDependencies)
      result.then(set)
      value = { status: 'pending', result }
      return value
    }

    return value
  }

  const get = () => {
    const result = value ? value : init()

    if (result.status === 'rejected') {
      throw result.result
    }
    return Promise.resolve(result.result)
  }

  return {
    type: 'async',
    name,
    init,
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

export function useSuspendedComputedAtom<Type>(
  atom: AsyncAtom<Type>,
  suspense: false
): Type | undefined
export function useSuspendedComputedAtom<Type>(atom: AsyncAtom<Type>): Type

export function useSuspendedComputedAtom<Type>(atom: AsyncAtom<Type>, suspense = true) {
  const [value, setValue] = useState<Type>()

  useEffect(() => {
    if (!suspense) {
      atom.get().then(setValue)
    }
    const unsubscribe = atom.subscribe(newValue => {
      setValue(newValue)
    })
    return unsubscribe
  }, [atom])

  return suspense ? use(atom.init()) : value
}
