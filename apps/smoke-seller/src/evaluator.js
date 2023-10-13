const env = {
  add: (a, b) => a + b,
  PI: Math.PI
}

const apply = node => {
  const fn = env[node.name]
  const args = node.arguments.map(evaluator)
  if (!fn) {
    throw new TypeError(`${node.name} is not a function`)
  }
  return fn(...args)
}

const getIdentifier = node => {
  if (env[node.name]) return env[node.name]
  throw new ReferenceError(`${node.name} is not defined`)
}

export const evaluator = node => {
  if (node.type === 'CallExpression') {
    return apply(node)
  }

  if (node.type === 'Identifier') {
    return getIdentifier(node)
  }
  if (node.value) {
    return node.value
  }
}
