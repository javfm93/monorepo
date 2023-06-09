import { useSyncExternalStore } from 'react'
import { AsyncAtom } from './asyncAtom'

export type Subscriber<Type> = (value: Type) => void

export type Atom<Type> = {
  name: string
  get(): Type
  set(value: Type): void
  subscribe(callback: Subscriber<Type>): () => void
}

export const atom = <Type,>(initial: Type, name = 'unknown'): Atom<Type> => {
  let value = initial
  const subscribers = new Set<Subscriber<Type>>()

  const set = (newValue: Type) => {
    value = newValue
    subscribers.forEach(callback => callback(value))
  }

  const get = () => value

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

export const useAtom = <Type,>(atom: Atom<Type>) => {
  return [useSyncExternalStore(atom.subscribe, atom.get), atom.set] as const
}

export const useAtomValue = <Type,>(atom: Atom<Type>) => {
  return useSyncExternalStore(atom.subscribe, atom.get)
}

export const useAtomSetter = <Type,>(atom: Atom<Type> | AsyncAtom<Type>) => {
  return atom.set
}
