# Инструменты разработки

## VS Code Extension

**ECSS — Extended CSS** — расширение для Visual Studio Code, которое обеспечивает полноценную поддержку `.ecss`-файлов в редакторе.

### Установка

Установите напрямую из VS Code Marketplace:

[![Установить в VS Code](https://img.shields.io/badge/Установить%20в%20VS%20Code-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white)](vscode:extension/webeach.ecss-language-support)

Или найдите в Marketplace по названию **ECSS — Extended CSS**: [marketplace.visualstudio.com](https://marketplace.visualstudio.com/items?itemName=webeach.ecss-language-support)

### Возможности

#### Подсветка синтаксиса

Расширение регистрирует язык `ecss` с TextMate-грамматикой. Получают подсветку:

- `@state-variant` — имя и список значений
- `@state-def` — имя, параметры и их типы/дефолты
- `@if` / `@elseif` / `@else` — ключевые слова, условия
- Операторы условий (`==`, `!=`, `&&`, `||`)
- Параметры (custom properties `--name`)
- Типы (`boolean`, ссылки на варианты)
- Вложенный CSS — через встроенную CSS-грамматику

#### Диагностика ошибок

При открытии `.ecss`-файла Language Server в реальном времени парсит его через `@ecss/parser` (WASM-сборка) и отображает ошибки прямо в редакторе:

```
[SEM-1] Duplicate @state-variant name: "Size"
[SEM-8] Unknown @state-variant reference: "Color"
[2:15] Expected ',' or ')'
```

Ошибки статической семантики (правила SEM-1...SEM-11) также диагностируются — см. [Спецификацию языка](/ru/reference/spec).

#### Hover-подсказки

При наведении курсора на элементы `.ecss`-файла всплывают подсказки:

| Элемент                | Что показывает                                        |
| ---------------------- | ----------------------------------------------------- |
| `--param` в условии    | Тип и значение по умолчанию параметра                 |
| `@state-variant Name`  | Список объявленных значений                           |
| `@state-def Name(...)` | Сигнатура: все параметры с типами и дефолтами         |
| CSS-свойство           | Документация MDN (через `vscode-css-languageservice`) |

### Что расширение не делает

- **Автодополнение** в `.ecss`-файлах — пока не реализовано
- **Типизация импортов** в TypeScript — за это отвечает `@ecss/typescript-plugin`

---

## TypeScript Plugin (`@ecss/typescript-plugin`)

TypeScript Language Service Plugin генерирует точные типы для каждого импорта `*.ecss` прямо в IDE — без отдельной команды сборки.

### Как это работает

Плагин встраивается в TypeScript Language Server (tsserver) и перехватывает запросы типов для `.ecss`-файлов. При обращении к `import styles from './Button.ecss'` плагин:

1. Читает `.ecss`-файл с диска
2. Парсит его в AST через `@ecss/parser`
3. Генерирует `.d.ts`-строку через `@ecss/transformer`
4. Возвращает её как виртуальный TypeScript-файл

В результате IDE видит точные типы: какие параметры принимает каждая стиль-фабрика, какие значения допустимы для variant-параметров.

### Установка

::: code-group

```sh [npm]
npm install -D @ecss/typescript-plugin
```

```sh [pnpm]
pnpm add -D @ecss/typescript-plugin
```

```sh [yarn]
yarn add -D @ecss/typescript-plugin
```

:::

### Настройка `tsconfig.json`

```json
{
  "compilerOptions": {
    "strict": true,
    "plugins": [{ "name": "@ecss/typescript-plugin" }]
  }
}
```

::: tip VS Code — переключение на workspace TypeScript
Чтобы VS Code использовал TypeScript-плагин из `node_modules` (а не встроенный TypeScript), необходимо переключиться на рабочий TypeScript:

1. Откройте любой `.ts`-файл
2. `Cmd+Shift+P` → **TypeScript: Select TypeScript Version**
3. Выберите **Use Workspace Version**

Или добавьте в `.vscode/settings.json`:

```json
{
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

:::

### Что получает разработчик

Полная типизация при работе с `.ecss`:

```ts
import styles from './Button.ecss';

// ✅ Правильно — все параметры необязательны (есть дефолты)
const attrs = styles.Button({ variant: 'primary' });

// ✅ Допустимые значения подсказываются автодополнением
const attrs2 = styles.Button({ variant: 'danger', size: 'lg' });

// ❌ Ошибка TypeScript — 'xl' не объявлен в @state-variant Size
const attrs3 = styles.Button({ size: 'xl' });

// ❌ Ошибка TypeScript — 'Foo' не существует в импорте
const bar = styles.Foo();
```

### Передача конфигурации

Плагин автоматически читает `ecss.config.json` из корня проекта. Дополнительно можно передать опции в `tsconfig.json`:

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "@ecss/typescript-plugin",
        "classAttribute": "class",
        "classTemplate": "[name]-[hash:6]"
      }
    ]
  }
}
```

### Ограничения

- Плагин работает только в **IDE** (через Language Service). Команда `tsc` не использует Language Service Plugins.
- Для проверки типов при сборке через `tsc` используйте `generateDeclarations: true` в конфиге — тогда рядом с исходниками появятся `.ecss.d.ts`-файлы, которые `tsc` подхватит автоматически.

### Поддерживаемые редакторы

Любой редактор, который использует TypeScript Language Service (tsserver):

- **Visual Studio Code** — полная поддержка
- **WebStorm / JetBrains IDE** — через встроенный TypeScript Language Server
- **Neovim** с `nvim-lspconfig` + `tsserver` — работает
- **Helix**, **Zed** и другие с LSP-поддержкой TypeScript — работает
