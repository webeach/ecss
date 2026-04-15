# Svelte

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
import { svelte } from '@sveltejs/vite-plugin-svelte';
import ecss from '@ecss/vite-plugin';

export default defineConfig({
  plugins: [
    ecss(), // ← обязательно до svelte()
    svelte(),
  ],
});
```

## TypeScript

```json
// tsconfig.json
{
  "compilerOptions": {
    "plugins": [{ "name": "@ecss/typescript-plugin" }]
  }
}
```

## `ecss.config.json`

Svelte использует `class`, а не `className`. Также рекомендуется включить `generateDeclarations`, поскольку TypeScript Language Service Plugin в Svelte-проектах работает через `.ecss.d.ts`-файлы:

```json
// ecss.config.json
{
  "classAttribute": "class",
  "generateDeclarations": true
}
```

С `generateDeclarations: true` плагин создаёт рядом с каждым `.ecss`-файлом файл `.ecss.d.ts` с точными типами. Это нужно для корректной работы IDE в Svelte.

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

**Button.svelte**

```svelte
<script lang="ts">
  import styles from './Button.ecss'

  interface Props {
    variant?: 'primary' | 'danger' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    onclick?: () => void
    children: import('svelte').Snippet
  }

  let { variant = 'primary', size = 'md', disabled, onclick, children }: Props = $props()
</script>

<button {...styles.Button({ variant, size, disabled })} {onclick}>
  {@render children()}
</button>
```

**App.svelte**

```svelte
<script lang="ts">
  import Button from './lib/Button.svelte'
</script>

<Button variant="primary">Сохранить</Button>
<Button variant="danger" size="sm">Удалить</Button>
<Button variant="ghost" disabled>Недоступно</Button>
```

## Комбинирование классов

Когда нужно добавить собственный класс к ECSS-классу, используйте `styles.merge` — он объединяет классы и сохраняет все data-атрибуты состояний:

```svelte
<script lang="ts">
  import styles from './Button.ecss'

  interface Props {
    variant?: 'primary' | 'danger' | 'ghost'
    class?: string
    children: import('svelte').Snippet
  }

  let { variant, class: className, children }: Props = $props()

  const attrs = $derived(styles.merge(styles.Button({ variant }), { class: className }))
</script>

<button {...attrs}>
  {@render children()}
</button>
```
