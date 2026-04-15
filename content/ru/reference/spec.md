# Спецификация языка ECSS

**Версия:** 0.1.0-draft  
**Статус:** Draft  
**Дата:** 2026-04-12

---

## 1. Введение

ECSS (Extended CSS) — строгое надмножество CSS, вводящее три новые конструкции для декларативного управления состоянием компонентов:

| Конструкция                 | Назначение                                            |
| --------------------------- | ----------------------------------------------------- |
| `@state-variant`            | Объявляет именованное перечисление строковых значений |
| `@state-def`                | Объявляет параметризованный набор CSS-правил          |
| `@if` / `@elseif` / `@else` | Выбирает CSS-правила на основе значений параметров    |

Любой валидный CSS является валидным ECSS. ECSS-источник предназначен для трансформации в стандартный CSS; парсер, определённый здесь, производит только Abstract Syntax Tree (AST).

---

## 2. Соответствие

Ключевые слова **MUST**, **MUST NOT**, **REQUIRED**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **RECOMMENDED**, **MAY** и **OPTIONAL** трактуются согласно [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119).

Соответствующий ECSS-парсер:

- MUST принимать любой ввод, валидный по грамматике §4
- MUST отклонять любой ввод, нарушающий ограничения **MUST** / **MUST NOT** из §5
- MUST производить AST, точно представляющий все конструкции исходника
- MAY выдавать диагностику для нарушений ограничений **SHOULD**

---

## 3. Лексическая структура

ECSS наследует полную лексическую грамматику CSS (токенизация, пробелы, комментарии, строковые литералы, идентификаторы).

### 3.1 Идентификаторы

- **Обычный идентификатор** (`ident`) — соответствует CSS-продукции `<ident-token>`
- **PascalCase-имя** — `ident`, первый символ которого является заглавной ASCII-буквой (`A–Z`). Используется для имён `@state-variant` и `@state-def`
- **Имя custom property** — токен вида `--<ident>`, соответствующий CSS-продукции `<custom-property-name>`. Используется для имён параметров

### 3.2 Строковые значения

Строковые литералы ограничиваются одинарными (`'`) или двойными (`"`) кавычками. Последовательности экранирования идентичны CSS.

### 3.3 Зарезервированные слова

Следующие идентификаторы зарезервированы как имена at-правил ECSS и MUST NOT использоваться как PascalCase-имена или имена параметров:

`state-variant`, `state-def`, `if`, `elseif`, `else`

---

## 4. Грамматика

Грамматика представлена в EBNF-подобной нотации:

| Нотация   | Значение                      |
| --------- | ----------------------------- |
| `A B`     | A, затем B                    |
| `A \| B`  | A или B (упорядоченный выбор) |
| `A?`      | Ноль или одно вхождение A     |
| `A*`      | Ноль или более вхождений A    |
| `A+`      | Одно или более вхождений A    |
| `( A )`   | Группировка                   |
| `"x"`     | Терминальная строка           |
| `<token>` | Имя CSS-токена                |

Пробелы и CSS-комментарии допускаются между любыми двумя токенами, если явно не запрещено.

### 4.1 Stylesheet

```txt
stylesheet = stylesheet-item*

stylesheet-item
  = state-variant-rule
  | state-def-rule
  | css-qualified-rule
  | css-at-rule
```

`css-qualified-rule` и `css-at-rule` обозначают любое синтаксически валидное CSS-правило, не являющееся at-правилом ECSS. Они пропускаются в AST без семантической проверки.

### 4.2 `@state-variant`

```txt
state-variant-rule = "@state-variant" pascal-name "{" variant-body "}"

variant-body = "values" ":" value-list ";"

value-list = value ( "," value )* ","?

value = <ident-token> | <string-token>
```

- `pascal-name` — `<ident-token>`, первый символ которого — заглавная ASCII-буква
- Завершающая запятая в `value-list` — **OPTIONAL**

### 4.3 `@state-def`

```txt
state-def-rule = "@state-def" state-def-head "{" rule-body "}"

state-def-head
  = pascal-name
  | pascal-name "(" param-list? ")"

param-list = param ( "," param )* ","?

param = custom-property-name param-type? param-default?

param-type = "boolean" | pascal-name

param-default = ":" param-default-value

param-default-value = <ident-token> | <string-token>
```

- Если `param-type` опущен, параметр неявно типизируется как `boolean` с дефолтом `false`
- Если `param-type` — `boolean`, дефолт MUST быть `true` или `false` (при наличии)
- Если `param-type` — `pascal-name`, тип параметра — ссылка на `@state-variant` с таким именем
- Скобки MAY быть опущены, если список параметров пуст

#### Таблица синтаксиса параметров

| Синтаксис            | Тип               | Значение по умолчанию |
| -------------------- | ----------------- | --------------------- |
| `--p`                | `boolean`         | `false`               |
| `--p boolean`        | `boolean`         | `false`               |
| `--p boolean: true`  | `boolean`         | `true`                |
| `--p boolean: false` | `boolean`         | `false`               |
| `--p Variant`        | ссылка на вариант | нет                   |
| `--p Variant: "val"` | ссылка на вариант | `"val"`               |

### 4.4 Тело правила

```txt
rule-body = rule-body-item*

rule-body-item
  = css-declaration
  | css-qualified-rule
  | if-chain
  | css-at-rule
```

`css-declaration` — стандартная пара свойство–значение CSS, опционально с `!important`.

### 4.5 `@if`-цепочка

```txt
if-chain = if-clause elseif-clause* else-clause?

if-clause     = "@if"     "(" condition ")" "{" rule-body "}"
elseif-clause = "@elseif" "(" condition ")" "{" rule-body "}"
else-clause   = "@else"                    "{" rule-body "}"
```

`@elseif` и `@else` MUST следовать непосредственно за закрывающей `}` предыдущего `@if` или `@elseif`. Между `}` и следующим ключевым словом допускаются только пробелы и CSS-комментарии.

Блок `@else` MUST встречаться не более одного раза и MUST быть последним в цепочке.

`@if`-цепочки MAY быть вложены на любую глубину внутри `rule-body`.

### 4.6 Выражения условий

```txt
condition = or-expr

or-expr  = and-expr ( "||" and-expr )*
and-expr = cmp-expr ( "&&" cmp-expr )*

cmp-expr
  = primary "==" rhs
  | primary "!=" rhs
  | primary

primary
  = "(" condition ")"
  | custom-property-name

rhs = <ident-token> | <string-token>
```

#### Приоритет операторов (от высшего к низшему)

| Уровень | Оператор          | Ассоциативность |
| ------- | ----------------- | --------------- |
| 1       | `( )` группировка | —               |
| 2       | `==` `!=`         | левая           |
| 3       | `&&`              | левая           |
| 4       | `\|\|`            | левая           |

#### Сокращённая форма

Одиночное `custom-property-name` в условии эквивалентно:

```
--param == true
```

---

## 5. Статическая семантика

Статические ограничения проверяются без выполнения таблицы стилей. Соответствующий парсер MAY проверять их во время парсинга или в отдельном проходе; нарушения в любом случае MUST сообщаться как ошибки.

### 5.1 Уникальность имён

**SEM-1.** В пределах одного ECSS-файла все имена `@state-variant` MUST быть уникальными.

**SEM-2.** В пределах одного ECSS-файла все имена `@state-def` MUST быть уникальными.

**SEM-3.** Множество имён `@state-variant` и множество имён `@state-def` MUST быть непересекающимися. Имя MUST NOT использоваться одновременно для `@state-variant` и `@state-def` в одном файле.

### 5.2 Область видимости и разрешение ссылок

**SEM-4.** Объявления `@state-variant` MUST находиться на верхнем уровне stylesheet. Они MUST NOT находиться внутри `@state-def`, CSS-правил или любых других блоков.

**SEM-5.** Объявления `@state-def` MUST находиться на верхнем уровне stylesheet. Они MUST NOT быть вложены внутрь других at-правил или qualified rules.

**SEM-6.** Конструкции `@if` / `@elseif` / `@else` MUST находиться только внутри тела `@state-def`. Они MUST NOT появляться на верхнем уровне stylesheet.

**SEM-7.** Каждый `custom-property-name`, упомянутый в выражении условия, MUST соответствовать параметру, объявленному в непосредственно охватывающем `@state-def`. Ссылки на параметры внешних `@state-def` из вложенных `@if`-цепочек не допускаются.

### 5.3 Совместимость типов

**SEM-8.** Если `param-type` — `pascal-name`, это имя MUST разрешаться в `@state-variant`, объявленный в том же файле.

**SEM-9.** В выражении сравнения `--param == rhs` или `--param != rhs`:

- Если `--param` типизирован `boolean`, то `rhs` MUST быть идентификатором `true` или `false`
- Если `--param` — ссылка на вариант, то `rhs` MUST быть строкой или идентификатором, являющимся объявленным значением ссылаемого `@state-variant`

**SEM-10.** Одиночный `--param` в условии (сокращение для `--param == true`) валиден только когда `--param` типизирован `boolean`.

**SEM-11.** Если `param-default-value` указан для параметра-ссылки на вариант, его значение MUST быть объявленным значением ссылаемого `@state-variant`.

---

## 6. Runtime-семантика

Runtime-семантика описывает, как ECSS-трансформер или runtime разрешает конструкции в CSS. Этот раздел информативен для разработчиков парсера и нормативен для разработчиков трансформера.

### 6.1 Вычисление состояния

Блок `@state-def` вычисляется путём привязки каждого параметра к конкретному значению:

- `boolean`-параметр без переданного значения привязывается к объявленному дефолту, или `false`, если дефолт не объявлен
- Параметр-вариант без переданного значения привязывается к объявленному дефолту. Если дефолт не объявлен, параметр MUST быть явно передан; его отсутствие является runtime-ошибкой

### 6.2 Выбор ветки условия

При заданном окружении привязанных параметров `@if`-цепочка вычисляется следующим образом:

1. Вычислить условие `@if`-блока. Если `true` — применить тело этого блока, пропустить все оставшиеся
2. Иначе вычислять каждый `@elseif`-блок по порядку. Для первого с `true` — применить тело, пропустить остальные
3. Если ни один блок не выбран и присутствует `@else` — применить его тело

Вычисление условий — с ранним выходом: в `A && B` не вычисляется `B`, если `A` ложно; в `A || B` не вычисляется `B`, если `A` истинно.

---

## 7. Связь с CSS

### 7.1 Надмножество

Любой синтаксически и семантически валидный CSS-stylesheet является валидным ECSS-stylesheet. ECSS не переопределяет и не ограничивает никакую CSS-продукцию.

### 7.2 Новые at-правила

ECSS вводит ключевые слова `@state-variant`, `@state-def`, `@if`, `@elseif`, `@else`. Эти ключевые слова не определены ни одной CSS-спецификацией. CSS-парсер, не понимающий их, игнорирует соответствующие блоки по правилам обработки ошибок CSS (неизвестные at-правила с блоками).

### 7.3 CSS Nesting

Внутри тел `@state-def` и `@if`/`@elseif`/`@else` синтаксис CSS Nesting (согласно [CSS Nesting Module Level 1](https://www.w3.org/TR/css-nesting-1/)) валиден и MUST быть сохранён в AST.

---

## 8. Примеры

### 8.1 Базовое перечисление и использование

```ecss
@state-variant Theme {
  values: light, dark, "high contrast";
}

@state-variant Size {
  values: sm, md, lg;
}

@state-def Button(--theme Theme: "light", --size Size: "md", --disabled boolean: false) {
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;

  @if (--disabled) {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
  }

  @if (--size == "sm") {
    padding: 4px 8px;
    font-size: 12px;
  }
  @elseif (--size == "md") {
    padding: 8px 16px;
    font-size: 14px;
  }
  @else {
    padding: 12px 24px;
    font-size: 16px;
  }

  @if (--theme == "light") {
    background: #ffffff;
    color: #111111;
    border: 1px solid #cccccc;
  }
  @elseif (--theme == "dark") {
    background: #1e1e1e;
    color: #f0f0f0;
    border: 1px solid #444444;
  }
  @else {
    background: #000000;
    color: #ffffff;
    border: 2px solid #ffffff;
    font-size: 18px;
  }
}
```

### 8.2 Составные условия и вложенный `@if`

```ecss
@state-variant Theme {
  values: light, dark;
}

@state-def Panel(--expanded boolean, --theme Theme: "light", --pinned boolean: false) {
  padding: 16px;
  border: 1px solid #e0e0e0;
  transition: all 0.2s ease;

  @if (--expanded && --theme == "dark") {
    background: #121212;
    border-color: #333333;

    & > .header {
      font-weight: bold;
      color: #ffffff;
    }

    @if (--pinned) {
      border-color: #0077ff;
    }
  }

  @if (--expanded || --pinned) {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}
```

### 8.3 `@state-def` без параметров

```ecss
@state-def Card {
  padding: 24px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background: #ffffff;
}
```

### 8.4 Смешанный CSS и ECSS

```ecss
/* Стандартный CSS — валидный ECSS */
*, *::before, *::after {
  box-sizing: border-box;
}

@state-variant Status {
  values: idle, loading, error, success;
}

@state-def Badge(--status Status: "idle") {
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  padding: 2px 10px;
  font-size: 12px;

  @if (--status == "idle") {
    background: #f0f0f0;
    color: #555555;
  }
  @elseif (--status == "loading") {
    background: #e0f0ff;
    color: #0055cc;
  }
  @elseif (--status == "error") {
    background: #ffe0e0;
    color: #cc0000;
  }
  @else {
    background: #e0ffe0;
    color: #006600;
  }
}

/* Ещё стандартный CSS */
@media (prefers-color-scheme: dark) {
  body { background: #0a0a0a; }
}
```
