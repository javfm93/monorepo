import { expect, test } from 'vitest'
import { testParsedTokens } from './fixtures'
import { tokenize } from './lexer'

test('should be able to tokenize a number', () => {
  expect(tokenize('2')).toStrictEqual(testParsedTokens.number(2))
})

test('should be able to tokenize a multi digit number', () => {
  expect(tokenize('22')).toStrictEqual(testParsedTokens.number(22))
})

test('should be able to tokenize a sum', () => {
  expect(tokenize('2+2')).toStrictEqual(testParsedTokens.operation(2, '+', 2))
})

test('should be able to tokenize a function ', () => {
  expect(tokenize('microService')).toStrictEqual(testParsedTokens.function())
})
