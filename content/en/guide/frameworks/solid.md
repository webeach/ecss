# SolidJS

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
import solid from 'vite-plugin-solid';
import ecss from '@ecss/vite-plugin';

export default defineConfig({
  plugins: [
    ecss(), // ← must come before solid()
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

SolidJS uses `class` in JSX (not `className` like React). Add an `ecss.config.json` to the project root:

```json
// ecss.config.json
{
  "classAttribute": "class"
}
```

The style factory will return `class` instead of `className`:

```js
styles.Button({ variant: 'primary' });
// → { class: 'Button-a3f2c1', 'data-e-a3f2c1-variant': 'primary' }
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

## Reactivity in SolidJS

SolidJS uses signals for reactivity. When using ECSS, the style factory is called directly in JSX, making it automatically reactive:

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
      {active() ? 'Active' : 'Inactive'}
    </button>
  );
}
```

::: tip
Because the function is called directly in JSX, SolidJS tracks signal access inside it and automatically updates attributes when they change.
:::

## Combining classes

Use `styles.merge` — it combines classes and preserves all state data-attributes:

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
