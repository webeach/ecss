# Tooling

## VS Code Extension

**ECSS — Extended CSS** is a Visual Studio Code extension that provides full support for `.ecss` files in the editor.

### Installation

Install directly from the VS Code Marketplace:

[![Install in VS Code](https://img.shields.io/badge/Install%20in%20VS%20Code-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white)](vscode:extension/webeach.ecss-language-support)

Or find it in the Marketplace by name **ECSS — Extended CSS**: [marketplace.visualstudio.com](https://marketplace.visualstudio.com/items?itemName=webeach.ecss-language-support)

### Features

#### Syntax highlighting

The extension registers the `ecss` language with a TextMate grammar. The following elements are highlighted:

- `@state-variant` — name and list of values
- `@state-def` — name, parameters and their types/defaults
- `@if` / `@elseif` / `@else` — keywords and conditions
- Condition operators (`==`, `!=`, `&&`, `||`)
- Parameters (custom properties `--name`)
- Types (`boolean`, variant references)
- Nested CSS — via the built-in CSS grammar

#### Error diagnostics

When a `.ecss` file is opened, the Language Server parses it in real time via `@ecss/parser` (WASM build) and displays errors directly in the editor:

```
[SEM-1] Duplicate @state-variant name: "Size"
[SEM-8] Unknown @state-variant reference: "Color"
[2:15] Expected ',' or ')'
```

Static semantics errors (rules SEM-1...SEM-11) are also diagnosed — see the [Language Specification](/en/reference/spec).

#### Hover hints

Hovering over elements in a `.ecss` file shows tooltips:

| Element                  | Shows                                                |
| ------------------------ | ---------------------------------------------------- |
| `--param` in a condition | Parameter type and default value                     |
| `@state-variant Name`    | List of declared values                              |
| `@state-def Name(...)`   | Signature: all parameters with types and defaults    |
| CSS property             | MDN documentation (via `vscode-css-languageservice`) |

### What the extension does NOT do

- **Autocompletion** in `.ecss` files — not yet implemented
- **Import typing** in TypeScript — that is handled by `@ecss/typescript-plugin`

---

## TypeScript Plugin (`@ecss/typescript-plugin`)

The TypeScript Language Service Plugin generates precise types for every `*.ecss` import directly in the IDE — no separate build step required.

### How it works

The plugin embeds in the TypeScript Language Server (tsserver) and intercepts type requests for `.ecss` files. When accessing `import styles from './Button.ecss'` the plugin:

1. Reads the `.ecss` file from disk
2. Parses it into an AST via `@ecss/parser`
3. Generates a `.d.ts` string via `@ecss/transformer`
4. Returns it as a virtual TypeScript file

As a result, the IDE sees precise types: which parameters each style factory accepts, and which values are valid for variant parameters.

### Installation

::: code-group

```sh [npm]
npm install -D @ecss/typescript-plugin
```

```sh [pnpm]
pnpm add -D @ecss/typescript-plugin
```

```sh [yarn]
yarn add -D @ecss/typescript-plugin
```

:::

### `tsconfig.json` setup

```json
{
  "compilerOptions": {
    "strict": true,
    "plugins": [{ "name": "@ecss/typescript-plugin" }]
  }
}
```

::: tip VS Code — switching to workspace TypeScript
For VS Code to use the TypeScript plugin from `node_modules` (instead of built-in TypeScript), switch to workspace TypeScript:

1. Open any `.ts` file
2. `Cmd+Shift+P` → **TypeScript: Select TypeScript Version**
3. Choose **Use Workspace Version**

Or add to `.vscode/settings.json`:

```json
{
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

:::

### What developers get

Full type safety when working with `.ecss`:

```ts
import styles from './Button.ecss';

// ✅ Correct — all parameters are optional (have defaults)
const attrs = styles.Button({ variant: 'primary' });

// ✅ Valid values are suggested via autocomplete
const attrs2 = styles.Button({ variant: 'danger', size: 'lg' });

// ❌ TypeScript error — 'xl' is not declared in @state-variant Size
const attrs3 = styles.Button({ size: 'xl' });

// ❌ TypeScript error — 'Foo' does not exist in the import
const bar = styles.Foo();
```

### Passing configuration

The plugin automatically reads `ecss.config.json` from the project root. You can also pass options in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "@ecss/typescript-plugin",
        "classAttribute": "class",
        "classTemplate": "[name]-[hash:6]"
      }
    ]
  }
}
```

### Limitations

- The plugin only works in the **IDE** (via Language Service). The `tsc` command does not use Language Service Plugins.
- For type checking at build time via `tsc`, use `generateDeclarations: true` in the config — `.ecss.d.ts` files will be generated next to sources and picked up by `tsc` automatically.

### Supported editors

Any editor using the TypeScript Language Service (tsserver):

- **Visual Studio Code** — full support
- **WebStorm / JetBrains IDEs** — via built-in TypeScript Language Server
- **Neovim** with `nvim-lspconfig` + `tsserver` — works
- **Helix**, **Zed** and other editors with TypeScript LSP support — works
