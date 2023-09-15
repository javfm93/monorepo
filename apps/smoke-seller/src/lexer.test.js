import { expect, test } from 'vitest'
import { tokenize } from './lexer'

test('should be able to tokenize a number', () => {
  expect(tokenize('2')).toStrictEqual([{ type: 'number', value: 2 }])
})

test('should be able to tokenize a multi digit number', () => {
  expect(tokenize('22')).toStrictEqual([{ type: 'number', value: 22 }])
})

test('should be able to tokenize a sum', () => {
  expect(tokenize('2+2')).toStrictEqual([
    { type: 'number', value: 2 },
    { type: 'operator', value: '+' },
    { type: 'number', value: 2 }
  ])
})

test('should be able to tokenize a function ', () => {
  expect(tokenize('microService')).toStrictEqual([{ type: 'function', value: 'start' }])
})
