import { AsyncAtomValue, useAsyncAtom, useAsyncAtomValue } from './asyncAtom'
import { syncAtom, useSyncAtom, useSyncAtomValue } from './syncAtom'
import {
  TotalComputedAtomGetter,
  isComputedAtomGetter,
  totalComputedAtom
} from './totalComputedAtom'

export type Subscriber<Type> = (value: Type) => void
export type Atom<Type> = {
  type: 'async' | 'sync'
  name: string
  get(): Type
  init(): AsyncAtomValue<Type>
  set(value: Type): void
  subscribe(callback: Subscriber<Type>): () => void
}

export function atom<Type>(initial: TotalComputedAtomGetter<Type>): Atom<Type>
export function atom<Type>(initial: Type): Atom<Type>
export function atom<Type>(
  initial: Type | TotalComputedAtomGetter<Type>,
  name = 'unknown'
): Atom<Type> {
  if (isComputedAtomGetter(initial)) {
    return totalComputedAtom(initial, name)
  } else {
    return syncAtom(initial, name)
  }
}

export function useAtom<Type>(
  atom: Atom<Type>,
  suspense: false
): readonly [Awaited<Type> | undefined, (v: Awaited<Type>) => void]
export function useAtom<Type>(
  atom: Atom<Type>
): readonly [Awaited<Type>, (v: Awaited<Type>) => void]
export function useAtom<Type>(atom: Atom<Type>, suspense = true) {
  if (atom.type === 'sync') {
    return useSyncAtom(atom)
  } else {
    return useAsyncAtom(atom, suspense)
  }
}

export function useAtomValue<Type>(atom: Atom<Type>, suspense = true) {
  if (atom.type === 'sync') {
    return useSyncAtomValue(atom)
  } else {
    return useAsyncAtomValue(atom, suspense)
  }
}

export function useAtomSetter<Type>(atom: Atom<Type>): (value: Awaited<Type>) => void
export function useAtomSetter<Type>(atom: Atom<Type>): (value: Type) => void
export function useAtomSetter<Type>(atom: Atom<Type>) {
  return atom.set
}
