import { Atom } from './atom'
import { useAtomSetter } from './useAtomSetter'
import { useAtomValue } from './useAtomValue'

export function useAtom<Type>(
  atom: Atom<Type>,
  suspense: false
): readonly [Awaited<Type> | undefined, (v: Awaited<Type>) => void]
export function useAtom<Type>(
  atom: Atom<Type>
): readonly [Awaited<Type>, (v: Awaited<Type>) => void]

export function useAtom<Type>(atom: Atom<Type>, suspense = true) {
  return [useAtomValue(atom, suspense), useAtomSetter(atom)] as const
}
