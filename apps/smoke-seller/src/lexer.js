const functionKeyword = 'microService'

export const tokenize = (input = '') => {
  let cursor = 0
  const tokens = []
  while (cursor < input.length) {
    if (input[cursor] === ' ') {
      cursor++
      continue
    }

    // regex that take any number
    const number = /[0-9]+/
    const isNumber = character => number.test(character)

    if (isNumber(input[cursor])) {
      let number = input[cursor]
      while (isNumber(input[++cursor])) {
        number += input[cursor]
      }
      tokens.push({ type: 'number', value: Number(number) })
      continue
    }

    if (input[cursor] === '+') {
      tokens.push({ type: 'operator', value: '+' })
      cursor++
      continue
    }

    if (input.slice(cursor, cursor + functionKeyword.length) === functionKeyword) {
      tokens.push({ type: 'function', value: 'start' })
      cursor += functionKeyword.length
      continue
    }

    cursor++
  }
  return tokens
}
