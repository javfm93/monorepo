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

test('should be able to tokenize a variable', () => {
  expect(tokenize('ppt a = 2')).toStrictEqual('variable def')
})

test('should be able to use a variable', () => {
  expect(tokenize('ppt a = 2; ppt b = a + 2')).toStrictEqual('variable use')
})

test('should be able to tokenize a function ', () => {
  expect(
    tokenize(
      `microService sum(a, b) {
        return a + b
      }`
    )
  ).toStrictEqual(testParsedTokens.function())
})

test('should be able to use a function ', () => {
  expect(
    tokenize(
      `microService sum(a, b) {
        return a + b
      }
      ppt a = sum(1, 2);`
    )
  ).toStrictEqual('variable use')
})
