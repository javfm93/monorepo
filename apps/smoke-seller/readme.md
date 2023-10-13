This project will compile smoke seller to js

lexer => lexical analysis, get the tokens
parser => syntactical analysis, make a sense of the operations, convert tokens to an AST
evaluator => go through AST and evaluate it using js returning a result
generation: parsing in reverse, given an AST, convert it to the language code
