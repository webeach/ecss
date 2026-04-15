# Конфигурация

ECSS поддерживает два способа настройки: файл `ecss.config.json` в корне проекта и опции плагина в `vite.config.ts`. При наличии обоих настройки из файла используются как основа, а опции плагина их дополняют или переопределяют.

## `ecss.config.json`

Создайте файл в корне проекта (рядом с `package.json`):

```json
{
  "$schema": "https://ecss.webea.ch/schema/v0.1/ecss.config.json",
  "classAttribute": "class",
  "classTemplate": "[name]-[hash:6]",
  "generateDeclarations": false
}
```

Все поля опциональны. Поле `$schema` включает автодополнение и валидацию в VS Code и других редакторах с поддержкой JSON Schema — его можно опустить, если это не нужно.

### `classAttribute`

Управляет ключом атрибута класса в объекте, возвращаемом стиль-фабриками.

| Значение      | Возвращаемый ключ         | Для кого                 |
| ------------- | ------------------------- | ------------------------ |
| `"className"` | `className`               | React (по умолчанию)     |
| `"class"`     | `class`                   | Vue, Svelte, SolidJS     |
| `"both"`      | `className` **и** `class` | универсальные компоненты |

```json
{ "classAttribute": "class" }
```

При `"both"` объект будет содержать оба ключа с одинаковым значением:

```js
styles.Button({ variant: 'primary' });
// → { className: 'Button-a3f2c1', class: 'Button-a3f2c1', 'data-e-a3f2c1-variant': 'primary' }
```

### `classTemplate`

Шаблон для генерации имён CSS-классов. По умолчанию: `[name]-[hash:6]`.

Доступные плейсхолдеры:

| Плейсхолдер | Значение                              |
| ----------- | ------------------------------------- |
| `[name]`    | Имя `@state-def` (например, `Button`) |
| `[hash]`    | Полный хеш файла                      |
| `[hash:N]`  | Первые N символов хеша                |

```json
{ "classTemplate": "[name]__[hash:8]" }
```

::: tip
Изменение шаблона полезно для дебага (длинный хеш) или для соблюдения соглашений проекта. При коротком хеше риск коллизий минимален на практике.
:::

### `generateDeclarations`

Если `true`, плагин создаёт файл `.ecss.d.ts` рядом с каждым `.ecss`-файлом. Эти файлы содержат точные TypeScript-типы и используются IDE в Svelte-проектах (и других, где TypeScript Language Service Plugin не загружается).

```json
{ "generateDeclarations": true }
```

Пример генерируемого `Button.ecss.d.ts`:

```ts
declare const styles: {
  Button: (params?: {
    variant?: 'primary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
  }) => Record<string, string | undefined>;
};
export default styles;
```

::: warning
Добавьте `**/*.ecss.d.ts` в `.gitignore` — эти файлы генерируются автоматически и не должны попадать в репозиторий.
:::

## Опции плагина

Те же настройки можно передать напрямую при регистрации плагина в `vite.config.ts`. Они дополняют (не заменяют) `ecss.config.json`:

```ts
import ecss from '@ecss/vite-plugin';

ecss({
  classAttribute: 'className',
  classTemplate: '[name]-[hash:6]',
  extensions: ['.ecss'],
  generateDeclarations: false,
});
```

### Полная таблица опций

| Опция                  | Тип                                | По умолчанию        | Описание                                      |
| ---------------------- | ---------------------------------- | ------------------- | --------------------------------------------- |
| `classAttribute`       | `'className' \| 'class' \| 'both'` | `'className'`       | Ключ атрибута класса в возвращаемом объекте   |
| `classTemplate`        | `string`                           | `'[name]-[hash:6]'` | Шаблон имени CSS-класса                       |
| `extensions`           | `string[]`                         | `['.ecss']`         | Расширения файлов для обработки               |
| `generateDeclarations` | `boolean`                          | `false`             | Генерировать `.ecss.d.ts` рядом с исходниками |

### `extensions`

Позволяет добавить другие расширения помимо `.ecss`:

```ts
ecss({
  extensions: ['.ecss', '.styles'],
});
```

## Приоритет настроек

```
ecss.config.json  ←  перекрывается  ←  опции плагина
```

Если одно и то же поле задано и в файле, и в опциях плагина, **побеждает значение из опций плагина**.

Пример:

```json
// ecss.config.json
{ "classAttribute": "class", "generateDeclarations": true }
```

```ts
// vite.config.ts
ecss({ classAttribute: 'both' });
// Итого: classAttribute='both', generateDeclarations=true
```

## Конфигурация для разных фреймворков

::: code-group

```json [React]
{}
```

```json [Vue]
{
  "classAttribute": "class"
}
```

```json [Svelte]
{
  "classAttribute": "class",
  "generateDeclarations": true
}
```

```json [SolidJS]
{
  "classAttribute": "class"
}
```

:::

## TypeScript-плагин: конфигурация

`@ecss/typescript-plugin` читает `ecss.config.json` из корня проекта автоматически. Дополнительно можно передать опции через запись в `tsconfig.json`:

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

Поддерживаются те же поля, что и в `EcssConfig` (`classAttribute`, `classTemplate`, `generateDeclarations`).
