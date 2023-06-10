import { useEffect, useState } from 'react'
import { Atom, Subscriber } from './atom'
import { SuspendedAtom, SuspendedAtomValue, use } from './suspendedAtom'

type Get = <T, A extends SuspendedAtom<T> | Atom<T>>(atom: A) => ReturnType<A['get']>
export type SuspendedComputedAtom<Type> = (get: Get) => Promise<Type>

export const SuspendedComputedAtom = <Type,>(
  initial: SuspendedComputedAtom<Type>,
  name = 'unknown'
): SuspendedAtom<Type> => {
  const subscribeToAtomsDependencies: Get = atom => {
    const onSubscribe = async () => {
      const newValue = await onSubscribeComputeAtom()
      subscribers.forEach(callback => callback(newValue))
    }
    atom.subscribe(onSubscribe)
    return getAtom(atom)
  }

  let value: SuspendedAtomValue<Type> | undefined = undefined
  const subscribers = new Set<Subscriber<Type>>()

  const getAtom: Get = atom => {
    return atom.get() as ReturnType<(typeof atom)['get']>
  }

  const onSubscribeComputeAtom = async () => {
    const newValue = await initial(getAtom)
    value = { status: 'fulfilled', result: newValue }
    return newValue
  }

  const set = (newValue: Type) => {
    value = { status: 'fulfilled', result: newValue }
    subscribers.forEach(callback => callback(newValue))
  }

  const init = () => {
    if (!value) {
      console.log('init')
      const result = initial(subscribeToAtomsDependencies)
      result.then(set)
      value = { status: 'pending', result }
      return value
    }

    console.log('returning nice', value.result)
    return value
  }

  const get = () => {
    const result = value ? value : init()

    if (result.status === 'rejected') {
      throw result.result
    }
    return Promise.resolve(result.result)
  }

  return {
    name,
    init,
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

export const useSuspendedComputedAtom = <Type,>(atom: SuspendedAtom<Type>) => {
  const [_, setValue] = useState<Type>()

  useEffect(() => {
    const unsubscribe = atom.subscribe(newValue => {
      setValue(newValue)
    })
    return unsubscribe
  }, [atom])

  return use(atom.init())
}
