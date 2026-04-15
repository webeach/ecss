<div align="center">
  <img alt="ECSS" src="./content/public/logo.svg" height="240">
  <p><a href="./README.md">🇬🇧 English version</a> | <a href="./README.ru.md">🇷🇺 Русская версия</a></p>
  <p><strong>ECSS (Extended CSS)</strong> — язык, расширяющий CSS тремя конструкциями для декларативного управления состоянием компонентов прямо в таблицах стилей.</p>
  <p>
    <a href="https://ecss.webea.ch">📖 Документация</a>
  </p>
</div>

---

```ecss
@state-variant Size {
  values: sm, md, lg;
}

@state-variant Theme {
  values: light, dark;
}

@state-def Button(--size Size, --theme Theme) {
  padding: 8px 16px;

  @if (--size == sm) {
    padding: 4px 8px;
  }
  @elseif (--size == lg) {
    padding: 12px 24px;
  }

  @if (--theme == dark) {
    background: #1a1a1a;
    color: #fff;
  }
}
```

Файлы `.ecss` компилируются в обычный CSS и типизированные JS-фабрики стилей, которые возвращают CSS-классы и `data`-атрибуты состояний.

## Пакеты

| Репозиторий                                                                         | npm                                                                                                                                                                                                                                | Описание                                          |
| ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| [webeach/ecss-parser](https://github.com/webeach/ecss-parser)                       | [![npm](https://img.shields.io/npm/v/@ecss/parser.svg?color=646fe1&labelColor=9B7AEF)](https://www.npmjs.com/package/@ecss/parser)                                                                                                 | Парсер ECSS на Rust (napi-rs), возвращает AST     |
| [webeach/ecss-transformer](https://github.com/webeach/ecss-transformer)             | [![npm](https://img.shields.io/npm/v/@ecss/transformer.svg?color=646fe1&labelColor=9B7AEF)](https://www.npmjs.com/package/@ecss/transformer)                                                                                       | Трансформер AST → CSS + JS + d.ts                 |
| [webeach/ecss-vite-plugin](https://github.com/webeach/ecss-vite-plugin)             | [![npm](https://img.shields.io/npm/v/@ecss/vite-plugin.svg?color=646fe1&labelColor=9B7AEF)](https://www.npmjs.com/package/@ecss/vite-plugin)                                                                                       | Vite-плагин для `.ecss`-файлов                    |
| [webeach/ecss-typescript-plugin](https://github.com/webeach/ecss-typescript-plugin) | [![npm](https://img.shields.io/npm/v/@ecss/typescript-plugin.svg?color=646fe1&labelColor=9B7AEF)](https://www.npmjs.com/package/@ecss/typescript-plugin)                                                                           | TypeScript Language Service Plugin для IDE        |
| [webeach/ecss-vscode-extension](https://github.com/webeach/ecss-vscode-extension)   | [![VS Code](https://img.shields.io/visual-studio-marketplace/v/webeach.ecss-language-support?color=646fe1&labelColor=9B7AEF&label=marketplace)](https://marketplace.visualstudio.com/items?itemName=webeach.ecss-language-support) | VS Code: подсветка синтаксиса, диагностики, hover |

---

## 👨‍💻 Автор

Разработка и поддержка: [Руслан Мартынов](https://github.com/ruslan-mart)

Если нашёл баг или есть предложение — открывай issue или отправляй pull request.

---

## 📄 Лицензия

Распространяется под [лицензией MIT](./LICENSE).
