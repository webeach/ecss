# Vue

## Установка

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

## Конфигурация Vite

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import ecss from '@ecss/vite-plugin';

export default defineConfig({
  plugins: [
    ecss(), // ← обязательно до vue()
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

Vue использует атрибут `class` (не `className` как React). Добавьте в корень проекта файл `ecss.config.json`:

```json
// ecss.config.json
{
  "classAttribute": "class"
}
```

Теперь стиль-фабрика возвращает `class` вместо `className`:

```js
styles.Button({ variant: 'primary' });
// → { class: 'Button-a3f2c1', 'data-e-a3f2c1-variant': 'primary' }
```

## Привязка атрибутов с `v-bind`

В Vue удобно использовать `v-bind` с объектом — он применяет все ключи как атрибуты:

```vue
<button v-bind="styles.Button({ variant, size })">
  <slot />
</button>
```

## Пример: компонент Button

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
    <Button variant="primary">Сохранить</Button>
    <Button variant="danger" size="sm">Удалить</Button>
    <Button variant="ghost" :disabled="true">Недоступно</Button>
  </div>
</template>
```

## Комбинирование классов

Vue автоматически объединяет `class` из `v-bind` с другими привязками класса на том же элементе:

```vue
<template>
  <!-- Vue сам объединит class из ECSS и class="my-button" -->
  <button v-bind="styles.Button({ variant })" class="my-button">
    <slot />
  </button>
</template>
```

::: tip
Это особенность Vue — вам не нужно вручную объединять классы. Директивы `class` и `v-bind` с объектом, содержащим `class`, автоматически мерджатся.
:::
