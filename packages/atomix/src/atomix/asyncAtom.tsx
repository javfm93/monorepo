import { useEffect, useState } from 'react'

import { Subscriber } from './atom'
import { ComputedAtomGetter } from './computedAtom'

type Fulfilled<T> = {
  status: 'fulfilled'
  result: T
}
type Rejected = {
  status: 'rejected'
  result: unknown
}
type Pending<T> = {
  status: 'pending'
  result: Promise<T>
}
export type AsyncAtomValue<T> = Fulfilled<T> | Rejected | Pending<T>
export type AsyncAtomGetter<Type> = () => Promise<Type>

export const isAsyncAtomGetter = <Type,>(
  initial: Type | AsyncAtomGetter<Type> | ComputedAtomGetter<Type>
): initial is AsyncAtomGetter<Type> => typeof initial === 'function' && initial.length === 0

export type AsyncAtom<Type> = {
  type: 'async'
  name: string
  get(): Promise<Type>
  init(): AsyncAtomValue<Type>
  set(value: Type): void
  subscribe(callback: Subscriber<Type>): () => void
}

export const asyncAtom = <Type,>(
  initial: AsyncAtomGetter<Type>,
  name = 'unknown'
): AsyncAtom<Type> => {
  let value: AsyncAtomValue<Type> | undefined = undefined
  const subscribers = new Set<Subscriber<Type>>()

  const set = (newValue: Type) => {
    value = { status: 'fulfilled', result: newValue }
    subscribers.forEach(callback => callback(newValue))
  }
  const init = () => {
    if (!value) {
      const result = initial()
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

export function useAsyncAtom<Type>(atom: AsyncAtom<Type>, suspense = true) {
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

  return [suspense ? use(atom.init()) : value, atom.set] as const
}

// export function useAsyncAtomValue<Type>(
//   atom: SuspendedAtom<Type>,
//   suspense: false
// ): Type | undefined
// export function useAsyncAtomValue<Type>(atom: SuspendedAtom<Type>): Type

export function useAsyncAtomValue<Type>(atom: AsyncAtom<Type>, suspense = true) {
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

// when you throw a pending promise, react stops the rerender but do not break
export const use = <T,>(value: AsyncAtomValue<T>): T => {
  if (value.status === 'pending') {
    throw value.result
  } else if (value.status === 'fulfilled') {
    return value.result
  } else {
    throw value.result
  }
}
