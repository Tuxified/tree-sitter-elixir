#include "tree_sitter/parser.h"
#include <vector>
#include <cwctype>
#include <cstring>
#include <cassert>
#include <stdio.h>
namespace {

using std::vector;
using std::iswspace;
using std::memcpy;

enum TokenType {
  NEWLINE,
  /* INDENT, */
  /* DEDENT, */
  /* STRING_START, */
  /* STRING_CONTENT, */
  /* STRING_END, */
};

struct Scanner {
  Scanner() {
    deserialize(NULL, 0);
  }

  unsigned serialize(char *buffer) {
    return 0;
  }

  void deserialize(const char *buffer, unsigned length) {
  }

  void skip(TSLexer *lexer) {
    lexer->advance(lexer, true);
  }

  bool scan(TSLexer *lexer, const bool *valid_symbols) {
    if (lexer->lookahead == '\n') {
      lexer->result_symbol = NEWLINE;
      return true;
    } else if (lexer->lookahead == '\r') {
      lexer->result_symbol = NEWLINE;
      return true;
    } else if (lexer->lookahead == 0) {
      lexer->result_symbol = NEWLINE;
      return true;
    } else {
      return false;
    }
  }
};

}

extern "C" {

void *tree_sitter_elixir_external_scanner_create() {
  return new Scanner();
}

bool tree_sitter_elixir_external_scanner_scan(void *payload, TSLexer *lexer,
                                            const bool *valid_symbols) {
  Scanner *scanner = static_cast<Scanner *>(payload);
  return scanner->scan(lexer, valid_symbols);
}

unsigned tree_sitter_elixir_external_scanner_serialize(void *payload, char *buffer) {
  Scanner *scanner = static_cast<Scanner *>(payload);
  return scanner->serialize(buffer);
}

void tree_sitter_elixir_external_scanner_deserialize(void *payload, const char *buffer, unsigned length) {
  Scanner *scanner = static_cast<Scanner *>(payload);
  scanner->deserialize(buffer, length);
}

void tree_sitter_elixir_external_scanner_destroy(void *payload) {
  Scanner *scanner = static_cast<Scanner *>(payload);
  delete scanner;
}

}
