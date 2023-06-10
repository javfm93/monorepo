import { useEffect, useState } from 'react'

import { AsyncAtomGetter } from './asyncAtom'
import { Subscriber } from './atom'

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
export type SuspendedAtomValue<T> = Fulfilled<T> | Rejected | Pending<T>

export type SuspendedAtom<Type> = {
  name: string
  get(): Promise<Type>
  init(): SuspendedAtomValue<Type>
  set(value: Type): void
  subscribe(callback: Subscriber<Type>): () => void
}

export const suspendedAtom = <Type,>(
  initial: AsyncAtomGetter<Type>,
  name = 'unknown'
): SuspendedAtom<Type> => {
  let value: SuspendedAtomValue<Type> | undefined = undefined
  const subscribers = new Set<Subscriber<Type>>()

  const set = (newValue: Type) => {
    value = { status: 'fulfilled', result: newValue }
    subscribers.forEach(callback => callback(newValue))
  }
  const init = () => {
    if (!value) {
      console.log('init')
      const result = initial()
      result.then(set)
      value = { status: 'pending', result }
      return value
    }

    console.log('returning nice', value.result)
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

export const useSuspendedAtom = <Type,>(atom: SuspendedAtom<Type>) => {
  const [_, setValue] = useState<Type>()

  useEffect(() => {
    const unsubscribe = atom.subscribe(newValue => {
      setValue(newValue)
    })
    return unsubscribe
  }, [atom])

  return [use(atom.init()), atom.set] as const
}

export const use = <T,>(value: SuspendedAtomValue<T>): T => {
  if (value.status === 'pending') {
    throw value.result
  } else if (value.status === 'fulfilled') {
    return value.result
  } else {
    throw value.result
  }
}