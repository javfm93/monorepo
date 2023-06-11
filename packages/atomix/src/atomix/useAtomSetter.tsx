import { Atom } from './atom'

export function useAtomSetter<Type>(atom: Atom<Type>): (value: Awaited<Type>) => void
export function useAtomSetter<Type>(atom: Atom<Type>): (value: Type) => void

export function useAtomSetter<Type>(atom: Atom<Type>) {
  return atom.set
}
