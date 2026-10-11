# Composition rules

A composition is one HTML file. HyperFrames seeks a paused GSAP timeline frame by frame, so everything on screen must be a pure function of time.

## Structure

- The root is a `<div>` directly in `<body>` with `data-composition-id`, `data-width`, `data-height` and `data-duration` (seconds). Do not wrap it in `<template>`.
- Size the root with `width: 100%; height: 100%`. The canvas size comes from `data-width` and `data-height`; never hardcode `1920px` on the root.
- Each scene is a `<section class="clip" data-start="S" data-duration="D">`. The runtime shows and hides clips by time. Scenes must not overlap unless you intend a layered look.
- Put the background fill on a full-bleed child (`position: absolute; inset: 0`), not on the root.
- Every `id` is unique in the file.
- If a clip ends after the root's `data-duration`, it is cut off. Raise the root duration in the same edit.

## Timeline

- Exactly one `gsap.timeline({ paused: true })`, registered as `window.__timelines["<composition-id>"]`. The key must equal the root's `data-composition-id`.
- Position every tween at an absolute time (the third argument), matching the scene's `data-start`.
- The render length is the root `data-duration`, not the timeline length.

## Things that break renders

- Never animate `opacity`, `visibility`, `display` or `autoAlpha` on a `.clip` element itself. Animate its children.
- Never combine a CSS `transform` with a GSAP tween of the same property on one element. Set the start state in the tween: `gsap.fromTo(el, { scaleY: 0 }, { scaleY: 1 })`.
- Center with flexbox or `inset`, not `transform: translate(-50%, -50%)`.
- No `Date.now()`, no unseeded `Math.random()`, no network requests, no hover or scroll state. `repeat: -1` is only safe under a fixed root `data-duration`.
- No `<br>` in body text. Elements you transform must be block-level with a size.
- A named `font-family` (for example `Inter`) needs an `@font-face` pointing at a local file in the project, such as `fonts/inter-latin-400-normal.woff2`. Generic families (`system-ui`, `serif`, `monospace`) need nothing but look different on every machine, so prefer the bundled files.

## Media

- `<audio>` needs an `id`, a `data-start` and a duration, or it is silent in the render.
- Never put `crossorigin` on `<video>` or `<audio>`.
- A `<video data-start>` must not sit inside another element that also has `data-start`.
- Reference local files with relative paths inside the project folder.

## Common visuals

- **Bars:** set each bar's final `height` in CSS, `transform-origin: 50% 100%`, then `fromTo` `scaleY` 0 to 1 with a stagger.
- **Counting numbers:** tween a plain object and write `textContent` in `onUpdate`, rounding to the source's precision. The examples do this in the big-number scene.
- **Entrances:** the examples define one `enter(selector, time)` helper driven by the style's `MOTION` profile. Use it for every new element so the whole video moves the same way.
- **Line draw:** SVG path with `stroke-dasharray` set to its length, tween `stroke-dashoffset` from the length to 0.
- **Wipe reveal:** `fromTo` `clipPath` from `inset(0 100% 0 0)` to `inset(0 0% 0 0)`.
- **Typewriter:** split the text into `<span>` characters at build time and stagger their opacity with `ease: "none"`.
