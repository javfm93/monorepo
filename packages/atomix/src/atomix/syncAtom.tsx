import { useSyncExternalStore } from 'react'
import { Subscriber } from './atom'


export type SyncAtom<Type> = {
  type: 'sync'
  name: string
  get(): Type
  set(value: Type): void
  subscribe(callback: Subscriber<Type>): () => void
}

export const syncAtom = <Type,>(initial: Type, name = 'unknown'): SyncAtom<Type> => {
  let value = initial
  const subscribers = new Set<Subscriber<Type>>()

  const set = (newValue: Type) => {
    value = newValue
    subscribers.forEach(callback => callback(value))
  }

  const get = () => value

  return {
    type: 'sync',
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

export const useSyncAtom = <Type,>(atom: SyncAtom<Type>) => {
  return [useSyncExternalStore(atom.subscribe, atom.get), atom.set] as const
}

export const useSyncAtomValue = <Type,>(atom: SyncAtom<Type>) => {
  return useSyncExternalStore(atom.subscribe, atom.get)
}
