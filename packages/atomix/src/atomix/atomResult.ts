export type Fulfilled<T> = {
  status: 'fulfilled'
  value: T
}
export type Rejected = {
  status: 'rejected'
  value: unknown
}
export type Pending<T> = {
  status: 'pending'
  value: T
}
export type AtomResult<T> = Fulfilled<T> | Rejected | Pending<T>
export const fulfil = <T>(value: T): Fulfilled<T> => ({ status: 'fulfilled', value: value })
export const pending = <T>(value: T): Pending<T> => ({ status: 'pending', value: value })
