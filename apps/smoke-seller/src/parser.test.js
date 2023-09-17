import { expect, test } from 'vitest'
import { testParsedTokens } from './fixtures'
import { parser } from './parser'

test('should be able to parse a number', () => {
  expect(parser(testParsedTokens.number(2))).toStrictEqual({ type: 'NumericLiteral', value: 2 })
})
