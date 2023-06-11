import { useSyncExternalStore } from 'react'
import { Fulfilled } from './asyncAtom'
import { Atom, Subscriber } from './atom'

export type SyncAtom<Type> = {
  type: 'sync'
  name: string
  get(): Type
  set(value: Type): void
  subscribe(callback: Subscriber<Type>): () => void
}

export const syncAtom = <Type,>(initial: Type, name = 'unknown'): Atom<Type> => {
  let value = initial
  const subscribers = new Set<Subscriber<Type>>()

  const set = (newValue: Type) => {
    value = newValue
    subscribers.forEach(callback => callback(value))
  }

  const get = () => value
  const init = () => ({ status: 'fulfilled', result: initial } as Fulfilled<Type>)

  return {
    type: 'sync',
    name,
    get,
    init,
    set,
    subscribe: (callback: Subscriber<Type>) => {
      subscribers.add(callback)

      return () => {
        subscribers.delete(callback)
      }
    }
  }
}

export const useSyncAtom = <Type,>(atom: Atom<Type>) => {
  return [useSyncExternalStore(atom.subscribe, atom.get), atom.set] as const
}

export const useSyncAtomValue = <Type,>(atom: Atom<Type>) => {
  return useSyncExternalStore(atom.subscribe, atom.get)
}
