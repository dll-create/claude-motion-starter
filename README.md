# MotionKit starter: Claude Motion-style videos on any plan

A free skill for Claude Code, Codex and Cursor that turns a document into a short animated explainer video. Your agent writes the animation as HTML, and [HyperFrames](https://github.com/heygen-com/hyperframes) renders it to MP4 on your own computer.

Anthropic's Claude Motion is in beta on Team and Enterprise plans. This works with the coding agent you already have, on Pro, Max or an API key.

> MotionKit is an independent project. It is not made by, affiliated with or endorsed by Anthropic.

| Paper Editorial | Midnight |
| --- | --- |
| ![Paper Editorial example](docs/paper-editorial.gif) | ![Midnight example](docs/midnight.gif) |

Both clips are real output of the example projects in this repo, not mock-ups.

## Install

You need Node.js 22 or newer and FFmpeg.

```bash
git clone https://github.com/dll-create/claude-motion-starter.git
```

Then copy the skill into your agent's skills folder:

```bash
cp -r claude-motion-starter/skills/motionkit-starter ~/.claude/skills/
```

For Codex use `~/.codex/skills/`, for Cursor `~/.cursor/skills/`. Restart the agent, attach a document and say:

> Turn this doc into a motion video.

## What you get

- **Two complete styles**: Paper Editorial (essays, explainers, thought pieces); Midnight (developer products, roadmaps, changelogs). Each has its fonts, colour tokens, layout rules and motion profile.
- **A working 28-second example in each style** with six scene types: title, big number that counts up, bar chart, steps, quote and takeaway. Each renders as is.
- **Composition rules** that keep the agent's output renderable: one paused timeline, no CSS transforms fighting tweens, scenes that run back to back.
- **A source check**: `tools/check.mjs` fails the build when a number on screen is not in your document, or is written differently from how your document writes it.

## Try an example without an agent

```bash
cd claude-motion-starter/skills/motionkit-starter/examples/paper-editorial
npx -y hyperframes@latest render
```

## The full pack

This starter is the video workflow with two styles. [MotionKit](https://motionforclaude.com) is the paid pack:

| | Starter (this repo) | MotionKit |
| --- | --- | --- |
| Styles | 2 | 16 |
| MP4 video | Yes | Yes |
| Interactive deck with quizzes, filters and drag-to-match | No | Yes |
| PowerPoint export | No | Yes |
| Reads Word and PowerPoint files | No | Yes |
| Voiceover and music beds | No | Yes |
| Hosted share links | No | Yes |
| Price | Free, MIT | From $19.9 a month |

See [all 16 styles](https://motionforclaude.com/claude-motion-templates) and [rendered examples](https://motionforclaude.com/claude-motion-examples).

## Licence

Code and documentation: MIT, see [LICENSE](LICENSE). Fonts are under the SIL Open Font License; their licences are in `skills/motionkit-starter/fonts/licenses/`. Questions: support@motionforclaude.com.
