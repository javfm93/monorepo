import {
  AsyncAtom,
  AsyncAtomGetter,
  AsyncAtomValue,
  Fulfilled,
  useAsyncAtomValue
} from './asyncAtom'
import { Atom, Subscriber } from './atom'
import { useSyncAtomValue } from './syncAtom'

export type TotalAtomGetter = <T, A extends Atom<T>>(atom: A) => ReturnType<A['get']>
export type TotalComputedAtomGetter<Type> = (get: TotalAtomGetter) => Type

export const isComputedAtomGetter = <Type,>(
  initial: Type | AsyncAtomGetter<Type> | TotalComputedAtomGetter<Type>
): initial is TotalComputedAtomGetter<Type> => typeof initial === 'function'

export const totalComputedAtom = <Type,>(
  initial: TotalComputedAtomGetter<Type>,
  name = 'unknown'
): Atom<Type> => {
  const subscribeToAtomsDependencies: TotalAtomGetter = atom => {
    const onSubscribe = async () => {
      const newValue = await onSubscribeComputeAtom()
      subscribers.forEach(callback => callback(newValue))
    }
    atom.subscribe(onSubscribe)
    return getAtom(atom)
  }

  let value: AsyncAtomValue<Type> | undefined = undefined
  const subscribers = new Set<Subscriber<Type>>()

  const getAtom: TotalAtomGetter = atom => {
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
      const result = initial(subscribeToAtomsDependencies)

      if (result instanceof Promise) {
        result.then(set)
        value = { status: 'pending', result }
        return value
      } else {
        set(result)
        return { status: 'fulfilled', result } as Fulfilled<Type>
      }
    }

    return value
  }

  const get = () => {
    const result = value ? value : init()

    if (result.status === 'rejected') {
      throw result.result
    }
    return result.result
  }

  return {
    type: 'async',
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

export function useTotalComputedAtom<Type>(
  atom: Atom<Type>,
  suspense: false
): Awaited<Type> | undefined
export function useTotalComputedAtom<Type>(atom: Atom<Type>): Awaited<Type>

export function useTotalComputedAtom<Type>(atom: Atom<Type>, suspense = true) {
  if (atom.type === 'sync') {
    return useSyncAtomValue(atom)
  } else {
    return useAsyncAtomValue(atom as AsyncAtom<Type>, suspense)
  }
}
