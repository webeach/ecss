# Runtime API

## Объект `styles`

При импорте `.ecss`-файла вы получаете объект следующей формы:

```ts
import styles from './Button.ecss';

// styles — объект со стиль-фабриками и методом merge:
// {
//   Button: (...args) => Record<string, string | undefined>,
//   AnotherDef: (...args) => Record<string, string | undefined>,
//   merge: (...objects) => Record<string, string | undefined>,
// }
```

Полный тип из `@ecss/vite-plugin/client`:

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

Добавьте ambient-типы в проект:

```ts
// vite-env.d.ts или env.d.ts
/// <reference types="@ecss/vite-plugin/client" />
```

---

## Стиль-фабрики

Каждый `@state-def` из `.ecss`-файла становится методом объекта `styles`. Вызов метода принимает объект с параметрами и возвращает объект атрибутов для spread:

```ts
// Button.ecss объявляет @state-def Button(--variant Variant: primary, --disabled boolean)
const attrs = styles.Button({ variant: 'danger', disabled: true });
// → { className: 'Button-a3f2c1', 'data-e-a3f2c1-variant': 'danger', 'data-e-a3f2c1-disabled': '' }
```

### Поведение параметров

#### Boolean-параметры

- Если `true` → data-атрибут получает значение `''` (пустая строка)
- Если `false` или не передан → атрибут `undefined` (не попадает в DOM)

```ts
styles.Button({ disabled: true });
// → { className: '...', 'data-e-a3f2c1-disabled': '' }

styles.Button({ disabled: false });
// → { className: '...' }  // data-e-a3f2c1-disabled отсутствует
```

#### Variant-параметры

- Если передан → data-атрибут получает строковое значение
- Если не передан и есть дефолт → используется дефолт
- Если не передан и нет дефолта → атрибут `undefined`

```ts
// @state-def Button(--variant Variant: primary)
styles.Button({});
// → { className: '...', 'data-e-a3f2c1-variant': 'primary' }  // дефолт из @state-def

styles.Button({ variant: 'danger' });
// → { className: '...', 'data-e-a3f2c1-variant': 'danger' }
```

### Позиционные аргументы

Стиль-фабрику можно вызвать с одним позиционным аргументом (для `@state-def` с одним boolean-параметром):

```ts
// @state-def Counter(--is-active boolean)
styles.Counter(true); // эквивалентно styles.Counter({ isActive: true })
styles.Counter(false); // эквивалентно styles.Counter({ isActive: false })
```

---

## `styles.merge`

`merge` — метод объекта `styles`, который объединяет несколько объектов атрибутов в один.

### Сигнатура

```ts
styles.merge(...objects: Record<string, string | undefined>[]): Record<string, string | undefined>
```

### Поведение

- Для ключей `class` и `className`: значения **склеиваются через пробел**
- Для всех остальных ключей: побеждает последнее непустое значение (`!== undefined`)

### Примеры

#### Добавление собственного класса

```ts
import styles from './Button.ecss';

const attrs = styles.merge(styles.Button({ variant: 'primary' }), {
  className: 'my-custom-button',
});
// → { className: 'Button-a3f2c1 my-custom-button', 'data-e-a3f2c1-variant': 'primary' }
```

#### В компонентах

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

## Внутренний API (`_h`)

`_h` — внутренняя функция, которую трансформер вставляет в сгенерированный JS для создания стиль-фабрик. **Использовать напрямую не нужно**, но понимание её работы помогает разобраться в механике ECSS.

### Сгенерированный код

Для такого `.ecss`:

```ecss
@state-variant Variant { values: primary, danger; }

@state-def Button(--variant Variant: primary, --disabled boolean) {
  /* ... */
}
```

Трансформер генерирует примерно:

```js
import { _h } from 'virtual:ecss/runtime'

const _Button = _h(
  'Button-a3f2c1',
  [
    ['variant', 'data-e-a3f2c1-variant', 'v', 'primary'],
    ['disabled', 'data-e-a3f2c1-disabled', 'b', undefined],
  ],
  ['className']  // или ['class'] при classAttribute: 'class'
)

export default {
  Button: _Button,
  merge: /* встроенный merge */,
}
```

### Виртуальный модуль `virtual:ecss/runtime`

Плагин `@ecss/vite-plugin` предоставляет виртуальный модуль `virtual:ecss/runtime`, который реэкспортирует `_h` из `@ecss/transformer/runtime`. Этот модуль используется **автоматически** в сгенерированном коде.
