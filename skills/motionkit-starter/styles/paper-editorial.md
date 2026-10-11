# Paper Editorial

Best for: Essays, explainers, thought pieces.

Warm paper, a serif headline and one rust accent. Unhurried, like a magazine feature.

A complete, renderable example of this style is in `examples/paper-editorial/`. Read it before building: it shows every scene type in this look.

## Fonts

Copy these files from the skill's `fonts/` folder into the project's `fonts/` folder, then declare them:

- `fraunces-latin-600-normal.woff2` (Fraunces 600)
- `inter-latin-400-normal.woff2` (Inter 400)
- `inter-latin-700-normal.woff2` (Inter 700)

```css
@font-face {
  font-family: "Fraunces";
  font-weight: 600;
  font-style: normal;
  src: url("fonts/fraunces-latin-600-normal.woff2") format("woff2");
}
@font-face {
  font-family: "Inter";
  font-weight: 400;
  font-style: normal;
  src: url("fonts/inter-latin-400-normal.woff2") format("woff2");
}
@font-face {
  font-family: "Inter";
  font-weight: 700;
  font-style: normal;
  src: url("fonts/inter-latin-700-normal.woff2") format("woff2");
}
```

## Tokens

```css
:root {
  --bg: #f4efe6;
  --bg2: #f4efe6;
  --ink: #1f1b16;
  --accent: #b4532a;
  --muted: #857b6d;
  --surface: #e6ddcd;
  --head: "Fraunces", serif;
  --body: "Inter", sans-serif;
  --weight: 600;
  --radius: 4px;
}
```

## Style CSS

Add after the shared scene layout.

```css
.label { border-top: 3px solid var(--accent); padding-top: 18px; align-self: flex-start; }
h1, h2 { letter-spacing: -0.02em; }
```

## Motion profile

```js
const MOTION = {"enter":"rise","ease":"power2.out","dur":0.8,"stagger":0.14,"rise":28};
```

Slow rises of 28px with a fade, 0.8s, power2.out. One element moves at a time. No bounce.

## Layout

Wide left margin, headline top-left, a thin rule above section labels. Bars are flat blocks.
