# Быстрый старт

## Установка

Добавьте пакеты в ваш проект на Vite:

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

## Настройка Vite

Подключите плагин в `vite.config.ts`. Плагин ECSS должен быть **до** плагина вашего фреймворка:

::: code-group

```ts [React]
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import ecss from '@ecss/vite-plugin';

export default defineConfig({
  plugins: [
    ecss(), // ← сначала ECSS
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

## Настройка TypeScript

Добавьте TypeScript-плагин в `tsconfig.json`, чтобы получить точные типы для импортов `*.ecss`:

```json
// tsconfig.json (или tsconfig.app.json)
{
  "compilerOptions": {
    "plugins": [{ "name": "@ecss/typescript-plugin" }]
  }
}
```

::: tip
TypeScript-плагин работает только в IDE (через Language Service). Для полной проверки типов при сборке (`tsc`) используйте опцию `generateDeclarations` — подробнее в разделе [Конфигурация](/ru/guide/configuration).
:::

## Первый .ecss файл

Создайте файл `Button.ecss` рядом с компонентом:

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
  } @elseif (--variant == danger) {
    background: #e53e3e;
    color: #fff;
  } @else {
    background: transparent;
    border: 1px solid currentColor;
  }
}
```

## Использование в компоненте

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

## Как это работает

При импорте `Button.ecss` плагин:

1. Парсит файл в AST через `@ecss/parser`
2. Генерирует CSS-классы и data-атрибуты для каждого состояния
3. Возвращает JS-объект со стиль-фабриками: `{ Button: (params) => { className, 'data-e-a3f2c1-variant': ..., ... } }`

Вызов `styles.Button({ variant: 'primary' })` возвращает объект атрибутов, который вы spread'ите на элемент:

```js
// Что возвращает styles.Button({ variant: 'primary', disabled: false })
{
  className: 'Button-a3f2c1',
  'data-e-a3f2c1-variant': 'primary',
  // disabled не включается, так как false — значение по умолчанию
}
```

## Что дальше?

- [Основные концепции](/ru/guide/concepts) — подробно о `@state-variant`, `@state-def` и `@if`
- [Интеграции с фреймворками](/ru/guide/frameworks/react) — детальные руководства для каждого фреймворка
- [Конфигурация](/ru/guide/configuration) — настройка плагина и `ecss.config.json`
