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

## FAQ

### Why? Doesn't Elixir ship with a parser?

Tree-sitter aims to be a tool to easily produce a fast, embeddable parser for
tools like syntax highlighting in editors, more richer diff analysis in GitHub
and code (security) analysers. As LSP is a tool meant to be used by all editors
and for all languages, such is Tree-sitter when it comes to parsers.

### What's the current status? Is it done yet?

Lots of the syntax has already been done, but there's also lots to be done.
In case you want a taste, take it for a spin on the [playground](https://tuxified.github.io/tree-sitter-elixir/)

### (How) Can I contribute?

- Try it out, see if you find bugs which are not part of the issues list (amd report them plz)
- If you have time and like to code: take a look at the issues list and call dibs on one
- If you see spelling mistakes, would like to make the playground better in any way or think you can improve this project in any other way, feel free to reach out (either via issues or in private)

### I have a different question / would like to chat in private

Feel free to open an issue with your question. My handle on Twitter/Elixir Forum/Slack/[Elixir Discord](https://discord.gg/elixir) is Tuxified, it's also the first part of my @gmail.com email adres.
