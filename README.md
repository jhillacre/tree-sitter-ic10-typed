# Tree-sitter IC10 Typed

A typed [Tree-sitter](https://tree-sitter.github.io/) grammar for **IC10**, the virtual embedded language used in *Stationeers* for automation and control systems.

---

## Features

- **150+ opcodes** with case-insensitive matching (auto-generated from reference data)
- Whitespace-insensitive, line-oriented syntax
- Structured operands with per-opcode signatures
- Built-in constants and enums loaded from game metadata *(as of 0.2.5954.26176)*

---

## Getting Started

```bash
npm install
npm run generate
```

Run:

```bash
npm run highlight
```

to preview syntax scopes on sample files (add your own under `examples/`).

---

## Integrating

* Test quickly:

  ```bash
  tree-sitter highlight --scope ic10 your-file.ic10
  ```
* Build editor bindings using the generated sources under `src/`
* Extend or customize themes via `queries/highlights.scm`

---

## Status

* Parsing and highlighting verified for the full documented instruction set
* Graceful error recovery via `ERROR` nodes (rendered red in scopes)

---

## Contributing

Contributions are welcome. Missing opcodes, deprecations, or type corrections can be submitted via PRs; please include a description. Inadequately documented PRs may be closed without merging.

---

## License

MIT &copy; [Joel Hillacre](mailto:joel@403forbidden.ca)