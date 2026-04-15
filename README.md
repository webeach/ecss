<div align="center">
  <img alt="ECSS" src="./content/public/logo.svg" height="240">
  <p><a href="./README.md">🇬🇧 English version</a> | <a href="./README.ru.md">🇷🇺 Русская версия</a></p>
  <p><strong>ECSS (Extended CSS)</strong> — a language that extends CSS with three constructs for declarative component state management directly in stylesheets.</p>
  <p>
    <a href="https://ecss.webea.ch">📖 Documentation</a>
  </p>
</div>

---

```ecss
@state-variant Size {
  values: sm, md, lg;
}

@state-variant Theme {
  values: light, dark;
}

@state-def Button(--size Size, --theme Theme) {
  padding: 8px 16px;

  @if (--size == sm) {
    padding: 4px 8px;
  }
  @elseif (--size == lg) {
    padding: 12px 24px;
  }

  @if (--theme == dark) {
    background: #1a1a1a;
    color: #fff;
  }
}
```

`.ecss` files compile into plain CSS and typed JS style factories that return CSS classes and state `data`-attributes.

## Packages

| Repository                                                                          | npm                                                                                                                                                                                                                                | Description                                      |
| ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| [webeach/ecss-parser](https://github.com/webeach/ecss-parser)                       | [![npm](https://img.shields.io/npm/v/@ecss/parser.svg?color=646fe1&labelColor=9B7AEF)](https://www.npmjs.com/package/@ecss/parser)                                                                                                 | Rust-based ECSS parser (napi-rs), returns AST    |
| [webeach/ecss-transformer](https://github.com/webeach/ecss-transformer)             | [![npm](https://img.shields.io/npm/v/@ecss/transformer.svg?color=646fe1&labelColor=9B7AEF)](https://www.npmjs.com/package/@ecss/transformer)                                                                                       | AST → CSS + JS + d.ts transformer                |
| [webeach/ecss-vite-plugin](https://github.com/webeach/ecss-vite-plugin)             | [![npm](https://img.shields.io/npm/v/@ecss/vite-plugin.svg?color=646fe1&labelColor=9B7AEF)](https://www.npmjs.com/package/@ecss/vite-plugin)                                                                                       | Vite plugin for `.ecss` files                    |
| [webeach/ecss-typescript-plugin](https://github.com/webeach/ecss-typescript-plugin) | [![npm](https://img.shields.io/npm/v/@ecss/typescript-plugin.svg?color=646fe1&labelColor=9B7AEF)](https://www.npmjs.com/package/@ecss/typescript-plugin)                                                                           | TypeScript Language Service Plugin for IDEs      |
| [webeach/ecss-vscode-extension](https://github.com/webeach/ecss-vscode-extension)   | [![VS Code](https://img.shields.io/visual-studio-marketplace/v/webeach.ecss-language-support?color=646fe1&labelColor=9B7AEF&label=marketplace)](https://marketplace.visualstudio.com/items?itemName=webeach.ecss-language-support) | VS Code: syntax highlighting, diagnostics, hover |

---

## 👨‍💻 Author

Developed and maintained by [Ruslan Martynov](https://github.com/ruslan-mart).

Found a bug or have a suggestion? Open an issue or submit a pull request.

---

## 📄 License

Distributed under the [MIT License](./LICENSE).
