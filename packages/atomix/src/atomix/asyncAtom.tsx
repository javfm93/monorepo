import { useEffect, useState } from 'react'
import { Subscriber } from './atom'

export type AsyncAtom<Type> = {
  name: string
  get(): Promise<Type>
  set(value: Type): void
  subscribe(callback: Subscriber<Type>): () => void
}
export type AsyncAtomGetter<Type> = () => Promise<Type>

export const asyncAtom = <Type,>(
  initial: AsyncAtomGetter<Type>,
  name = 'unknown'
): AsyncAtom<Type> => {
  const subscribers = new Set<Subscriber<Type>>()

  return {
    name,
    get: initial,
    set: (newValue: Type) => {
      subscribers.forEach(callback => callback(newValue))
    },
    subscribe: (callback: Subscriber<Type>) => {
      subscribers.add(callback)

      return () => {
        subscribers.delete(callback)
      }
    }
  }
}
export const useAsyncAtom = <Type,>(atom: AsyncAtom<Type>) => {
  const [value, setValue] = useState<Type>()

  useEffect(() => {
    atom.get().then(setValue)
    const unsubscribe = atom.subscribe(newValue => {
      setValue(newValue)
    })
    return unsubscribe
  }, [atom])

  return [value, atom.set] as const
}
