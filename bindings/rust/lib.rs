use tree_sitter::Language;

extern "C" {
    fn tree_sitter_elixir() -> Language;
}

/// Returns the tree-sitter [Language][] for this grammar.
///
/// [Language]: https://docs.rs/tree-sitter/*/tree_sitter/struct.Language.html
pub fn language() -> Language {
    unsafe { tree_sitter_elixir() }
}

/// The source of the Elixir tree-sitter grammar description.
pub const GRAMMAR: &'static str = include_str!("../../grammar.js");

/// The content of the [`node-types.json`][] file for this grammar.
///
/// [`node-types.json`]: https://tree-sitter.github.io/tree-sitter/using-parsers#static-node-types
pub const NODE_TYPES: &'static str = include_str!("../../src/node-types.json");

#[cfg(test)]
mod tests {
    #[test]
    fn can_load_grammar() {
        let code = r#"
            defmodule Test do
              def foo() do
                1
              end
            end
        "#;
        let mut parser = tree_sitter::Parser::new();
        parser
            .set_language(super::language())
            .expect("Error loading Elixir grammar");
        let parsed = parser.parse(code, None).unwrap();

        assert_eq!(
            parsed.root_node().to_sexp(),
            "(source_file (defmodule modulename: (alias) (do_block (def (identifier) (do_block (number))))))"
        );
    }
}
