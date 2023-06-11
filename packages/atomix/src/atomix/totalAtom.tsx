import {
  AsyncAtom,
  AsyncAtomGetter,
  AsyncAtomValue,
  asyncAtom,
  isAsyncAtomGetter,
  useAsyncAtom,
  useAsyncAtomValue
} from './asyncAtom'
import { Subscriber, useAtomSetter } from './atom'
import { SyncAtom, syncAtom, useSyncAtom, useSyncAtomValue } from './syncAtom'

export type TotalAtom<Type> = {
  type: 'async' | 'sync'
  name: string
  get(): Type
  init(): AsyncAtomValue<Type>
  set(value: Type): void
  subscribe(callback: Subscriber<Type>): () => void
}

export const totalAtom = <Type,>(
  initial: AsyncAtomGetter<Type> | Type,
  name = 'unknown'
): TotalAtom<Type> => {
  if (isAsyncAtomGetter(initial)) {
    return asyncAtom(initial, name)
  } else {
    const atom = syncAtom(initial, name)
    return { ...atom, init: () => ({ status: 'fulfilled', result: initial }) }
  }
}

export function useTotalAtom<Type>(atom: TotalAtom<Type>, suspense = true) {
  if (atom.type === 'sync') {
    return useSyncAtom(atom as SyncAtom<Type>)
  } else {
    return useAsyncAtom(atom as AsyncAtom<Type>, suspense)
  }
}

export function useTotalAtomValue<Type>(atom: TotalAtom<Type>, suspense = true) {
  if (atom.type === 'sync') {
    return useSyncAtomValue(atom as SyncAtom<Type>)
  } else {
    return useAsyncAtomValue(atom as AsyncAtom<Type>, suspense)
  }
}

export function useTotalAtomSetter<Type>(atom: TotalAtom<Type>, suspense = true) {
  if (atom.type === 'sync') {
    return useAtomSetter(atom as SyncAtom<Type>)
  } else {
    return useAtomSetter(atom as AsyncAtom<Type>)
  }
}
