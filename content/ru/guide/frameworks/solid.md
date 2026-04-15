# SolidJS

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
import solid from 'vite-plugin-solid';
import ecss from '@ecss/vite-plugin';

export default defineConfig({
  plugins: [
    ecss(), // ← обязательно до solid()
    solid(),
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

## `classAttribute`

SolidJS в JSX использует атрибут `class` (не `className` как React). Добавьте в корень проекта файл `ecss.config.json`:

```json
// ecss.config.json
{
  "classAttribute": "class"
}
```

Стиль-фабрика будет возвращать `class` вместо `className`:

```js
styles.Button({ variant: 'primary' });
// → { class: 'Button-a3f2c1', 'data-e-a3f2c1-variant': 'primary' }
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

**Button.tsx**

```tsx
import styles from './Button.ecss';
import type { ParentComponent } from 'solid-js';

type Variant = 'primary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  onClick?: () => void;
}

export const Button: ParentComponent<ButtonProps> = (props) => {
  return (
    <button
      {...styles.Button({
        variant: props.variant,
        size: props.size,
        disabled: props.disabled,
      })}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};
```

**App.tsx**

```tsx
import { Button } from './Button';

export function App() {
  return (
    <div>
      <Button variant="primary">Сохранить</Button>
      <Button variant="danger" size="sm">
        Удалить
      </Button>
      <Button variant="ghost" disabled>
        Недоступно
      </Button>
    </div>
  );
}
```

## Реактивность в SolidJS

SolidJS использует сигналы для реактивности. При использовании ECSS стиль-фабрика вызывается в JSX напрямую, что делает её автоматически реактивной:

```tsx
import { createSignal } from 'solid-js';
import styles from './Button.ecss';

export function ToggleButton() {
  const [active, setActive] = createSignal(false);

  return (
    <button
      {...styles.Button({ variant: active() ? 'primary' : 'ghost' })}
      onClick={() => setActive((v) => !v)}
    >
      {active() ? 'Активно' : 'Неактивно'}
    </button>
  );
}
```

::: tip
Поскольку функция вызывается прямо в JSX, SolidJS отслеживает доступ к сигналам внутри неё и автоматически обновляет атрибуты при их изменении.
:::

## Комбинирование классов

Используйте `styles.merge` — он объединяет классы и сохраняет все data-атрибуты состояний:

```tsx
import styles from './Button.ecss';

export function Button(props) {
  return (
    <button
      {...styles.merge(styles.Button({ variant: props.variant }), {
        class: props.class,
      })}
    >
      {props.children}
    </button>
  );
}
```
