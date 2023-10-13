import { expect, test } from 'vitest'
import { evaluator } from './evaluator'
import { testParsedTokens } from './fixtures'
import { parser } from './parser'

test('should be able to evaluate an ast with a number', () => {
  expect(evaluator(parser(testParsedTokens.number(2))).toBe(2))
})

test('should be able to evaluate an ast with a sum', () => {
  expect(evaluator(parser(testParsedTokens.operation(2, '+', 2))).toBe(2))
})
