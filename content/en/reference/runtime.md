# Runtime API

## The `styles` object

When you import a `.ecss` file you get an object of the following shape:

```ts
import styles from './Button.ecss';

// styles — object with style factories and a merge method:
// {
//   Button: (...args) => Record<string, string | undefined>,
//   AnotherDef: (...args) => Record<string, string | undefined>,
//   merge: (...objects) => Record<string, string | undefined>,
// }
```

Full type from `@ecss/vite-plugin/client`:

```ts
declare module '*.ecss' {
  const styles: Record<
    string,
    (...args: any[]) => Record<string, string | undefined>
  > & {
    merge: (
      ...objects: Record<string, string | undefined>[]
    ) => Record<string, string | undefined>;
  };
  export default styles;
}
```

Add the ambient types to your project:

```ts
// vite-env.d.ts or env.d.ts
/// <reference types="@ecss/vite-plugin/client" />
```

---

## Style factories

Each `@state-def` from a `.ecss` file becomes a method on the `styles` object. Calling the method accepts a parameter object and returns an attribute object for spreading:

```ts
// Button.ecss declares @state-def Button(--variant Variant: primary, --disabled boolean)
const attrs = styles.Button({ variant: 'danger', disabled: true });
// → { className: 'Button-a3f2c1', 'data-e-a3f2c1-variant': 'danger', 'data-e-a3f2c1-disabled': '' }
```

### Parameter behavior

#### Boolean parameters

- If `true` → the data-attribute receives value `''` (empty string)
- If `false` or not passed → the attribute is `undefined` (not rendered in the DOM)

```ts
styles.Button({ disabled: true });
// → { className: '...', 'data-e-a3f2c1-disabled': '' }

styles.Button({ disabled: false });
// → { className: '...' }  // data-e-a3f2c1-disabled absent
```

#### Variant parameters

- If passed → the data-attribute receives the string value
- If not passed and a default exists → the default is used
- If not passed and no default → attribute is `undefined`

```ts
// @state-def Button(--variant Variant: primary)
styles.Button({});
// → { className: '...', 'data-e-a3f2c1-variant': 'primary' }  // default from @state-def

styles.Button({ variant: 'danger' });
// → { className: '...', 'data-e-a3f2c1-variant': 'danger' }
```

### Positional arguments

The style factory can be called with a single positional argument (for `@state-def` with one boolean parameter):

```ts
// @state-def Counter(--is-active boolean)
styles.Counter(true); // equivalent to styles.Counter({ isActive: true })
styles.Counter(false); // equivalent to styles.Counter({ isActive: false })
```

---

## `styles.merge`

`merge` is a method on the `styles` object that combines multiple attribute objects into one.

### Signature

```ts
styles.merge(...objects: Record<string, string | undefined>[]): Record<string, string | undefined>
```

### Behavior

- For `class` and `className` keys: values are **joined with a space**
- For all other keys: the last non-empty value (`!== undefined`) wins

### Examples

#### Adding a custom class

```ts
import styles from './Button.ecss';

const attrs = styles.merge(styles.Button({ variant: 'primary' }), {
  className: 'my-custom-button',
});
// → { className: 'Button-a3f2c1 my-custom-button', 'data-e-a3f2c1-variant': 'primary' }
```

#### In components

::: code-group

```tsx [React]
import styles from './Button.ecss';

function Button({ variant, className, children }) {
  return (
    <button {...styles.merge(styles.Button({ variant }), { className })}>
      {children}
    </button>
  );
}
```

```vue [Vue]
<script setup>
import styles from './Button.ecss';
import { computed } from 'vue';

const props = defineProps(['variant', 'class']);
const attrs = computed(() =>
  styles.merge(styles.Button({ variant: props.variant }), {
    class: props.class,
  }),
);
</script>

<template>
  <button v-bind="attrs"><slot /></button>
</template>
```

```svelte [Svelte]
<script lang="ts">
  import styles from './Button.ecss'

  let { variant, class: className, children } = $props()
  const attrs = $derived(styles.merge(styles.Button({ variant }), { class: className }))
</script>

<button {...attrs}>{@render children()}</button>
```

```tsx [SolidJS]
import styles from './Button.ecss';

function Button(props) {
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

:::

---

## Internal API (`_h`)

`_h` is an internal function inserted by the transformer into generated JS to create style factories. **You don't need to use it directly**, but understanding how it works helps clarify the ECSS mechanics.

### Generated code

For this `.ecss`:

```ecss
@state-variant Variant { values: primary, danger; }

@state-def Button(--variant Variant: primary, --disabled boolean) {
  /* ... */
}
```

The transformer generates roughly:

```js
import { _h } from 'virtual:ecss/runtime'

const _Button = _h(
  'Button-a3f2c1',
  [
    ['variant', 'data-e-a3f2c1-variant', 'v', 'primary'],
    ['disabled', 'data-e-a3f2c1-disabled', 'b', undefined],
  ],
  ['className']  // or ['class'] when classAttribute: 'class'
)

export default {
  Button: _Button,
  merge: /* built-in merge */,
}
```

### Virtual module `virtual:ecss/runtime`

The `@ecss/vite-plugin` plugin provides a virtual module `virtual:ecss/runtime` that re-exports `_h` from `@ecss/transformer/runtime`. This module is used **automatically** in the generated code.
