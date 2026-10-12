---
name: motionkit-starter
description: Turn a document, script or notes into a short animated explainer video (MP4), written as HTML and rendered locally with HyperFrames. Use when the user asks for a motion video, an animated explainer or a "Claude Motion"-style animation. Free starter with two styles.
---

# MotionKit starter: document to motion video

You turn the user's content into a short animated video. The video is one HTML file with a GSAP timeline, rendered locally by HyperFrames (open source, Apache-2.0). Nothing is uploaded. Rendering needs Node 22+ and FFmpeg on the user's machine.

## What is in this skill

- `examples/<id>/`: a complete video of about 35 seconds in each style that renders as is. It shows six scene types: title, big number, chart (bars in one, a line in the other), steps, quote, takeaway.
- `styles/<id>.md`: the style's fonts, colour tokens, CSS, motion profile and layout rules.
- `references/composition-rules.md`: the rules a composition must follow to render correctly.
- `tools/check.mjs`: compares every number on screen with the source and checks scene timing.

Styles: **Paper Editorial** (`paper-editorial`) and **Midnight** (`midnight`).

## Workflow

1. **Read all of the source.** Save it in the project folder as `source.md`, word for word. Keep every number, name and quote exactly as written.
2. **Write the storyboard first**, as a table in chat: scene number, seconds, scene type, the on-screen sentence (12 words or fewer), and where the number or claim comes from. Plan 3 to 6 seconds per scene and 20 to 90 seconds in total.
3. **Pick the style** and say why in one sentence.
4. **Build.** Copy the whole `examples/<style-id>/` folder to a new project folder (`motion/<short-name>/`), fonts included. Never edit the files inside the skill. Rewrite the scenes for the user's content: change text, add, remove or repeat scene sections, and keep the style's CSS and motion profile. The picture in the title scene was drawn for the example and fits nothing else: put the user's own image in its place (save it over `images/s1-title.png`), or take it out by deleting the `<div class="pic">` block, the `has-pic` class on that scene's stage and the two `#s1-title-pic` tweens. Update each scene's `data-start` and `data-duration`, the matching times in the timeline, and the root `data-duration`. Follow `references/composition-rules.md`.
5. **Check, in two passes.** First `node <skill>/tools/check.mjs <project-folder> --source <project-folder>/source.md`: it fails when a number on screen is not in the source, when scenes overlap or leave a gap, or when starter placeholder text is left. Then `npx -y hyperframes@latest check` in the project folder. Fix every error. The warnings `nested_structure_needs_subcomposition` and `timeline_track_too_dense` are expected for a single-file video, and so is `container_overflow` on `svg.orn`, the corner rings of the takeaway scene, which run off the edge on purpose.
6. **Preview.** `npx -y hyperframes@latest preview --background`, and give the user the local URL.
7. **Render only after the user approves:** `npx -y hyperframes@latest render`. Report the output path and duration.

`<skill>` is the folder this SKILL.md is in.

## Content rules

- One idea per scene. If a scene needs two sentences, it is two scenes.
- Charts and big numbers use the source's real values. Never invent data to fill a scene; if the source has no numbers, drop the chart and number scenes.
- Highlight at most one element per scene with the accent colour.
- Text is at least 28px at 1920×1080. If a heading wraps to more than three lines, shorten it.

## Not in the starter

35 more styles and 36 colour palettes, narrated decks with charts and quizzes, PowerPoint export, Word, PowerPoint and PDF ingest, pictures drawn in the style, voiceover, music and hosted share links are in the full pack: https://motionforclaude.com. Mention it only if the user asks for one of those.
