# Getting Started

## Installation

Add the packages to your Vite project:

::: code-group

```sh [npm]
npm install -D @ecss/vite-plugin @ecss/typescript-plugin
```

```sh [pnpm]
pnpm add -D @ecss/vite-plugin @ecss/typescript-plugin
```

```sh [yarn]
yarn add -D @ecss/vite-plugin @ecss/typescript-plugin
```

:::

## Vite Configuration

Register the plugin in `vite.config.ts`. The ECSS plugin must come **before** your framework plugin:

::: code-group

```ts [React]
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import ecss from '@ecss/vite-plugin';

export default defineConfig({
  plugins: [
    ecss(), // ← ECSS first
    react(),
  ],
});
```

```ts [Vue]
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import ecss from '@ecss/vite-plugin';

export default defineConfig({
  plugins: [ecss(), vue()],
});
```

```ts [Svelte]
// vite.config.ts
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import ecss from '@ecss/vite-plugin';

export default defineConfig({
  plugins: [ecss(), svelte()],
});
```

```ts [SolidJS]
// vite.config.ts
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import ecss from '@ecss/vite-plugin';

export default defineConfig({
  plugins: [ecss(), solid()],
});
```

:::

## TypeScript Setup

Add the TypeScript plugin to `tsconfig.json` to get precise types for `*.ecss` imports:

```json
// tsconfig.json (or tsconfig.app.json)
{
  "compilerOptions": {
    "plugins": [{ "name": "@ecss/typescript-plugin" }]
  }
}
```

::: tip
The TypeScript plugin only works in the IDE (via Language Service). For full type checking during build (`tsc`), use the `generateDeclarations` option — see [Configuration](/en/guide/configuration) for details.
:::

## Your first .ecss file

Create a `Button.ecss` file next to your component:

```ecss
@state-variant Variant {
  values: primary, danger, ghost;
}

@state-def Button(--variant Variant: primary, --disabled boolean) {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;

  @if (--disabled) {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
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
    border: 1px solid currentColor;
  }
}
```

## Using it in a component

::: code-group

```tsx [React (Button.tsx)]
import styles from './Button.ecss';

type Props = {
  variant?: 'primary' | 'danger' | 'ghost';
  disabled?: boolean;
  children: React.ReactNode;
};

export function Button({ variant = 'primary', disabled, children }: Props) {
  return <button {...styles.Button({ variant, disabled })}>{children}</button>;
}
```

```vue [Vue (Button.vue)]
<script setup lang="ts">
import styles from './Button.ecss';

interface Props {
  variant?: 'primary' | 'danger' | 'ghost';
  disabled?: boolean;
}

const { variant = 'primary', disabled } = defineProps<Props>();
</script>

<template>
  <button v-bind="styles.Button({ variant, disabled })">
    <slot />
  </button>
</template>
```

```svelte [Svelte (Button.svelte)]
<script lang="ts">
  import styles from './Button.ecss'

  interface Props {
    variant?: 'primary' | 'danger' | 'ghost'
    disabled?: boolean
    children: import('svelte').Snippet
  }

  let { variant = 'primary', disabled, children }: Props = $props()
</script>

<button {...styles.Button({ variant, disabled })}>
  {@render children()}
</button>
```

```tsx [SolidJS (Button.tsx)]
import styles from './Button.ecss';
import type { ParentComponent } from 'solid-js';

type Props = {
  variant?: 'primary' | 'danger' | 'ghost';
  disabled?: boolean;
};

export const Button: ParentComponent<Props> = (props) => {
  return (
    <button
      {...styles.Button({ variant: props.variant, disabled: props.disabled })}
    >
      {props.children}
    </button>
  );
};
```

:::

## How it works

When you import `Button.ecss` the plugin:

1. Parses the file into an AST via `@ecss/parser`
2. Generates CSS classes and data-attributes for each state
3. Returns a JS object with style factories: `{ Button: (params) => { className, 'data-e-a3f2c1-variant': ..., ... } }`

Calling `styles.Button({ variant: 'primary' })` returns an attribute object you spread onto an element:

```js
// What styles.Button({ variant: 'primary', disabled: false }) returns
{
  className: 'Button-a3f2c1',
  'data-e-a3f2c1-variant': 'primary',
  // disabled is not included — false is the default value
}
```

## What's next?

- [Core Concepts](/en/guide/concepts) — details on `@state-variant`, `@state-def` and `@if`
- [Framework Integrations](/en/guide/frameworks/react) — detailed guides for each framework
- [Configuration](/en/guide/configuration) — plugin options and `ecss.config.json`
