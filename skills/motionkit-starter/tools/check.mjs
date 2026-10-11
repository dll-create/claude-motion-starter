#!/usr/bin/env node
// Checks a project against its source before the user sees it.
//
//   node <skill>/tools/check.mjs <project-folder> [--source <file.md|file.txt>]
//
// Checks index.html (video) and deck.json (deck), whichever exist:
//   - every number on screen appears in the source, written the same way
//   - no placeholder text from the starter is left
//   - scenes run back to back and fit inside the video's length
//   - every scene with narration is long enough for it
//   - ids are unique and every <audio> has one
// Exits 1 when there is an error. Run `hyperframes check` as well: it covers
// layout, contrast and rendering, which this does not.
import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { normalise, numbersIn } from './numbers.mjs';


const args = process.argv.slice(2);
const sourceFlag = args.indexOf('--source');
const sourceFile = sourceFlag >= 0 ? args.splice(sourceFlag, 2)[1] : null;
const project = resolve(args[0] || '.');
const read = (p) => readFile(p, 'utf8').catch(() => null);
const errors = [];
const warnings = [];

// What the source says.
let sourceText = sourceFile ? await read(resolve(sourceFile)) : null;
if (sourceFile && sourceText === null) errors.push(`Could not read the source file ${sourceFile}.`);
if (sourceText === null) {
  const manifest = await read(join(project, 'source.json'));
  if (manifest) sourceText = await read(join(project, JSON.parse(manifest).source));
}
const allowed = sourceText === null ? null : new Set(numbersIn(sourceText).map(normalise));
if (allowed === null) warnings.push('No source to compare numbers against. Pass --source <file>.');

const PLACEHOLDERS = ['The one sentence this video proves', 'A supporting line that says who it is for', 'The single number the viewer should remember', 'What the numbers say', 'The first step, in plain words', 'A line from the source, quoted exactly', 'Who said it', 'The takeaway, in plain words', 'Section label'];

function checkNumbers(where, text, { counted = 0 } = {}) {
  if (!allowed) return;
  for (const raw of numbersIn(text)) {
    const n = normalise(raw);
    if (allowed.has(n) || allowed.has(n.replace(/^-/, ''))) continue;
    // List markers (1, 2, 3 …) are numbering, not data.
    if (/^\d+$/.test(n) && Number(n) >= 1 && Number(n) <= counted) continue;
    errors.push(`${where}: "${raw}" is on screen but not in the source. Use the source's figure, written the way the source writes it, or remove it.`);
  }
}
function checkPlaceholders(where, text) {
  for (const p of PLACEHOLDERS) if (text.includes(p)) errors.push(`${where}: starter placeholder text is still there ("${p}").`);
}
const strip = (html) => html.replace(/<(script|style)[\s\S]*?<\/\1>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const attr = (tag, name) => (tag.match(new RegExp(`\\s${name}="([^"]*)"`)) || [])[1];

// Video: index.html
const html = await read(join(project, 'index.html'));
if (html) {
  const root = (html.match(/<[a-z]+[^>]*data-composition-id="[^"]*"[^>]*>/) || [])[0];
  if (!root) errors.push('index.html: no element with data-composition-id.');
  const total = root ? Number(attr(root, 'data-duration')) : NaN;
  const scenes = [...html.matchAll(/<section\b[^>]*>/g)].map((m) => ({ tag: m[0], at: m.index, id: attr(m[0], 'id'), start: Number(attr(m[0], 'data-start')), duration: Number(attr(m[0], 'data-duration')) })).filter((s) => !Number.isNaN(s.start));
  if (!scenes.length) errors.push('index.html: no <section> scenes with data-start.');
  scenes.forEach((s, i) => {
    const where = `Scene ${i + 1}${s.id ? ` (#${s.id})` : ''}`;
    if (!s.id) errors.push(`${where}: needs an id.`);
    if (!(s.duration > 0)) errors.push(`${where}: needs a data-duration above 0.`);
    const prev = scenes[i - 1];
    if (prev) {
      const gap = s.start - (prev.start + prev.duration);
      if (gap < -0.01) errors.push(`${where}: starts at ${s.start}s, before the previous scene ends at ${prev.start + prev.duration}s.`);
      else if (gap > 0.01) errors.push(`${where}: starts at ${s.start}s, leaving ${gap.toFixed(2)}s of empty screen after the previous scene.`);
    } else if (s.start > 0.01) errors.push(`${where}: the first scene should start at 0, not ${s.start}s.`);
    const end = html.indexOf('</section>', s.at);
    const inner = html.slice(s.at, end < 0 ? undefined : end);
    const text = strip(inner);
    checkPlaceholders(where, text);
    checkNumbers(where, text, { counted: (inner.match(/class="step"/g) || []).length });
    const words = (sel) => [...inner.matchAll(new RegExp(`<${sel}\\b[^>]*>([\\s\\S]*?)</${sel}>`, 'g'))].map((m) => strip(m[1]).split(/\s+/).filter(Boolean).length);
    for (const w of words('h1')) if (w > 10) warnings.push(`${where}: the heading is ${w} words. Aim for 8 or fewer.`);
    for (const w of words('h2')) if (w > 14) warnings.push(`${where}: the heading is ${w} words. Shorten it or split the scene.`);
  });
  const last = scenes[scenes.length - 1];
  if (last && !Number.isNaN(total)) {
    const end = last.start + last.duration;
    if (end - total > 0.01) errors.push(`index.html: scenes end at ${end}s but the root data-duration is ${total}s, so the end is cut off. Set it to ${end}.`);
    else if (total - end > 0.01) errors.push(`index.html: the root data-duration is ${total}s but scenes end at ${end}s, leaving a frozen last frame. Set it to ${end}.`);
  }
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  for (const id of new Set(ids.filter((id, i) => ids.indexOf(id) !== i))) errors.push(`index.html: id "${id}" is used more than once.`);
  for (const m of html.matchAll(/<audio\b[^>]*>/g)) {
    const id = attr(m[0], 'id');
    if (!id) errors.push(`index.html: an <audio> has no id, so it will be silent in the render (${attr(m[0], 'src') || 'no src'}).`);
    const end = Number(attr(m[0], 'data-start')) + Number(attr(m[0], 'data-duration'));
    if (!Number.isNaN(total) && end - total > 0.01) warnings.push(`index.html: audio "${id}" runs to ${end.toFixed(2)}s, past the end of the video (${total}s).`);
  }
  // Narration must fit inside its scene.
  const voice = await read(join(project, 'audio', 'voiceover.json'));
  if (voice) {
    for (const line of JSON.parse(voice)) {
      const scene = scenes.find((s) => s.id === line.id);
      if (!scene) warnings.push(`Narration "${line.id}" has no scene with that id.`);
      else if (line.seconds && scene.duration + 0.01 < line.seconds + 0.6) errors.push(`Scene #${line.id}: lasts ${scene.duration}s but its narration is ${line.seconds}s. Make it at least ${(line.seconds + 0.6).toFixed(1)}s.`);
    }
  }
}

// Deck: deck.json
const deckRaw = await read(join(project, 'deck.json'));
if (deckRaw) {
  let deck;
  try {
    deck = JSON.parse(deckRaw);
  } catch (e) {
    errors.push(`deck.json is not valid JSON: ${e.message}`);
  }
  (deck?.scenes || []).forEach((s, i) => {
    const where = `Slide ${i + 1} (${s.type})`;
    const shown = [];
    const collect = (v, key) => {
      if (key === 'answer' || key === 'highlight' || key === 'type' || key === 'notes') return;
      if (Array.isArray(v)) v.forEach((x) => collect(x));
      else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => collect(x, k));
      else if (v !== null && v !== undefined) shown.push(String(v));
    };
    collect(s);
    const text = shown.join(' \n ');
    checkPlaceholders(where, text);
    checkNumbers(where, text);
    if (s.type === 'quiz') {
      const answers = [].concat(s.answer);
      if (!Array.isArray(s.options) || s.options.length < 2) errors.push(`${where}: a quiz needs at least 2 options.`);
      else if (!answers.length || answers.some((a) => !Number.isInteger(a) || a < 0 || a >= s.options.length)) errors.push(`${where}: "answer" must be the position of a real option (0 to ${s.options.length - 1}).`);
    }
    if (s.type === 'chart') {
      for (const series of s.series || [{ values: s.values || [] }]) if ((series.values || []).length !== (s.labels || []).length) errors.push(`${where}: a series has ${(series.values || []).length} values for ${(s.labels || []).length} labels.`);
    }
    if (!s.notes && s.type !== 'title') warnings.push(`${where}: no speaker notes.`);
  });
}

if (!html && !deckRaw) errors.push(`Nothing to check in ${project}: no index.html and no deck.json.`);

for (const w of warnings) console.log(`  ! ${w}`);
for (const e of errors) console.log(`  ✗ ${e}`);
console.log(errors.length ? `\n  ${errors.length} to fix${warnings.length ? `, ${warnings.length} to look at` : ''}.\n` : `\n  ✓ Passed${warnings.length ? ` with ${warnings.length} to look at` : ''}.${allowed ? ' Every number on screen is in the source.' : ''}\n`);
process.exit(errors.length ? 1 : 0);
