---
layout: home

hero:
  name: ECSS
  text: Extended CSS
  tagline: Декларативное управление состоянием компонентов прямо в файлах стилей — без JavaScript-логики в компонентах.
  image:
    src: /logo.svg
    alt: ECSS
  actions:
    - theme: brand
      text: Быстрый старт
      link: /ru/guide/getting-started
    - theme: alt
      text: Введение
      link: /ru/guide/introduction

features:
  - icon: 🎨
    title: Надмножество CSS
    details: Любой валидный CSS является валидным ECSS. Используйте знакомый синтаксис и добавляйте только то, что нужно.

  - icon: ⚡
    title: Состояния без JS
    details: Объявляйте параметры компонента и условные стили прямо в .ecss-файле через @state-def и @if. Логика остаётся в стилях.

  - icon: 🔒
    title: Полная типизация
    details: TypeScript-плагин генерирует точные типы для каждого импорта *.ecss. Автодополнение и проверка типов работают из коробки.

  - icon: 🔌
    title: Любой фреймворк
    details: Работает с React, Vue, Svelte и SolidJS через нативный Vite-плагин.

  - icon: 🛠️
    title: VS Code поддержка
    details: Расширение ECSS — Extended CSS обеспечивает подсветку синтаксиса, диагностику ошибок и hover-подсказки для свойств.

  - icon: 📦
    title: Минимальный рантайм
    details: Крошечный runtime-хелпер (_h, merge) — всё, что попадает в бандл. Никаких тяжёлых зависимостей, никакого лишнего кода.
---
