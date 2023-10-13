import { tokenTypes } from './shared/tokenTypes'

export const ASTTypes = {
  number: 'NumericLiteral'
}

// implement callExpression
export const parser = (tokens = []) => {
  const nextToken = tokens.pop()
  if (nextToken.type === tokenTypes.number) {
    return {
      type: ASTTypes.number,
      value: nextToken.value
    }
  }
}
