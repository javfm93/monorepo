import { useEffect, useState } from 'react'

import { Atom, Subscriber } from './atom'

export type Fulfilled<T> = {
  status: 'fulfilled'
  result: T
}
export type Rejected = {
  status: 'rejected'
  result: unknown
}
export type Pending<T> = {
  status: 'pending'
  result: T
}
export type AsyncAtomValue<T> = Fulfilled<T> | Rejected | Pending<T>
export type AsyncAtomGetter<Type> = () => Type

export type AsyncAtom<Type> = {
  type: 'async'
  name: string
  get(): Type
  init(): AsyncAtomValue<Type>
  set(value: Type): void
  subscribe(callback: Subscriber<Type>): () => void
}

export function useAsyncAtom<Type>(atom: Atom<Type>, suspense = true) {
  const [value, setValue] = useState<Awaited<Type>>()

  useEffect(() => {
    if (!suspense) {
      const getter = atom.get()
      if (getter instanceof Promise) {
        getter.then(setValue)
      }
    }
    const unsubscribe = atom.subscribe(async newValue => {
      setValue(await newValue)
    })
    return unsubscribe
  }, [atom])

  return [suspense ? use(atom.init()) : value, (v: Awaited<Type>) => atom.set(v)] as const
}

export function useAsyncAtomValue<Type>(atom: Atom<Type>, suspense = true) {
  const [value, setValue] = useState<Type>()

  useEffect(() => {
    if (!suspense) {
      const getter = atom.get()
      if (getter instanceof Promise) {
        getter.then(setValue)
      }
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
