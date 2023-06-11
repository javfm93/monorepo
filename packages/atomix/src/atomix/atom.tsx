import { AtomResult, fulfil, pending } from './atomResult'

export type Subscriber<Type> = (value: Type) => void
export type AtomGetter = <A>(atom: A) => A extends Atom<infer T> ? T : never
export type ComputedAtom<Type> = (get: AtomGetter) => Type
export const isComputedAtom = <Type,>(
  initial: Type | ComputedAtom<Type>
): initial is ComputedAtom<Type> => typeof initial === 'function'

export class Atom<Type> {
  private result: AtomResult<Type> | undefined
  private subscribers = new Set<Subscriber<Type>>()

  constructor(initial: ComputedAtom<Type>)
  constructor(initial: Type)
  constructor(private initialValue: Type | ComputedAtom<Type>, readonly name = 'unknown') {}

  getResult = () => {
    if (this.wasInitialized(this.result)) {
      return this.result
    }
    if (isComputedAtom(this.initialValue)) {
      return this.getComputedValue(this.initialValue)
    }
    this.set(this.initialValue)
    return fulfil(this.initialValue)
  }

  set = (newValue: Type) => {
    this.result = fulfil(newValue)
    this.subscribers.forEach(callback => callback(newValue))
  }

  getValue = () => {
    const result = this.result ? this.result : this.getResult()

    if (result.status === 'rejected') {
      throw result.value
    }
    return result.value
  }

  subscribe = (callback: Subscriber<Type>) => {
    this.subscribers.add(callback)

    return () => {
      this.subscribers.delete(callback)
    }
  }

  private wasInitialized = (result?: AtomResult<Type>): result is AtomResult<Type> => !!result

  private getComputedValue = (computedAtom: ComputedAtom<Type>) => {
    const result = computedAtom(this.subscribeAndGetValue as AtomGetter)

    if (result instanceof Promise) {
      result.then(this.set)
      this.result = pending(result)
      return this.result
    } else {
      this.set(result)
      return fulfil(result)
    }
  }

  private subscribeAndGetValue = <T,>(atomDependency: Atom<T>) => {
    atomDependency.subscribe(this.onNewDependencyValue)
    return this.getAtom(atomDependency)
  }

  private onNewDependencyValue = async () => {
    if (isComputedAtom(this.initialValue)) {
      const newValue = await this.initialValue(this.getAtom as AtomGetter)
      this.set(newValue)
    }
  }

  private getAtom = <T,>(atom: Atom<T>) => {
    return atom.getValue()
  }
}
