# Midnight

Best for: Developer products, roadmaps, changelogs.

Near-black canvas, hairline borders, tight type and a single lavender glow. Precise and quiet.

A complete, renderable example of this style is in `examples/midnight/`. Read it before building: it shows every scene type in this look.

## Fonts

Copy these files from the skill's `fonts/` folder into the project's `fonts/` folder, then declare them:

- `inter-latin-700-normal.woff2` (Inter 700)
- `inter-latin-400-normal.woff2` (Inter 400)

```css
@font-face {
  font-family: "Inter";
  font-weight: 700;
  font-style: normal;
  src: url("fonts/inter-latin-700-normal.woff2") format("woff2");
}
@font-face {
  font-family: "Inter";
  font-weight: 400;
  font-style: normal;
  src: url("fonts/inter-latin-400-normal.woff2") format("woff2");
}
```

## Tokens

```css
:root {
  --bg: #0b0c10;
  --bg2: #0b0c10;
  --ink: #f2f3f7;
  --accent: #a596ff;
  --muted: #9197aa;
  --surface: #14161c;
  --head: "Inter", sans-serif;
  --body: "Inter", sans-serif;
  --weight: 700;
  --radius: 14px;
}
```

## Style CSS

Add after the shared scene layout.

```css
#backdrop { background: radial-gradient(1000px 520px at 50% -8%, rgba(165, 150, 255, 0.28), transparent 70%), var(--bg); }
h1 { font-size: 118px; letter-spacing: -0.04em; } h2 { font-size: 72px; letter-spacing: -0.03em; }
.step, .bar { border: 2px solid #272a35; } .bar.is-key { border-color: var(--accent); box-shadow: 0 0 60px rgba(165, 150, 255, 0.45); }
.step b { background: #272a35; color: var(--accent); } .label { letter-spacing: 0.2em; }
```

## Motion profile

```js
const MOTION = {"enter":"rise","ease":"power3.out","dur":0.5,"stagger":0.07,"rise":14};
```

Short 14px rises, 0.5s, power3.out, tightly staggered at 0.07s. Fast and exact, with no overshoot.

## Layout

One soft glow behind the content. Every panel has a 2px hairline border. Headings are tight and not large.
