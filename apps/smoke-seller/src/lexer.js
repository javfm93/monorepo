import { keywords } from './shared/keyWords'
import { isNumber } from './shared/matchers'
import { tokenTypes } from './shared/tokenTypes'

export const tokenize = (input = '') => {
  let cursor = 0
  const tokens = []
  while (cursor < input.length) {
    if (input[cursor] === ' ') {
      cursor++
      continue
    }

    if (isNumber(input[cursor])) {
      let number = input[cursor]
      while (isNumber(input[++cursor])) {
        number += input[cursor]
      }
      tokens.push({ type: tokenTypes.number, value: Number(number) })
      continue
    }

    if (input[cursor] === '+') {
      tokens.push({ type: tokenTypes.operator, value: '+' })
      cursor++
      continue
    }

    if (input.slice(cursor, cursor + keywords.function.length) === keywords.function) {
      tokens.push({ type: tokenTypes.function, value: 'start' })
      cursor += keywords.function.length
      continue
    }

    cursor++
  }
  return tokens
}
