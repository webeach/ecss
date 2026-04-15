# Введение

## Что такое ECSS?

**ECSS (Extended CSS)** — язык стилей, расширяющий CSS тремя новыми конструкциями для декларативного управления состоянием компонентов:

| Конструкция                 | Назначение                                                  |
| --------------------------- | ----------------------------------------------------------- |
| `@state-variant`            | Объявляет именованное перечисление строковых значений       |
| `@state-def`                | Объявляет параметризованный набор CSS-правил для компонента |
| `@if` / `@elseif` / `@else` | Выбирает CSS-правила на основе значений параметров          |

ECSS является **строгим надмножеством CSS**: любой валидный CSS является валидным ECSS. Браузер не получает ECSS напрямую — файлы `.ecss` трансформируются в стандартный CSS на этапе сборки.

## Какую проблему решает ECSS?

### Стандартный подход: CSS Modules + JavaScript

Типичный React-компонент с вариантами выглядит так:

```tsx
import styles from './Button.module.css';

function Button({ variant, size, disabled }) {
  const className = [
    styles.button,
    variant === 'primary' && styles.primary,
    variant === 'danger' && styles.danger,
    size === 'sm' && styles.small,
    size === 'lg' && styles.large,
    disabled && styles.disabled,
  ]
    .filter(Boolean)
    .join(' ');

  return <button className={className}>...</button>;
}
```

Проблемы:

- Условная логика **размазана** между CSS-файлом и компонентом
- Добавление нового варианта требует правок в обоих файлах
- Нет единого источника истины о том, какие состояния у компонента вообще существуют

### Подход ECSS

```ecss
@state-variant Variant {
  values: primary, danger, ghost;
}

@state-def Button(--variant Variant, --size Size: md, --disabled boolean) {
  display: inline-flex;
  cursor: pointer;

  @if (--disabled) {
    opacity: 0.4;
    cursor: not-allowed;
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
  }
}
```

```tsx
import styles from './Button.ecss';

function Button({ variant, size, disabled }) {
  return <button {...styles.Button({ variant, size, disabled })}>...</button>;
}
```

Вся логика состояний живёт в `.ecss`-файле. Компонент просто передаёт пропсы — он не знает ни о каких классах.

## Ключевые принципы

### Надмножество CSS

ECSS не переопределяет и не ограничивает CSS. CSS-вложенность (Nesting), медиазапросы, псевдоклассы — всё работает внутри `@state-def` и `@if`-блоков как обычно.

### Трансформация на этапе сборки

ECSS-файлы обрабатываются через Vite с помощью плагина `@ecss/vite-plugin`. На выходе:

- **CSS** — обычные классы с data-атрибутами для состояний
- **JS** — функции-фабрики, которые при вызове возвращают объект с атрибутами для spread

### Типобезопасность

TypeScript-плагин `@ecss/typescript-plugin` анализирует AST каждого `.ecss`-файла и генерирует точные типы. Передать несуществующее значение варианта или пропустить обязательный параметр — ошибка компиляции.

## Компоненты экосистемы

```
┌─────────────────────────────────────────────┐
│                 *.ecss файл                 │
└──────────────────────┬──────────────────────┘
                       │
              @ecss/parser (Rust/WASM)
                       │ AST
              @ecss/transformer
                       │
          ┌────────────┼────────────┐
         CSS           JS          d.ts
          │            │            │
       бандлер     компонент    TypeScript
```

| Пакет                                                                          | Роль                                           |
| ------------------------------------------------------------------------------ | ---------------------------------------------- |
| [`@ecss/parser`](https://github.com/webeach/ecss-parser)                       | Парсер на Rust (napi-rs), возвращает AST       |
| [`@ecss/transformer`](https://github.com/webeach/ecss-transformer)             | Трансформер AST → CSS + JS + d.ts              |
| [`@ecss/vite-plugin`](https://github.com/webeach/ecss-vite-plugin)             | Vite-плагин для `.ecss`-файлов                 |
| [`@ecss/typescript-plugin`](https://github.com/webeach/ecss-typescript-plugin) | Language Service Plugin для точных типов в IDE |
| [`@ecss/vscode-extension`](https://github.com/webeach/ecss-vscode-extension)   | VS Code: подсветка, диагностики, hover         |

## Что дальше?

- [Быстрый старт](/ru/guide/getting-started) — установка и первый рабочий пример
- [Основные концепции](/ru/guide/concepts) — подробно о `@state-variant`, `@state-def` и `@if`
- [Интеграции](/ru/guide/frameworks/react) — использование с React, Vue, Svelte, SolidJS
