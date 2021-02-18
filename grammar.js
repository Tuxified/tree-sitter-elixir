///////////////////////////////////////////////////////////////////////////////
//
// Tokens
//
///////////////////////////////////////////////////////////////////////////////

const DECIMAL_DIGIT = /[0-9]/;
const BINARY_DIGIT = /[0-1]/;
const HEX_DIGIT = /[0-9a-fA-F]/;
const OCTAL_DIGIT = /[0-7]/;

const decimalDigits = seq(
  DECIMAL_DIGIT,
  repeat(seq(optional("_"), DECIMAL_DIGIT))
);
const binaryDigits = seq(
  "0b",

  BINARY_DIGIT,
  optional("_"),
  repeat(seq(optional("_"), BINARY_DIGIT))
);
const hexDigits = seq(
  "0x",
  HEX_DIGIT,
  optional("_"),
  repeat(seq(optional("_"), HEX_DIGIT))
);
const octalDigits = seq(
  "0o",
  OCTAL_DIGIT,
  optional("_"),
  repeat(seq(optional("_"), OCTAL_DIGIT))
);

const integer = seq(
  optional("-"),
  choice(decimalDigits, binaryDigits, hexDigits, octalDigits)
);

const pos_int = choice(decimalDigits, binaryDigits, hexDigits, octalDigits);

const float = seq(
  optional("-"),
  decimalDigits,
  ".",
  decimalDigits,
  repeat(seq(optional(choice("e", "E")), optional("-"), DECIMAL_DIGIT))
);

const symbolOperators = choice(
  "@",
  ".",
  "+",
  "-",
  "!",
  "^",
  "not",
  "~~~",
  "*",
  "/",
  "++",
  "--",
  "..",
  "<>",
  "+++",
  "---",
  "^^^",
  "|>",
  "<<<",
  ">>>",
  "<<~",
  "~>>",
  "<~",
  "~>",
  "<~>",
  "<|>",
  ">",
  "<",
  "<=",
  ">=",
  "==",
  "!=",
  "=~",
  "===",
  "!==",
  "&&",
  "&&&",
  "||",
  "|||",
  "=",
  "&",
  "|",
  "::",
  "<-",
  "\\\\" // "\\"
);

const OP1 = ["+", "-", "!", "not", "bnot", "^", "~~~"];
const OP2_LEFT_ASSOC = [
  "*",
  "+",
  "-",
  "/",
  "!=",
  "<",
  "=<",
  "==",
  ">",
  ">=",
  "and",
  "band",
  "&&&",
  "bor",
  "|||",
  "bsl",
  "<<<",
  "bsr",
  ">>>",
  "bxor",
  "^^^",
  "or",
  "...",
  "..",
  "|>",
  "<>",
  // custom operators, can be used by libs
  "<<~",
  "~>>",
  "<~",
  "~>",
  "<~>",
  "<|>",
  "+++",
  "---",
];
const OP2_RIGHT_ASSOC = ["=~", "++", "--", "::"];

const ARROW = "->";
const AT_OP = "@";
const IN_OP = "<-";
const BINARY_LEFT = "<<";
const BINARY_RIGHT = ">>";
const BRACE_LEFT = "{";
const BRACE_RIGHT = "}";
const BRACKET_LEFT = "[";
const BRACKET_RIGHT = "]";
const CHEVRON_LEFT = "<";
const CHEVRON_RIGHT = ">";
const COLON = ":";
const COMMA = ",";
const DASH = "-";
const DOUBLE_COLON = "::";
const DOT_OP = ".";
const DOT_DOT = "..";
const DOT_DOT_DOT = "...";
const EQUAL = "=";
const FAT_ARROW = "=>";
const REV_FAT_ARROW = "<=";
const HASH = "#";
const PARENS_LEFT = "(";
const PARENS_RIGHT = ")";
const PERCENT = "%";
const PIPE = "|";
const DOUBLE_PIPE = "||";
const QUESTION = "?";
const SEMI = ";";
const SLASH = "/";
const UNDERSCORE = "_";
const STAR = "*";
const TILDE = "~";

// TODO: unicode support.
const singleLineCharlist = seq("'", repeat(/./), "'");

// TODO: unicode support.
const multiLineCharlist = seq("'''", repeat(choice(/./, /\n/)), "'''");

///////////////////////////////////////////////////////////////////////////////
//
// Precedences
//
///////////////////////////////////////////////////////////////////////////////

// TODO: use correct rule, this is Erlangs
const PREC = {
  UNARY_OP: 10,
  BINARY_OP: 9,
  MODULE_DECLARATION: 8,
  FUNCTION_CLAUSE: 7,
  FUNCTION_NAME: 5,
  EXPR_MAP_UPDATE: 9,
  PARENTHESIZED_EXPRESSION: 6,
  EXPR_LIST_CONS: 5,
  EXPRESSION: 4,
  PATTERN: 3,
  MACRO_APPLICATION: 1,
  COMMENT: -2,
  MATCH: -1, // prefer other expressions to matches
};

///////////////////////////////////////////////////////////////////////////////
//
// Combinators
//
///////////////////////////////////////////////////////////////////////////////
const sepBy = (sep, x) => seq(x, repeat(seq(sep, x)));
const delim = (open, x, close) => seq(open, x, close);

const tuple = (x) => delim(BRACE_LEFT, optional(sepBy(COMMA, x)), BRACE_RIGHT);
const list = (x) =>
  delim(BRACKET_LEFT, optional(sepBy(COMMA, x)), BRACKET_RIGHT);
const parens = (x) => delim(PARENS_LEFT, x, PARENS_RIGHT);
const optionalParens = (x) => choice(delim(PARENS_LEFT, x, PARENS_RIGHT), x);
const args = (x) => field("arguments", parens(optional(sepBy(COMMA, x))));

const oneOf = (x) => choice.apply(null, x);

///////////////////////////////////////////////////////////////////////////////
//
// Grammar
//
///////////////////////////////////////////////////////////////////////////////

module.exports = grammar({
  name: "elixir",

  word: ($) => $.identifier,
  // extras: ($) => [/[\x00-\x20\x80 -\xA0]/, $.comment],
  extras: ($) => [/\s|\n/, $.comment],
  // inline: ($) => [$._term, $._expression],

  rules: {
    source_file: ($) => repeat(choice($.defmodule, $._expression)),

    comment: ($) => token(prec(PREC.COMMENT, /#.*\n/)),

    number: ($) => token(choice(integer, float)),

    atom: ($) =>
      token(
        choice(
          seq(
            ":",
            /[_a-zA-Z]/u,
            repeat(/[0-9a-zA-Z_@]/u),
            optional(choice("?", "!"))
          ),
          seq(":", symbolOperators),
          // TODO: unicode support, once possible ->
          // /[@_0-9\p{Letter}\P{Letter}]/u \p{L} matches any Letter in unicode category, requireqs /u flag
          seq(":", choice("'", '"'), repeat(/[0-9a-zA-Z_@]/), choice("'", '"'))
        )
      ),
    // used in maps and keyword lists
    _reverse_atom: ($) =>
      token(
        choice(
          seq(
            /[_a-zA-Z]/,
            repeat(/[0-9a-zA-Z_@]/),
            optional(choice("?", "!")),
            token.immediate(COLON)
          ),
          seq(symbolOperators, token.immediate(COLON)),
          seq(
            choice("'", '"'),
            repeat(/[0-9a-zA-Z_@]/),
            choice("'", '"'),
            token.immediate(COLON)
          )
        )
      ),
    alias: ($) => seq(/[A-Z]/, repeat(/[0-9a-zA-Z_.]/)),

    // TODO: unicode string support
    string: ($) =>
      choice(
        // single line string
        seq('"', repeat(choice($.interpolation, /./, /\\"/)), '"'),
        // multi line string
        seq('"""', repeat(choice($.interpolation, /./, /\n/)), '"""')
      ),
    interpolation: ($) => seq("#{", optional($._expression), "}"),

    charlist: ($) => token(choice(singleLineCharlist, multiLineCharlist)),
    char: ($) => seq(QUESTION, /[^\s]/),

    binary_string: ($) =>
      seq(BINARY_LEFT, optional(sepBy(COMMA, $.bin_part)), BINARY_RIGHT),
    bin_part: ($) =>
      seq(choice($.number, $.string, $.variable), optional($.bin_type_list)),
    // _bin_sized: ($) =>
    //   choice(pos_int, seq("size", PARENS_LEFT, pos_int, PARENS_RIGHT)),
    bin_type_list: ($) => seq(DOUBLE_COLON, sepBy(DASH, $.bin_type)),
    // TODO: allow size type `<< 10 :: size(32)>>`
    bin_type: ($) =>
      choice(
        "big",
        "binary",
        "bits",
        "bitstring",
        "bytes",
        "float",
        "integer",
        "little",
        "native",
        "signed",
        "unsigned",
        "utf16",
        "utf32",
        "utf8",
        alias($.number, "size")
      ),

    boolean: ($) =>
      choice("true", "false", ":true", ":false", ":'true'", ":'false'"),

    list: ($) => prec(PREC.EXPR_LIST_CONS, choice($._list, $.list_cons)),

    _list: ($) =>
      seq(
        BRACKET_LEFT,
        optional($._trailing_comma_separator_elements),
        BRACKET_RIGHT
      ),

    list_cons: ($) =>
      delim(
        BRACKET_LEFT,
        seq(
          field("head", sepBy(COMMA, $._expression)),
          PIPE,
          field("tail", $._expression)
        ),
        BRACKET_RIGHT
      ),

    keyword_list: ($) =>
      choice(
        seq(BRACKET_LEFT, sepBy(COMMA, $.keywordlist_entry), BRACKET_RIGHT)
      ),
    _bare_keyword_list: ($) => seq(alias($._reverse_atom, $.atom), $._term),
    keywordlist_entry: ($) =>
      prec(
        PREC.PARENTHESIZED_EXPRESSION,
        choice(
          seq(alias($._reverse_atom, $.atom), $._term),
          seq(BRACE_LEFT, $.atom, COMMA, $._term, BRACE_RIGHT)
        )
      ),

    map: ($) =>
      seq(
        PERCENT,
        BRACE_LEFT,
        optional(sepBy(COMMA, $.map_entry)),
        BRACE_RIGHT
      ),
    map_entry: ($) =>
      seq(
        choice(seq($._term, FAT_ARROW), alias($._reverse_atom, $.atom)),
        $._term
      ),

    struct: ($) =>
      seq(
        PERCENT,
        field("modulename", choice($.alias, $.variable)),
        BRACE_LEFT,
        optional(sepBy(COMMA, $.struct_entry)),
        BRACE_RIGHT
      ),
    struct_entry: ($) =>
      seq(
        choice(seq($.atom, FAT_ARROW), alias($._reverse_atom, $.atom)),
        $._term
      ),

    sigil: ($) =>
      token(
        seq(
          TILDE,
          /[a-zA-Z]/,
          choice(
            delim(BRACE_LEFT, repeat(/./), BRACE_RIGHT),
            delim(BRACKET_LEFT, repeat(/./), BRACKET_RIGHT),
            delim(CHEVRON_LEFT, repeat(/./), CHEVRON_RIGHT),
            delim(PARENS_LEFT, repeat(/./), PARENS_RIGHT),
            delim(PIPE, repeat(/./), PIPE),
            delim(SLASH, repeat(/./), SLASH),
            delim('"', repeat(/./), '"'),
            delim("'", repeat(/./), "'"),
            delim('"""', repeat(choice(/./, /\n/)), '"""'),
            delim("'''", repeat(choice(/./, /\n/)), "'''")
          ),
          repeat(/[a-zA-Z]/)
        )
      ),

    tuple: ($) =>
      seq(
        BRACE_LEFT,
        optional($._trailing_comma_separator_elements),
        BRACE_RIGHT
      ),

    variable: ($) =>
      /[_a-z\xC0-\xD6\xD8-\xDE\xDF-\xF6\xF8-\xFF][_a-zA-Z0-9\xC0-\xD6\xD8-\xDE]*[?!]?/,
    identifier: ($) => /[a-z_]+/,

    _trailing_comma_separator_elements: ($) =>
      seq(sepBy(COMMA, $._expression), optional(COMMA)),

    // TOOO: elaborate to actual expression rule, stub
    _expression: ($) =>
      choice(
        prec(PREC.PARENTHESIZED_EXPRESSION, parens($._expr)),
        prec(PREC.EXPRESSION, $._expr)
      ),
    _expr: ($) =>
      choice(
        $.number,
        $.atom,
        $.string,
        $.binary_string,
        $.char,
        $.charlist,
        $.boolean,
        $.keyword_list,
        alias($._bare_keyword_list, $.keyword_list),
        $.list,
        $.tuple,
        $.struct,
        $.map,
        $.def,
        $.module_attribute,
        $.sigil,
        $.function_call,
        $.match,
        $.variable,
        $.expr_op,
        $.lambda,
        $.for_list_comprehension,
        $.case,
        $.cond,
        $.if,
        $.unless
        // $.alias, TODO: this breaks function calls etc
      ),
    _term: ($) =>
      choice(
        $.number,
        $.atom,
        $.string,
        $.char,
        $.charlist,
        $.binary_string,
        $.boolean,
        $.keyword_list,
        $.list,
        $.tuple,
        $.struct,
        $.map,
        $.module_attribute,
        $.sigil,
        // $.function_call,
        // $.match,
        $.variable
      ),

    defmodule: ($) =>
      seq(
        "defmodule",
        field("modulename", choice($.alias, $.atom)),
        $.do_block
      ),
    module_attribute: ($) => seq(AT_OP, $.identifier, $._expression),

    def: ($) =>
      seq(
        choice("def", "defp"),
        choice($.atom, $.identifier),
        optional(args($.variable)),
        optional($.guard_clause),
        $.do_block
      ),

    do_block: ($) =>
      choice(
        seq("do", repeat($._expression), "end"),
        seq(", do:", $._expression)
      ),
    lambda: ($) => seq("fn", repeat($.lambda_clause), "end"),
    lambda_clause: ($) =>
      seq(
        field(
          "arguments",
          optional(choice(parens(optional($.pattern)), $.pattern))
        ),
        optional($.guard_clause),
        ARROW,
        field("body", $._expression)
      ),
    guard_clause: ($) => seq("when", $._expression),

    match: ($) =>
      prec.right(PREC.MATCH, seq($._expression, EQUAL, $._expression)),

    pattern: ($) =>
      prec(
        PREC.PATTERN,
        choice($._term, $.variable, $._pat_list, $._pat_tuple)
      ),
    _pat_list: ($) => prec(PREC.PATTERN, $.list),
    _pat_tuple: ($) => prec(PREC.PATTERN, $.tuple),

    function_call: ($) =>
      seq(field("name", $._function_name), args($._expression)),
    _function_name: ($) =>
      prec(
        PREC.FUNCTION_NAME,
        choice($.computed_function_name, $.qualified_function_name)
      ),
    qualified_function_name: ($) =>
      seq(
        field("module_name", choice($.alias, $.atom, parens($._expression))),
        DOT_OP,
        field(
          "function_name",
          choice($.variable, $.atom, parens($._expression))
        )
      ),
    computed_function_name: ($) =>
      prec(
        PREC.FUNCTION_NAME,
        choice($.variable, $.atom, parens($._expression))
      ),

    expr_op: ($) => choice($._expr_operator_unary, $._expr_operator_binary),

    _expr_operator_unary: ($) =>
      prec.right(
        PREC.UNARY_OP,
        seq(field("operator", oneOf(OP1)), field("operand", $._expression))
      ),

    _expr_operator_binary: ($) =>
      choice(
        prec.left(
          PREC.BINARY_OP,
          seq(
            field("lhs", $._expression),
            field("operator", oneOf(OP2_LEFT_ASSOC)),
            field("rhs", $._expression)
          )
        ),
        prec.right(
          PREC.BINARY_OP,
          seq(
            field("lhs", $._expression),
            field("operator", oneOf(OP2_RIGHT_ASSOC)),
            field("rhs", $._expression)
          )
        )
      ),

    for_list_comprehension: ($) =>
      seq(
        "for",
        repeat1(choice($.for_list_generator, $.for_bitstring_generator)),
        optional(seq(COMMA, $.for_list_filter)),
        // optional(seq(COMMA, "into: ", $._term)),
        // optional(seq(COMMA, "reduce: ", $._term)),
        // optional(seq(COMMA, "unique: ", $.boolean)),
        $.do_block
      ),
    for_list_generator: ($) => seq($._expression, IN_OP, $._expression),
    for_list_filter: ($) => sepBy(COMMA, $._expression),
    for_bitstring_generator: ($) =>
      seq(
        BINARY_LEFT,
        sepBy(COMMA, $.bin_part),
        IN_OP,
        choice($.binary_string, $.variable, $.function_call),
        BINARY_RIGHT
      ),

    case: ($) => seq("case", $._expression, "do", repeat($.case_clause), "end"),
    case_clause: ($) =>
      seq(
        field("arguments", optional(optionalParens($.pattern))),
        optional($.guard_clause),
        ARROW,
        field("body", $._expression)
      ),

    cond: ($) => seq("cond", "do", repeat($.cond_clause), "end"),
    cond_clause: ($) =>
      seq(
        field(
          "arguments",
          optional(choice(parens(optional($.pattern)), $.pattern))
        ),
        optional($.guard_clause),
        ARROW,
        field("body", $._expression)
      ),

    if: ($) => seq("if", $._expression, $.do_block),
    unless: ($) => seq("unless", $._expression, $.do_block),
  },
});
