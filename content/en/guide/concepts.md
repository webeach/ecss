# Core Concepts

ECSS introduces three new constructs on top of standard CSS. This page describes each one in detail.

## `@state-variant` — enumerations

`@state-variant` declares a named set of allowed string values — analogous to an enum in TypeScript.

### Syntax

```ecss
@state-variant VariantName {
  values: value1, value2, value3;
}
```

The variant name **must** start with an uppercase letter (PascalCase). Values are identifiers or quoted strings.

### Examples

```ecss
@state-variant Size {
  values: sm, md, lg;
}

@state-variant Theme {
  values: light, dark, "high contrast";
}

@state-variant Status {
  values: idle, loading, error, success;
}
```

### Why use variants?

Variants serve two purposes:

1. **Parameter typing** — a parameter of type `Variant` in `@state-def` can only accept declared values. Passing an unknown value is an error.
2. **Self-documentation** — all valid states are listed in one place.

::: tip Naming rules

- Variant names: PascalCase, declared at the top level of the file
- Values: lowercase identifiers or quoted strings (for values with spaces)
- All `@state-variant` names in one file must be unique
  :::

---

## `@state-def` — state definitions

`@state-def` is the core ECSS construct. It declares a style component with parameters and a CSS rule body that depends on those parameters.

### Syntax

```ecss
@state-def ComponentName(parameters) {
  /* regular CSS + @if chains */
}
```

### Parameters

A parameter is a custom property (`--name`) with an optional type and default value.

#### Parameter syntax table

| Syntax               | Type              | Default value   |
| -------------------- | ----------------- | --------------- |
| `--p`                | `boolean`         | `false`         |
| `--p boolean`        | `boolean`         | `false`         |
| `--p boolean: true`  | `boolean`         | `true`          |
| `--p boolean: false` | `boolean`         | `false`         |
| `--p Variant`        | variant reference | none (required) |
| `--p Variant: value` | variant reference | specified value |

#### Boolean parameters

```ecss
@state-def Card(--elevated, --outlined boolean: false) {
  border-radius: 12px;
  padding: 24px;

  @if (--elevated) {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @if (--outlined) {
    border: 1px solid #e0e0e0;
  }
}
```

Calling `styles.Card({ elevated: true })` — shadow is on, border is off.

#### Variant parameters

```ecss
@state-variant Size {
  values: sm, md, lg;
}

@state-def Button(--size Size: md) {
  @if (--size == sm) {
    padding: 4px 8px;
    font-size: 12px;
  }
  @elseif (--size == md) {
    padding: 8px 16px;
    font-size: 14px;
  }
  @else {
    padding: 12px 24px;
    font-size: 16px;
  }
}
```

#### Component without parameters

Parameters can be omitted entirely — this is simply an isolated style block:

```ecss
@state-def Container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}
```

Calling `styles.Container()` returns an object with only the base class.

### Rule body

Everything allowed in regular CSS is allowed inside `@state-def`:

```ecss
@state-def Panel(--expanded boolean) {
  padding: 16px;
  transition: all 0.2s;

  /* CSS nesting works */
  & > .title {
    font-weight: bold;
  }

  &:hover {
    background: #f5f5f5;
  }

  /* @if can be nested */
  @if (--expanded) {
    max-height: 1000px;

    & > .content {
      opacity: 1;
    }
  }
}
```

### Naming rules

- `@state-def` names: PascalCase
- `@state-def` and `@state-variant` names in the same file must not overlap
- All `@state-def` in one file must have unique names

---

## `@if` / `@elseif` / `@else` — conditional styles

`@if` chains let you apply CSS rules depending on the values of `@state-def` parameters.

### Syntax

```ecss
@if (condition) {
  /* CSS rules */
}
@elseif (another condition) {
  /* CSS rules */
}
@else {
  /* CSS rules */
}
```

::: warning Important
`@elseif` and `@else` must follow **immediately** after the closing `}` of the previous block. Only whitespace and CSS comments are allowed between them.
:::

### Comparison operators

#### Value comparison

```ecss
@if (--variant == primary) {
  /* ... */
}
@if (--variant != ghost) {
  /* ... */
}
```

- For boolean parameters: compare with `true` or `false`
- For variant parameters: compare with a value from `@state-variant`

#### Shorthand for boolean

```ecss
/* These two are equivalent: */
@if (--disabled) {
  /* ... */
}
@if (--disabled == true) {
  /* ... */
}
```

### Logical operators

#### `&&` — both conditions are true

```ecss
@if (--expanded && --theme == dark) {
  background: #121212;
  color: #fff;
}
```

#### `||` — at least one condition is true

```ecss
@if (--expanded || --pinned) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

### Operator precedence

| Priority    | Operator  | Description |
| ----------- | --------- | ----------- |
| 1 (highest) | `( )`     | Grouping    |
| 2           | `==` `!=` | Comparison  |
| 3           | `&&`      | Logical AND |
| 4 (lowest)  | `\|\|`    | Logical OR  |

```ecss
/* (--a == x || --b) && --c */
@if ((--a == x || --b) && --c) {
  /* ... */
}
```

### Nested conditions

`@if` chains can be nested to any depth:

```ecss
@state-variant Theme {
  values: light, dark;
}

@state-def Panel(--expanded boolean, --theme Theme: light, --pinned boolean) {
  @if (--expanded) {
    max-height: 1000px;

    @if (--theme == dark) {
      background: #121212;

      @if (--pinned) {
        border: 2px solid #0077ff;
      }
    }
  }
}
```

### Full example with multiple branches

```ecss
@state-variant Status {
  values: idle, loading, error, success;
}

@state-def Badge(--status Status: idle) {
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  padding: 2px 10px;
  font-size: 12px;
  font-weight: 500;

  @if (--status == idle) {
    background: #f0f0f0;
    color: #555;
  }
  @elseif (--status == loading) {
    background: #e0f0ff;
    color: #0055cc;
  }
  @elseif (--status == error) {
    background: #ffe0e0;
    color: #cc0000;
  }
  @else {
    background: #e0ffe0;
    color: #006600;
  }
}
```

---

## CSS compatibility

ECSS does not forbid or alter any CSS constructs. You can mix regular CSS rules and ECSS constructs in one file:

```ecss
/* Regular CSS — fully valid */
*, *::before, *::after {
  box-sizing: border-box;
}

@media (prefers-color-scheme: dark) {
  body { background: #0a0a0a; }
}

/* ECSS constructs */
@state-variant Theme { values: light, dark; }

@state-def Button(--theme Theme: light) {
  /* ... */
}
```

::: info
`@state-variant` and `@state-def` may only appear at the **top level** of a file (not inside other rules). `@if` may only appear **inside** a `@state-def` body.
:::
