# React

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
import react from '@vitejs/plugin-react';
import ecss from '@ecss/vite-plugin';

export default defineConfig({
  plugins: [
    ecss(), // ← must come before react()
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

By default the plugin uses `classAttribute: 'className'` — the right choice for React. The style factory returns an object with a `className` key:

```js
styles.Button({ variant: 'primary' });
// → { className: 'Button-a3f2c1', 'data-e-a3f2c1-variant': 'primary' }
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
      <Button variant="primary">Save</Button>
      <Button variant="danger" size="sm">
        Delete
      </Button>
      <Button variant="ghost" disabled>
        Unavailable
      </Button>
    </div>
  );
}
```

## Combining classes

To add a custom `className` to a component, use `styles.merge` — it combines classes and preserves all state data-attributes:

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
`styles.merge` automatically joins `className` values with a space.
:::
