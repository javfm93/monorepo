export const testParsedTokens = {
  number: number => [{ type: 'number', value: number }],
  operation: (number, operation, secondNumber) => [
    { type: 'number', value: number },
    { type: 'operator', value: operation },
    { type: 'number', value: secondNumber }
  ],
  function: () => [{ type: 'function', value: 'start' }]
}
