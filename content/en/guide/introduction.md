# Introduction

## What is ECSS?

**ECSS (Extended CSS)** is a stylesheet language that extends CSS with three new constructs for declarative component state management:

| Construct                   | Purpose                                                   |
| --------------------------- | --------------------------------------------------------- |
| `@state-variant`            | Declares a named enumeration of string values             |
| `@state-def`                | Declares a parameterized set of CSS rules for a component |
| `@if` / `@elseif` / `@else` | Selects CSS rules based on parameter values               |

ECSS is a **strict superset of CSS**: any valid CSS is valid ECSS. The browser never receives ECSS directly — `.ecss` files are transformed into standard CSS at build time.

## What problem does ECSS solve?

### The standard approach: CSS Modules + JavaScript

A typical React component with variants looks like this:

```tsx
import styles from './Button.module.css';

function Button({ variant, size, disabled }) {
  const className = [
    styles.button,
    variant === 'primary' && styles.primary,
    variant === 'danger' && styles.danger,
    size === 'sm' && styles.small,
    size === 'lg' && styles.large,
    disabled && styles.disabled,
  ]
    .filter(Boolean)
    .join(' ');

  return <button className={className}>...</button>;
}
```

Problems:

- Conditional logic is **spread** between the CSS file and the component
- Adding a new variant requires changes in both files
- There is no single source of truth about which states a component actually has

### The ECSS approach

```ecss
@state-variant Variant {
  values: primary, danger, ghost;
}

@state-def Button(--variant Variant, --size Size: md, --disabled boolean) {
  display: inline-flex;
  cursor: pointer;

  @if (--disabled) {
    opacity: 0.4;
    cursor: not-allowed;
  }

  @if (--variant == primary) {
    background: #646cff;
    color: #fff;
  }
  @elseif (--variant == danger) {
    background: #e53e3e;
    color: #fff;
  }
  @else {
    background: transparent;
  }
}
```

```tsx
import styles from './Button.ecss';

function Button({ variant, size, disabled }) {
  return <button {...styles.Button({ variant, size, disabled })}>...</button>;
}
```

All state logic lives in the `.ecss` file. The component simply passes props — it knows nothing about CSS classes.

## Key principles

### CSS superset

ECSS does not redefine or restrict CSS. CSS Nesting, media queries, pseudo-classes — all work inside `@state-def` and `@if` blocks as usual.

### Build-time transformation

ECSS files are processed by Vite via the `@ecss/vite-plugin` plugin. The output is:

- **CSS** — regular classes with data-attributes for states
- **JS** — factory functions that return an attribute object when called

### Type safety

The `@ecss/typescript-plugin` TypeScript plugin analyzes the AST of each `.ecss` file and generates precise types. Passing a nonexistent variant value or omitting a required parameter is a compile-time error.

## Ecosystem components

```
┌─────────────────────────────────────────────┐
│                 *.ecss file                 │
└──────────────────────┬──────────────────────┘
                       │
              @ecss/parser (Rust/WASM)
                       │ AST
              @ecss/transformer
                       │
          ┌────────────┼────────────┐
         CSS           JS          d.ts
          │            │            │
       bundler     component    TypeScript
```

| Package                                                                        | Role                                          |
| ------------------------------------------------------------------------------ | --------------------------------------------- |
| [`@ecss/parser`](https://github.com/webeach/ecss-parser)                       | Rust parser (napi-rs), returns AST            |
| [`@ecss/transformer`](https://github.com/webeach/ecss-transformer)             | AST → CSS + JS + d.ts transformer             |
| [`@ecss/vite-plugin`](https://github.com/webeach/ecss-vite-plugin)             | Vite plugin for `.ecss` files                 |
| [`@ecss/typescript-plugin`](https://github.com/webeach/ecss-typescript-plugin) | Language Service Plugin for precise IDE types |
| [`@ecss/vscode-extension`](https://github.com/webeach/ecss-vscode-extension)   | VS Code: highlighting, diagnostics, hover     |

## What's next?

- [Getting Started](/en/guide/getting-started) — installation and first working example
- [Core Concepts](/en/guide/concepts) — details on `@state-variant`, `@state-def` and `@if`
- [Integrations](/en/guide/frameworks/react) — usage with React, Vue, Svelte, SolidJS
