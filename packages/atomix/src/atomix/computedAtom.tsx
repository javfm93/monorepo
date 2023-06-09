import { useSyncExternalStore } from 'react'
import { Atom, Subscriber } from './atom'

type Get = <T>(a: Atom<T>) => T
export type ComputedAtom<Type> = (get: Get) => Type

export const computedAtom = <Type,>(initial: ComputedAtom<Type>, name = 'unknown'): Atom<Type> => {
  const subscribeToAtomsDependencies = <T,>(atom: Atom<T>) => {
    console.log('get called')
    const onSubscribe = () => {
      console.log('subscribe triggered!')
      onSubscribeComputeAtom()
      subscribers.forEach(callback => callback(value))
    }
    atom.subscribe(onSubscribe)
    return atom.get()
  }
  
  let value = initial(subscribeToAtomsDependencies)
  const subscribers = new Set<Subscriber<Type>>()

  const getAtom = <T,>(atom: Atom<T>) => atom.get()

  const onSubscribeComputeAtom = () => {
    value = initial(getAtom)
  }

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

export const useComputedAtom = <Type,>(atom: Atom<Type>) => {
  return useSyncExternalStore(atom.subscribe, atom.get)
}
