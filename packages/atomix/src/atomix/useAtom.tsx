import { useEffect, useState } from 'react'
import { Atom, AtomValue } from './atom'

export function useAtom<Type>(
  atom: Atom<Type>,
  suspense: false
): readonly [Awaited<Type> | undefined, (v: Awaited<Type>) => void]
export function useAtom<Type>(
  atom: Atom<Type>
): readonly [Awaited<Type>, (v: Awaited<Type>) => void]
export function useAtom<Type>(atom: Atom<Type>, suspense = true) {
  const [value, setValue] = useState<Type>()

  useEffect(() => {
    if (!suspense) {
      const getter = atom.get()
      if (getter instanceof Promise) {
        getter.then(setValue)
      } else {
        setValue(getter)
      }
    }
    const unsubscribe = atom.subscribe(async newValue => {
      setValue(await newValue)
    })
    return unsubscribe
  }, [atom])

  return [suspense ? use(atom.init()) : value, (v: Awaited<Type>) => atom.set(v)] as const
}

export function useAtomValue<Type>(atom: Atom<Type>, suspense: false): Awaited<Type> | undefined
export function useAtomValue<Type>(atom: Atom<Type>): Awaited<Type>
export function useAtomValue<Type>(atom: Atom<Type>, suspense = true) {
  const [value, setValue] = useState<Type>()

  useEffect(() => {
    if (!suspense) {
      const getter = atom.get()
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

  return suspense ? use(atom.init()) : value
}

// when you throw a pending promise, react stops the rerender but do not break
export const use = <T,>(value: AtomValue<T>): T => {
  if (value.status === 'pending') {
    throw value.result
  } else if (value.status === 'fulfilled') {
    return value.result
  } else {
    throw value.result
  }
}

export function useAtomSetter<Type>(atom: Atom<Type>): (value: Awaited<Type>) => void
export function useAtomSetter<Type>(atom: Atom<Type>): (value: Type) => void
export function useAtomSetter<Type>(atom: Atom<Type>) {
  return atom.set
}
