import { defineConfig } from 'vitepress';

import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ecssGrammar = JSON.parse(
  readFileSync(path.resolve(__dirname, './ecss.tmLanguage.json'), 'utf-8'),
);

const enSidebar = [
  {
    text: 'Guide',
    items: [
      { text: 'Introduction', link: '/guide/introduction' },
      { text: 'Getting Started', link: '/guide/getting-started' },
      { text: 'Core Concepts', link: '/guide/concepts' },
      {
        text: 'Framework Integrations',
        collapsed: false,
        items: [
          { text: 'React', link: '/guide/frameworks/react' },
          { text: 'Vue', link: '/guide/frameworks/vue' },
          { text: 'Svelte', link: '/guide/frameworks/svelte' },
          { text: 'SolidJS', link: '/guide/frameworks/solid' },
        ],
      },
      { text: 'Configuration', link: '/guide/configuration' },
      { text: 'Tooling', link: '/guide/tooling' },
    ],
  },
  {
    text: 'Reference',
    items: [
      { text: 'Runtime API', link: '/reference/runtime' },
      { text: 'Language Specification', link: '/reference/spec' },
    ],
  },
];

const ruSidebar = [
  {
    text: 'Руководство',
    items: [
      { text: 'Введение', link: '/ru/guide/introduction' },
      { text: 'Быстрый старт', link: '/ru/guide/getting-started' },
      { text: 'Основные концепции', link: '/ru/guide/concepts' },
      {
        text: 'Интеграции с фреймворками',
        collapsed: false,
        items: [
          { text: 'React', link: '/ru/guide/frameworks/react' },
          { text: 'Vue', link: '/ru/guide/frameworks/vue' },
          { text: 'Svelte', link: '/ru/guide/frameworks/svelte' },
          { text: 'SolidJS', link: '/ru/guide/frameworks/solid' },
        ],
      },
      { text: 'Конфигурация', link: '/ru/guide/configuration' },
      { text: 'Инструменты разработки', link: '/ru/guide/tooling' },
    ],
  },
  {
    text: 'Справочник',
    items: [
      { text: 'Runtime API', link: '/ru/reference/runtime' },
      { text: 'Спецификация языка', link: '/ru/reference/spec' },
    ],
  },
];

export default defineConfig({
  title: 'ECSS',
  description:
    'Extended CSS — declarative component state management in stylesheets',

  srcDir: 'content',
  rewrites: {
    'en/:rest*': ':rest*',
  },

  head: [['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }]],

  markdown: {
    languages: [
      {
        ...ecssGrammar,
        name: 'ecss',
      },
    ],
  },

  locales: {
    root: {
      label: '🇬🇧 English',
      lang: 'en',
      description:
        'Extended CSS — declarative component state management in stylesheets',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/guide/introduction' },
          { text: 'Reference', link: '/reference/spec' },
        ],
        sidebar: enSidebar,
        outline: { label: 'On this page', level: [2, 3] },
        docFooter: { prev: 'Previous page', next: 'Next page' },
        returnToTopLabel: 'Return to top',
        sidebarMenuLabel: 'Menu',
        darkModeSwitchLabel: 'Appearance',
        footer: {
          copyright:
            'Copyright © 2026 <a href="https://github.com/ruslan-mart">Ruslan Martynov</a>',
        },
      },
    },
    ru: {
      label: '🇷🇺 Русский',
      lang: 'ru',
      description:
        'Extended CSS — декларативное управление состоянием компонентов',
      themeConfig: {
        nav: [
          { text: 'Руководство', link: '/ru/guide/introduction' },
          { text: 'Справочник', link: '/ru/reference/spec' },
        ],
        sidebar: ruSidebar,
        outline: { label: 'На этой странице', level: [2, 3] },
        docFooter: { prev: 'Предыдущая страница', next: 'Следующая страница' },
        returnToTopLabel: 'Наверх',
        sidebarMenuLabel: 'Меню',
        darkModeSwitchLabel: 'Тема',
        footer: {
          copyright:
            'Copyright © 2026 <a href="https://github.com/ruslan-mart">Ruslan Martynov</a>',
        },
        search: {
          provider: 'local',
          options: {
            translations: {
              button: { buttonText: 'Поиск', buttonAriaLabel: 'Поиск' },
              modal: {
                noResultsText: 'Ничего не найдено',
                resetButtonTitle: 'Сбросить',
                footer: {
                  selectText: 'выбрать',
                  navigateText: 'перейти',
                  closeText: 'закрыть',
                },
              },
            },
          },
        },
      },
    },
  },

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'ECSS',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/webeach/ecss' },
      {
        icon: {
          svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>',
        },
        link: 'https://t.me/webeach_ru',
      },
    ],
    search: {
      provider: 'local',
    },
  },
});
