import { useEffect, useState, useSyncExternalStore } from 'react'

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

// todo: better way to handle subscribers
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
  const computeAtom = () => {
    value = isAtomGetter(initial) ? initial(getAtom) : initial
  }
  computeAtom()

  const subscribers = new Set<Subscriber<Type>>()

  return {
    name,
    get: () => value,
    set: (newValue: Type) => {
      value = newValue
      subscribers.forEach(callback => callback(value))
    },
    subscribe: (callback: Subscriber<Type>) => {
      subscribers.add(callback)

      return () => {
        subscribers.delete(callback)
      }
    }
  }
}

export const useAtom = <Type,>(atom: Atom<Type>) => {
  const [value, setValue] = useState(atom.get())

  useEffect(() => {
    const unsubscribe = atom.subscribe(newValue => {
      console.log('triggered subscription of', atom.name)
      setValue(newValue)
    })
    return unsubscribe
  }, [atom])

  return [value, atom.set] as const
}

export const useAtomValue = <Type,>(atom: Atom<Type>) => {
  return useSyncExternalStore(atom.subscribe, atom.get)
}
