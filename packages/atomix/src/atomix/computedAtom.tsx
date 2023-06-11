import { useSyncExternalStore } from 'react'
import { Subscriber } from './atom'
import { SyncAtom } from './syncAtom'

export type AtomGetter = <T>(a: SyncAtom<T>) => T
export type ComputedAtomGetter<Type> = (get: AtomGetter) => Type

export const computedAtom = <Type,>(
  initial: ComputedAtomGetter<Type>,
  name = 'unknown'
): SyncAtom<Type> => {
  const subscribeToAtomsDependencies = <T,>(atom: SyncAtom<T>) => {
    const onSubscribe = () => {
      onSubscribeComputeAtom()
      subscribers.forEach(callback => callback(value))
    }
    atom.subscribe(onSubscribe)
    return atom.get()
  }

  let value = initial(subscribeToAtomsDependencies)
  const subscribers = new Set<Subscriber<Type>>()

  const getAtom = <T,>(atom: SyncAtom<T>) => atom.get()

  const onSubscribeComputeAtom = () => {
    value = initial(getAtom)
  }

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

export const useComputedAtom = <Type,>(atom: SyncAtom<Type>) => {
  return useSyncExternalStore(atom.subscribe, atom.get)
}
