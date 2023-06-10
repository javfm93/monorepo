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
type Pending = {
  status: 'pending'
  result: Promise<unknown>
}
type GetResult<T> = Fulfilled<T> | Rejected | Pending

export type SuspendedAtom<Type> = {
  name: string
  get(): GetResult<Type>
  set(value: Type): void
  subscribe(callback: Subscriber<Type>): () => void
}

export const suspendedAtom = <Type,>(
  initial: AsyncAtomGetter<Type>,
  name = 'unknown'
): SuspendedAtom<Type> => {
  let value: GetResult<Type> | undefined = undefined
  const subscribers = new Set<Subscriber<Type>>()

  const set = (newValue: Type) => {
    value = { status: 'fulfilled', result: newValue }
    subscribers.forEach(callback => callback(newValue))
  }
  const get = () => {
    if (!value) {
      console.log('init')
      value = { status: 'pending', result: initial().then(set) }
      return value
    }

    console.log('returning nice', value.result)
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

export const useSuspendedAtom = <Type,>(atom: SuspendedAtom<Type>) => {
  const [_, setValue] = useState<Type>()

  useEffect(() => {
    const unsubscribe = atom.subscribe(newValue => {
      setValue(newValue)
    })
    return unsubscribe
  }, [atom])

  return [use(atom.get()), atom.set] as const
}

export const use = <T,>(value: GetResult<T>): T => {
  if (value.status === 'pending') {
    throw value.result
  } else if (value.status === 'fulfilled') {
    return value.result
  } else {
    throw value.result
  }
}
