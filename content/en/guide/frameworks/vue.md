# Vue

## Installation

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

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import ecss from '@ecss/vite-plugin';

export default defineConfig({
  plugins: [
    ecss(), // ← must come before vue()
    vue(),
  ],
});
```

## TypeScript

```json
// tsconfig.app.json
{
  "compilerOptions": {
    "plugins": [{ "name": "@ecss/typescript-plugin" }]
  }
}
```

## `classAttribute`

Vue uses the `class` attribute (not `className` like React). Add an `ecss.config.json` file to the root of your project:

```json
// ecss.config.json
{
  "classAttribute": "class"
}
```

Now the style factory returns `class` instead of `className`:

```js
styles.Button({ variant: 'primary' });
// → { class: 'Button-a3f2c1', 'data-e-a3f2c1-variant': 'primary' }
```

## Binding attributes with `v-bind`

In Vue it's convenient to use `v-bind` with an object — it applies all keys as attributes:

```vue
<button v-bind="styles.Button({ variant, size })">
  <slot />
</button>
```

## Example: Button component

**Button.ecss**

```ecss
@state-variant Variant {
  values: primary, danger, ghost;
}

@state-variant Size {
  values: sm, md, lg;
}

@state-def Button(--variant Variant: primary, --size Size: md, --disabled boolean) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.85;
  }

  @if (--disabled) {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
  }

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
    color: inherit;
  }
}
```

**Button.vue**

```vue
<script setup lang="ts">
import styles from './Button.ecss';

interface Props {
  variant?: 'primary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const { variant = 'primary', size = 'md', disabled } = defineProps<Props>();
</script>

<template>
  <button v-bind="styles.Button({ variant, size, disabled })">
    <slot />
  </button>
</template>
```

**App.vue**

```vue
<script setup lang="ts">
import Button from './components/Button.vue';
</script>

<template>
  <div>
    <Button variant="primary">Save</Button>
    <Button variant="danger" size="sm">Delete</Button>
    <Button variant="ghost" :disabled="true">Unavailable</Button>
  </div>
</template>
```

## Combining classes

Vue automatically merges `class` from `v-bind` with other class bindings on the same element:

```vue
<template>
  <!-- Vue merges class from ECSS and class="my-button" automatically -->
  <button v-bind="styles.Button({ variant })" class="my-button">
    <slot />
  </button>
</template>
```

::: tip
This is a Vue feature — you don't need to manually merge classes. `class` directives and `v-bind` objects containing `class` are automatically merged.
:::
