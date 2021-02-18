# tree-sitter-elixir

[![Build Status](https://github.com/Tuxified/tree-sitter-elixir/workflows/build/badge.svg)](https://github.com/Tuxified/tree-sitter-elixir/actions)

Elixir grammar for [tree-sitter](https://github.com/tree-sitter/tree-sitter), you can try it out in the [playground](https://tuxified.github.io/tree-sitter-elixir/).

## References

- [Elixirs parser](https://github.com/elixir-lang/elixir/blob/master/lib/elixir/src/elixir_parser.yrl)
- [Forked from](https://github.com/wingyplus/tree-sitter-elixir) by @wingyplus
- [Tree sitter Erlang](https://github.com/abstractmachineslab/tree-sitter-erlang/) by @ostera
- [IntelliJ Elixir plugin](https://github.com/KronicDeth/intellij-elixir/blob/master/src/org/elixir_lang/Elixir.flex) by @kronicdeth

## Status

Current status (not mentioned parts are not implemented):

### map

- [x] empty
- [x] with one key and value
- [x] with many keys and values
- [x] error

### struct

- [x] empty
- [x] with one key and value
- [x] with many keys and values
- [x] error with string key

### bitstring

- [x] empty
- [x] with integer
- [x] with integer and type-specifier
- [x] with integer and multiple type-specifier
- [x] with integer and bit-pattern size
- [x] with integer and bit-pattern size and type-specifier
- [x] with integer and bit-pattern size and multiple type-specifiers
- [x] with float
- [x] with float and type-specifier
- [x] with float and multiple type-specifier
- [x] with float and bit-pattern size
- [x] with float and bit-pattern size and type-specifier
- [x] with float and bit-pattern size and multiple type-specifiers
- [x] with string
- [x] with many components

### boolean

- [x] Boolean

### number

- [x] Integer
- [x] Negative
- [x] Integer Multi Digits
- [x] Integer With Underscore
- [x] Binary Integer
- [x] Binary Integer With Underscore
- [x] Hex Integer
- [x] Hex Integer With Underscore
- [x] Octal Integer
- [x] Octal Integer With Underscore
- [x] Float
- [x] Float large
- [x] Float With Underscore
- [x] Float With Underscore + Scientific Notation
- [x] Float With Underscore + Scientific Notation 2
- [x] Float negative
- [x] Float with negative exponential/scientific notation

### module_attribute

- [x] moduledoc attribute

### atom

- [x] Atom - Unquoted
- [x] Atom - Operator
- [x] Atom - Quoted
- [ ] Atom - Unicode support (depends on https://github.com/tree-sitter/tree-sitter/issues/95)

### sigil

- [x] empty
- [x] string
- [x] braced
- [x] multiline
- [x] regex with modifier
- [x] only single char sigil

### module_functions

- [x] zero arity function
- [x] zero arity function with parens
- [x] single arity function
- [x] plural arity function
- [x] short hand function

### string

- [x] String - Single line
- [x] String - Single line with escaped double quote
- [x] String - Multi Line
- [x] String - Concatenation
- [x] String - Multi Line with internal double quotes

### list

- [x] List - Empty list
- [x] List With Elements
- [x] List - Error
- [x] List - Trailing Separator

### module

- [x] Module with atom
- [x] Module with Elixir uppercase atom

### tuple

- [x] Tuple
- [x] Tuple - Error
- [x] Tuple - Trailing Separator

### Anonymous Functions

- [x] without args
- [x] multiple clauses
- [x] multiple clauses with guard

### variable
- [x] snake_case
- [x] camelCase
- [x] ends in ?
- [x] ends in !

### keyword_list:
- [x] Keyword empty list
- [x] Keyword list shorthand syntax
- [x] Keyword list tuple syntax
- [x] Keyword list error - shorthand before tuple syntax
- [x] Keyword list mixed - tuples + shorthand

### charlist
- [x] Charlist - Single line
- [x] Single line with escaped quote
- [x] Charlist - Multi line
- [x] Charlist - Multi line with internal quote
- [x] Char - Single
- [x] Char - list

### string_interpolation
- [x] basic
- [x] with operator
- [x] with text
- [x] in mutil line strings
- [x] interpolating strings in strings
- [x] interpolating strings in strings with operator

### operators
- [x] Unary operators
- [x] Operators with left associativity
- [x] op right associativity

### for_comprehension
- [x] For - list generator
- [x] For - bistring generator
- [x] For - filter tuple
- [x] For - square list
- [ ] For - with options (into:, reduce: , unique: )


## TODO

- tests, tests, tests
- use, import, require and other macro/function calls in module body?
- function capture (&Enum.map/2)
- pipe operator (does it need special treatment?)
- doctest (# iex> ... ) ?
- elaborate flow control (if+else, with)
- default arguments & function heads without body; def a(b, c \\ [])
- records?
- fix difference between alias (Modulename) & others things like qualified function calls
- optional parens (ex. function calls)
- optional semicolon
- anonymous function calls ( fib.(4) )
- bugfixes, edge cases, bugfixes....
