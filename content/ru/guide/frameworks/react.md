# React

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
import react from '@vitejs/plugin-react';
import ecss from '@ecss/vite-plugin';

export default defineConfig({
  plugins: [
    ecss(), // ← обязательно до react()
    react(),
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

По умолчанию плагин использует `classAttribute: 'className'` — правильный выбор для React. Стиль-фабрика возвращает объект с ключом `className`:

```js
styles.Button({ variant: 'primary' });
// → { className: 'Button-a3f2c1', 'data-e-a3f2c1-variant': 'primary' }
```

Это можно переопределить через `ecss.config.json` или опции плагина, но для React оставляйте значение по умолчанию.

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

type Variant = 'primary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  disabled,
  onClick,
  children,
}: ButtonProps) {
  return (
    <button {...styles.Button({ variant, size, disabled })} onClick={onClick}>
      {children}
    </button>
  );
}
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

## Комбинирование классов

Если нужно добавить собственный `className` к ECSS-классу, используйте `styles.merge` — он объединяет классы и сохраняет все data-атрибуты состояний:

```tsx
import styles from './Button.ecss';

function Button({ variant, className, children }) {
  return (
    <button {...styles.merge(styles.Button({ variant }), { className })}>
      {children}
    </button>
  );
}
```

::: tip
`styles.merge` автоматически склеивает значения `className` через пробел.
:::
