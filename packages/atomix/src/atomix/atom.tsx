import { useSyncExternalStore } from 'react'

export type Subscriber<Type> = (value: Type) => void

export type Atom<Type> = {
  name: string
  get(): Type
  set(value: Type): void
  subscribe(callback: Subscriber<Type>): () => void
}

export type AtomGetter<Type> = (get: <T>(a: Atom<T>) => T) => Type

const isAtomGetter = <Type,>(initial: Type | AtomGetter<Type>): initial is AtomGetter<Type> => {
  return typeof initial === 'function'
}

const isAsyncResult = <Type,>(value: Type | Promise<Type>): value is Promise<Type> => {
  return value && typeof value === 'object' && 'then' in value && typeof value.then === 'function'
}

export const atom = <Type,>(initial: Type | AtomGetter<Type>, name = 'unknown'): Atom<Type> => {
  let value = isAtomGetter(initial) ? (null as Type) : initial

  const getAtom = <T,>(atom: Atom<T>) => {
    let currentValue = atom.get()
    const onSubscribe = (newValue: T) => {
      if (currentValue === newValue) {
        return
      }
      currentValue = newValue
      computeAtom()
      subscribers.forEach(callback => callback(value))
    }
    atom.subscribe(onSubscribe)
    return currentValue
  }
  const set = (newValue: Type) => {
    value = newValue
    subscribers.forEach(callback => callback(value))
  }

  const computeAtom = () => {
    if (isAtomGetter(initial)) {
      const newValue = initial(getAtom)

      if (isAsyncResult(newValue)) {
        newValue.then(set)
      } else {
        value = newValue
      }
    } else {
      value = initial
    }
  }
  computeAtom()

  const subscribers = new Set<Subscriber<Type>>()

  return {
    name,
    get: () => value,
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
