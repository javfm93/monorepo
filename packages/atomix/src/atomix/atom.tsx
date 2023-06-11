export type Subscriber<Type> = (value: Type) => void
export type Atom<Type> = {
  type: 'async' | 'sync'
  name: string
  get(): Type
  init(): AtomValue<Type>
  set(value: Type): void
  subscribe(callback: Subscriber<Type>): () => void
}
export type Fulfilled<T> = {
  status: 'fulfilled'
  result: T
}
export type Rejected = {
  status: 'rejected'
  result: unknown
}
export type Pending<T> = {
  status: 'pending'
  result: T
}
export type AtomValue<T> = Fulfilled<T> | Rejected | Pending<T>

export type AtomGetter = <T, A extends Atom<T>>(atom: A) => ReturnType<A['get']>
export type ComputedAtomGetter<Type> = (get: AtomGetter) => Type

export const isComputedAtomGetter = <Type,>(
  initial: Type | ComputedAtomGetter<Type>
): initial is ComputedAtomGetter<Type> => typeof initial === 'function'

export function atom<Type>(initial: ComputedAtomGetter<Type>): Atom<Type>
export function atom<Type>(initial: Type): Atom<Type>
export function atom<Type>(initial: Type | ComputedAtomGetter<Type>, name = 'unknown'): Atom<Type> {
  const subscribeToAtomsDependencies: AtomGetter = atom => {
    const onSubscribe = async () => {
      const newValue = await onSubscribeComputeAtom()
      subscribers.forEach(callback => callback(newValue))
    }
    atom.subscribe(onSubscribe)
    return getAtom(atom)
  }

  let value: AtomValue<Type> | undefined = undefined
  const subscribers = new Set<Subscriber<Type>>()

  const getAtom: AtomGetter = atom => {
    return atom.get() as ReturnType<(typeof atom)['get']>
  }

  const onSubscribeComputeAtom = async () => {
    const newValue = isComputedAtomGetter(initial) ? await initial(getAtom) : initial
    value = { status: 'fulfilled', result: newValue }
    return newValue
  }

  const set = (newValue: Type) => {
    value = { status: 'fulfilled', result: newValue }
    subscribers.forEach(callback => callback(newValue))
  }

  const init = () => {
    if (value) {
      return value
    } else {
      if (isComputedAtomGetter(initial)) {
        const result = initial(subscribeToAtomsDependencies)

        if (result instanceof Promise) {
          result.then(set)
          value = { status: 'pending', result }
          return value
        } else {
          set(result)
          return { status: 'fulfilled', result } as Fulfilled<Type>
        }
      } else {
        set(initial)
        return { status: 'fulfilled', result: initial } as Fulfilled<Type>
      }
    }
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

