import {
  AsyncAtom,
  AsyncAtomGetter,
  asyncAtom,
  isAsyncAtomGetter,
  useAsyncAtom,
  useAsyncAtomValue
} from './asyncAtom'
import { SyncAtom, syncAtom, useSyncAtom, useSyncAtomValue } from './syncAtom'

export type Subscriber<Type> = (value: Type) => void

export function atom<Type>(initial: AsyncAtomGetter<Type>): AsyncAtom<Type>
export function atom<Type>(initial: Type): SyncAtom<Type>
export function atom<Type>(
  initial: Type | AsyncAtomGetter<Type>,
  name = 'unknown'
): SyncAtom<Type> | AsyncAtom<Type> {
  if (isAsyncAtomGetter(initial)) {
    return asyncAtom(initial, name)
  } else {
    return syncAtom(initial, name)
  }
}

export function useAtom<Type>(
  atom: AsyncAtom<Type>,
  suspense: false
): readonly [Type | undefined, (value: Type) => void]
export function useAtom<Type>(atom: AsyncAtom<Type>): readonly [Type, (value: Type) => void]
export function useAtom<Type>(atom: SyncAtom<Type>): readonly [Type, (value: Type) => void]
export function useAtom<Type>(atom: SyncAtom<Type> | AsyncAtom<Type>, suspense = true) {
  if (atom.type === 'sync') {
    return useSyncAtom(atom)
  } else {
    return useAsyncAtom(atom, suspense)
  }
}

export function useAtomValue<Type>(atom: AsyncAtom<Type>, suspense: false): Type | undefined
export function useAtomValue<Type>(atom: AsyncAtom<Type>): Type
export function useAtomValue<Type>(atom: SyncAtom<Type>): Type
export function useAtomValue<Type>(atom: SyncAtom<Type> | AsyncAtom<Type>, suspense = true) {
  if (atom.type === 'sync') {
    return useSyncAtomValue(atom)
  } else {
    return useAsyncAtomValue(atom, suspense)
  }
}

export const useAtomSetter = <Type,>(atom: SyncAtom<Type> | AsyncAtom<Type>) => {
  return atom.set
}
