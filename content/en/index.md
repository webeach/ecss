---
layout: home

hero:
  name: ECSS
  text: Extended CSS
  tagline: Declarative component state management directly in your stylesheets — no JavaScript logic in components.
  image:
    src: /logo.svg
    alt: ECSS
  actions:
    - theme: brand
      text: Getting Started
      link: /guide/getting-started
    - theme: alt
      text: Introduction
      link: /guide/introduction

features:
  - icon: 🎨
    title: CSS Superset
    details: Any valid CSS is valid ECSS. Use familiar syntax and add only what you need.

  - icon: ⚡
    title: States Without JS
    details: Declare component parameters and conditional styles right in your .ecss file via @state-def and @if. Logic stays in the styles.

  - icon: 🔒
    title: Full Type Safety
    details: The TypeScript plugin generates precise types for every *.ecss import. Autocomplete and type checking work out of the box.

  - icon: 🔌
    title: Any Framework
    details: Works with React, Vue, Svelte, and SolidJS via a native Vite plugin.

  - icon: 🛠️
    title: VS Code Support
    details: The ECSS — Extended CSS extension provides syntax highlighting, error diagnostics, and hover hints for properties.

  - icon: 📦
    title: Minimal Runtime
    details: A tiny runtime helper (_h, merge) — that's all that goes into your bundle. No heavy dependencies, no unnecessary code.
---
