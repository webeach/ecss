# Основные концепции

ECSS вводит три новые конструкции поверх стандартного CSS. Эта страница описывает каждую из них подробно.

## `@state-variant` — перечисления

`@state-variant` объявляет именованный набор допустимых строковых значений — аналог enum в TypeScript.

### Синтаксис

```ecss
@state-variant ИмяВарианта {
  values: значение1, значение2, значение3;
}
```

Имя варианта **обязательно** начинается с заглавной буквы (PascalCase). Значения — идентификаторы или строки в кавычках.

### Примеры

```ecss
@state-variant Size {
  values: sm, md, lg;
}

@state-variant Theme {
  values: light, dark, "high contrast";
}

@state-variant Status {
  values: idle, loading, error, success;
}
```

### Зачем нужны варианты?

Варианты выполняют две функции:

1. **Типизация параметров** — параметр типа `Variant` в `@state-def` может принимать только объявленные значения. Попытка передать неизвестное значение — ошибка.
2. **Самодокументация** — все допустимые состояния перечислены в одном месте.

::: tip Правила именования

- Имена вариантов: PascalCase, объявляются на верхнем уровне файла
- Значения: строчные идентификаторы или строки в кавычках (для значений с пробелами)
- Все имена `@state-variant` в одном файле должны быть уникальными
  :::

---

## `@state-def` — определения состояний

`@state-def` — основная конструкция ECSS. Она объявляет компонент стилей с параметрами и тело CSS-правил, которые зависят от этих параметров.

### Синтаксис

```ecss
@state-def ИмяКомпонента(параметры) {
  /* обычный CSS + @if-цепочки */
}
```

### Параметры

Параметр — это custom property (`--имя`) с необязательным типом и значением по умолчанию.

#### Таблица синтаксиса

| Синтаксис               | Тип               | Значение по умолчанию |
| ----------------------- | ----------------- | --------------------- |
| `--p`                   | `boolean`         | `false`               |
| `--p boolean`           | `boolean`         | `false`               |
| `--p boolean: true`     | `boolean`         | `true`                |
| `--p boolean: false`    | `boolean`         | `false`               |
| `--p Variant`           | ссылка на вариант | нет (обязателен)      |
| `--p Variant: значение` | ссылка на вариант | указанное значение    |

#### Boolean-параметры

```ecss
@state-def Card(--elevated, --outlined boolean: false) {
  border-radius: 12px;
  padding: 24px;

  @if (--elevated) {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @if (--outlined) {
    border: 1px solid #e0e0e0;
  }
}
```

При вызове `styles.Card({ elevated: true })` — тень включена, рамки нет.

#### Variant-параметры

```ecss
@state-variant Size {
  values: sm, md, lg;
}

@state-def Button(--size Size: md) {
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
}
```

#### Компонент без параметров

Параметры можно опустить полностью — это просто изолированный блок стилей:

```ecss
@state-def Container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}
```

При вызове `styles.Container()` возвращается объект только с базовым классом.

### Тело компонента

Внутри `@state-def` разрешено всё, что разрешено в обычном CSS:

```ecss
@state-def Panel(--expanded boolean) {
  padding: 16px;
  transition: all 0.2s;

  /* CSS-вложенность работает */
  & > .title {
    font-weight: bold;
  }

  &:hover {
    background: #f5f5f5;
  }

  /* @if можно вкладывать */
  @if (--expanded) {
    max-height: 1000px;

    & > .content {
      opacity: 1;
    }
  }
}
```

### Правила именования

- Имена `@state-def` — PascalCase
- Имена `@state-def` и `@state-variant` в одном файле не могут совпадать
- Все `@state-def` в одном файле должны иметь уникальные имена

---

## `@if` / `@elseif` / `@else` — условные стили

`@if`-цепочки позволяют применять CSS-правила в зависимости от значений параметров `@state-def`.

### Синтаксис

```ecss
@if (условие) {
  /* CSS-правила */
} @elseif (другое условие) {
  /* CSS-правила */
} @else {
  /* CSS-правила */
}
```

::: warning Важно
`@elseif` и `@else` должны следовать **сразу** за закрывающей `}` предыдущего блока. Между ними допускаются только пробелы и CSS-комментарии.
:::

### Операторы сравнения

#### Сравнение значений

```ecss
@if (--variant == primary) {
  /* ... */
}
@if (--variant != ghost) {
  /* ... */
}
```

- Для boolean-параметров: сравнение с `true` или `false`
- Для variant-параметров: сравнение со значением из `@state-variant`

#### Сокращённая форма для boolean

```ecss
/* Эти две записи эквивалентны: */
@if (--disabled) {
  /* ... */
}
@if (--disabled == true) {
  /* ... */
}
```

### Логические операторы

#### `&&` — оба условия истинны

```ecss
@if (--expanded && --theme == dark) {
  background: #121212;
  color: #fff;
}
```

#### `||` — хотя бы одно условие истинно

```ecss
@if (--expanded || --pinned) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

### Приоритет операторов

| Приоритет  | Оператор  | Описание       |
| ---------- | --------- | -------------- |
| 1 (высший) | `( )`     | Группировка    |
| 2          | `==` `!=` | Сравнение      |
| 3          | `&&`      | Логическое И   |
| 4 (низший) | `\|\|`    | Логическое ИЛИ |

```ecss
/* (--a == x || --b) && --c */
@if ((--a == x || --b) && --c) {
  /* ... */
}
```

### Вложенные условия

`@if`-цепочки можно вкладывать на любую глубину:

```ecss
@state-variant Theme {
  values: light, dark;
}

@state-def Panel(--expanded boolean, --theme Theme: light, --pinned boolean) {
  @if (--expanded) {
    max-height: 1000px;

    @if (--theme == dark) {
      background: #121212;

      @if (--pinned) {
        border: 2px solid #0077ff;
      }
    }
  }
}
```

### Полный пример с несколькими ветками

```ecss
@state-variant Status {
  values: idle, loading, error, success;
}

@state-def Badge(--status Status: idle) {
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  padding: 2px 10px;
  font-size: 12px;
  font-weight: 500;

  @if (--status == idle) {
    background: #f0f0f0;
    color: #555;
  }
  @elseif (--status == loading) {
    background: #e0f0ff;
    color: #0055cc;
  }
  @elseif (--status == error) {
    background: #ffe0e0;
    color: #cc0000;
  }
  @else {
    background: #e0ffe0;
    color: #006600;
  }
}
```

---

## CSS-совместимость

ECSS не запрещает и не изменяет никакие CSS-конструкции. Вы можете смешивать обычные CSS-правила и ECSS-конструкции в одном файле:

```ecss
/* Обычный CSS — полностью валиден */
*, *::before, *::after {
  box-sizing: border-box;
}

@media (prefers-color-scheme: dark) {
  body { background: #0a0a0a; }
}

/* ECSS-конструкции */
@state-variant Theme { values: light, dark; }

@state-def Button(--theme Theme: light) {
  /* ... */
}
```

::: info
`@state-variant` и `@state-def` объявляются **только на верхнем уровне** файла (не внутри других правил). `@if` — **только внутри** тела `@state-def`.
:::
