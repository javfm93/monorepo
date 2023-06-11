import { useEffect, useState } from 'react'
import { Atom } from './atom'
import { AtomResult } from './atomResult'

export function useAtomValue<Type>(atom: Atom<Type>, suspense: false): Awaited<Type> | undefined
export function useAtomValue<Type>(atom: Atom<Type>): Awaited<Type>
export function useAtomValue<Type>(atom: Atom<Type>, suspense: boolean): Awaited<Type> | undefined

export function useAtomValue<Type>(atom: Atom<Type>, suspense = true) {
  const [value, setValue] = useState<Type>()

  useEffect(() => {
    if (!suspense) {
      const getter = atom.getValue()
      if (getter instanceof Promise) {
        getter.then(setValue)
      } else {
        setValue(getter)
      }
    }
    const unsubscribe = atom.subscribe(newValue => {
      setValue(newValue)
    })
    return unsubscribe
  }, [atom])

  return suspense ? use(atom.getResult()) : value
}

// when you throw a pending promise, react stops the rerender but do not break
export const use = <T,>(value: AtomResult<T>): T => {
  if (value.status === 'pending') {
    throw value.value
  } else if (value.status === 'fulfilled') {
    return value.value
  } else {
    throw value.value
  }
}
