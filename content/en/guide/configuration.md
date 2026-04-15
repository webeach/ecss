# Configuration

ECSS supports two configuration methods: an `ecss.config.json` file in the project root and plugin options in `vite.config.ts`. When both are present, the file is used as the base, and plugin options supplement or override it.

## `ecss.config.json`

Create a file in the project root (next to `package.json`):

```json
{
  "$schema": "https://ecss.webea.ch/schema/v0.1/ecss.config.json",
  "classAttribute": "class",
  "classTemplate": "[name]-[hash:6]",
  "generateDeclarations": false
}
```

All fields are optional. The `$schema` field enables autocompletion and validation in VS Code and other editors that support JSON Schema — you can omit it if you don't need that.

### `classAttribute`

Controls the class attribute key in the object returned by style factories.

| Value         | Returned key                | For                  |
| ------------- | --------------------------- | -------------------- |
| `"className"` | `className`                 | React (default)      |
| `"class"`     | `class`                     | Vue, Svelte, SolidJS |
| `"both"`      | `className` **and** `class` | universal components |

```json
{ "classAttribute": "class" }
```

With `"both"` the object will contain both keys with the same value:

```js
styles.Button({ variant: 'primary' });
// → { className: 'Button-a3f2c1', class: 'Button-a3f2c1', 'data-e-a3f2c1-variant': 'primary' }
```

### `classTemplate`

Template for generating CSS class names. Default: `[name]-[hash:6]`.

Available placeholders:

| Placeholder | Value                             |
| ----------- | --------------------------------- |
| `[name]`    | `@state-def` name (e.g. `Button`) |
| `[hash]`    | Full file hash                    |
| `[hash:N]`  | First N characters of the hash    |

```json
{ "classTemplate": "[name]__[hash:8]" }
```

::: tip
Changing the template is useful for debugging (longer hash) or to match project naming conventions. Short hashes have a negligible collision risk in practice.
:::

### `generateDeclarations`

If `true`, the plugin creates a `.ecss.d.ts` file next to each `.ecss` source file. These files contain precise TypeScript types and are used by IDEs in Svelte projects (and others where the TypeScript Language Service Plugin doesn't load).

```json
{ "generateDeclarations": true }
```

Example of a generated `Button.ecss.d.ts`:

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
Add `**/*.ecss.d.ts` to `.gitignore` — these files are generated automatically and should not be committed.
:::

## Plugin options

The same settings can be passed directly when registering the plugin in `vite.config.ts`. They supplement (not replace) `ecss.config.json`:

```ts
import ecss from '@ecss/vite-plugin';

ecss({
  classAttribute: 'className',
  classTemplate: '[name]-[hash:6]',
  extensions: ['.ecss'],
  generateDeclarations: false,
});
```

### Full options table

| Option                 | Type                               | Default             | Description                                |
| ---------------------- | ---------------------------------- | ------------------- | ------------------------------------------ |
| `classAttribute`       | `'className' \| 'class' \| 'both'` | `'className'`       | Class attribute key in the returned object |
| `classTemplate`        | `string`                           | `'[name]-[hash:6]'` | CSS class name template                    |
| `extensions`           | `string[]`                         | `['.ecss']`         | File extensions to process                 |
| `generateDeclarations` | `boolean`                          | `false`             | Generate `.ecss.d.ts` next to source files |

### `extensions`

Allows adding other extensions besides `.ecss`:

```ts
ecss({
  extensions: ['.ecss', '.styles'],
});
```

## Option priority

```
ecss.config.json  ←  overridden by  ←  plugin options
```

If the same field is set in both the file and the plugin options, **the plugin option wins**.

Example:

```json
// ecss.config.json
{ "classAttribute": "class", "generateDeclarations": true }
```

```ts
// vite.config.ts
ecss({ classAttribute: 'both' });
// Result: classAttribute='both', generateDeclarations=true
```

## Configuration by framework

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

## TypeScript plugin configuration

`@ecss/typescript-plugin` reads `ecss.config.json` from the project root automatically. You can also pass options via `tsconfig.json`:

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

The same fields as in `EcssConfig` are supported (`classAttribute`, `classTemplate`, `generateDeclarations`).
