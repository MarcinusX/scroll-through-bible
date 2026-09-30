#!/usr/bin/env node
// Narration for a chapter: one short mp3 per beat (sentence) plus a manifest with word timings,
// so the theatre can read aloud in step with the caption.
//
//   node tools/voice.mjs mark 4                      # both languages, ElevenLabs if ELEVENLABS_API_KEY is set, else macOS `say`
//   node tools/voice.mjs mark 4 --lang=pl --engine=say --force
//   ELEVENLABS_API_KEY=… node tools/voice.mjs mark 4 --voice-pl=<id> --voice-en=<id>
//
// Output: audio/<book>/<ch>/<lang>/NN.mp3 and audio/<book>/<ch>/<lang>.json:
//   { engine, voice, beats: [{ sid, bi, file, dur, words: [[start, end], …] }], moods: { sceneId: mood } }
// `words` line up one-to-one with the caption's words (text split on whitespace), which is what lets the
// caption reveal and highlight each word as it is spoken. ElevenLabs returns exact per-character timing;
// `say` gives none, so for it the words are spread over the clip and pinned to the pauses it leaves at commas
// and full stops (good enough for a prototype, not for release).
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => { const [k, v = 'true'] = a.slice(2).split('='); return [k, v]; }));
const [bookId, chArg] = args.filter((a) => !a.startsWith('--'));
if (!bookId || !chArg) { console.error('usage: node tools/voice.mjs <book> <chapter> [--lang=pl,en] [--engine=elevenlabs|say] [--force]'); process.exit(1); }
const CH = +chArg;
const KEY = process.env.ELEVENLABS_API_KEY;
const ENGINE = opt.engine || (KEY ? 'elevenlabs' : 'say');
const LANGS = (opt.lang || 'pl,en').split(',');

// ElevenLabs voices: pick calm, warm narrators in the Voice Library and pass their ids.
// eleven_multilingual_v2 reads Polish well; the same voice can read both languages.
const EL = {
  model: opt.model || 'eleven_multilingual_v2',
  voice: { pl: opt['voice-pl'] || opt.voice || 'JBFqnCBsd6RMkjVDRZzb', en: opt['voice-en'] || opt.voice || 'JBFqnCBsd6RMkjVDRZzb' },
  settings: { stability: 0.6, similarity_boost: 0.75, style: 0.1, use_speaker_boost: true, speed: 0.95 },
};
const SAY = { voice: { pl: opt['voice-pl'] || 'Zosia', en: opt['voice-en'] || 'Daniel' }, rate: { pl: 165, en: 165 } };

// scenes whose music should change (the player crossfades between moods); everything else is 'day'
const MOODS = { mark: { 4: { storm: 'storm' } } };

const { BOOKS } = await import(join(ROOT, 'js/chapters/index.js'));
const book = BOOKS[bookId];
const mod = await book.chapters[CH]();
const ORD_PL = ['', 'pierwszy', 'drugi', 'trzeci', 'czwarty', 'piąty', 'szósty', 'siódmy', 'ósmy', 'dziewiąty', 'dziesiąty', 'jedenasty', 'dwunasty', 'trzynasty', 'czternasty', 'piętnasty', 'szesnasty', 'siedemnasty', 'osiemnasty', 'dziewiętnasty', 'dwudziesty', 'dwudziesty pierwszy', 'dwudziesty drugi', 'dwudziesty trzeci', 'dwudziesty czwarty', 'dwudziesty piąty', 'dwudziesty szósty', 'dwudziesty siódmy', 'dwudziesty ósmy'];
const NUM_EN = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty', 'twenty-one', 'twenty-two', 'twenty-three', 'twenty-four', 'twenty-five', 'twenty-six', 'twenty-seven', 'twenty-eight'];

for (const lang of LANGS) {
  const text = await book.text[lang]();
  const verses = text.chapters[CH - 1].verses;
  const strip = (s) => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  // the title card: book, chapter and the chapter's subtitle
  const intro = lang === 'pl'
    ? `${book.name.pl.plain.replace('św.', 'świętego')}. Rozdział ${ORD_PL[CH]}. ${strip(mod.META.pl.coverSub)}.`
    : `${book.name.en.plain}. Chapter ${NUM_EN[CH]}. ${strip(mod.META.en.coverSub)}.`;

  // the same beats and texts the engine builds (see the timeline in engine.js)
  const beats = [];
  mod.SCENES.forEach((sc) => sc.beats.forEach((b, bi) => {
    const vs = Array.isArray(b.v) ? b.v : b.v ? [b.v] : [];
    const own = b.text ? (lang === 'en' ? mod.BEATS_EN[sc.id]?.[bi] ?? b.text : b.text) : null;
    const segs = b.cover ? [] : own ? [own] : vs.map((v) => verses[v - 1]);
    const words = segs.flatMap((s) => s.trim().split(/\s+/));
    beats.push({ sid: sc.id, bi, words, cover: !!b.cover, first: beats.length === 0 });
  }));

  const outDir = join(ROOT, 'audio', bookId, String(CH), lang);
  mkdirSync(outDir, { recursive: true });
  const manPath = join(ROOT, 'audio', bookId, String(CH), `${lang}.json`);
  const old = existsSync(manPath) && !opt.force ? JSON.parse(readFileSync(manPath, 'utf8')) : null;
  const out = [];
  for (let i = 0; i < beats.length; i++) {
    const b = beats[i];
    const file = String(i).padStart(2, '0') + '.mp3';
    // what is spoken: the caption's words without the editorial brackets; a cover beat reads the title (first scene only)
    const spoken = b.cover ? (b.first ? intro : '') : b.words.map(clean).join(' ');
    if (!spoken) { out.push({ sid: b.sid, bi: b.bi, file: null, dur: 0, words: [] }); continue; }
    const prev = old?.beats?.[i];
    if (prev?.file && prev.text === spoken && existsSync(join(outDir, file))) { out.push(prev); continue; }
    const context = { prev: beats[i - 1] ? beats[i - 1].words.map(clean).join(' ') : '', next: beats[i + 1] ? beats[i + 1].words.map(clean).join(' ') : '' };
    const res = ENGINE === 'elevenlabs' ? await eleven(spoken, lang, context, join(outDir, file)) : sayClip(spoken, lang, join(outDir, file));
    const words = b.cover ? [] : res.wordTimes(b.words.map(clean));
    out.push({ sid: b.sid, bi: b.bi, file, dur: +res.dur.toFixed(3), text: spoken, words: words.map(([a, z]) => [+a.toFixed(3), +z.toFixed(3)]), ...(b.cover ? { title: true } : {}) });
    process.stdout.write(`\r${lang} ${i + 1}/${beats.length}  `);
  }
  const voice = ENGINE === 'elevenlabs' ? EL.voice[lang] : SAY.voice[lang];
  writeFileSync(manPath, JSON.stringify({ engine: ENGINE, voice, lang, book: bookId, ch: CH, moods: MOODS[bookId]?.[CH] || {}, beats: out }, null, 0));
  const total = out.reduce((s, b) => s + b.dur, 0);
  console.log(`\r${lang}: ${out.filter((b) => b.file).length} clips, ${(total / 60).toFixed(1)} min of speech → ${manPath.replace(ROOT + '/', '')}`);
}

function clean(w) { return w.replace(/[[\]<>]/g, ''); }

/* ---------- ElevenLabs: text-to-speech with character timestamps ---------- */
async function eleven(text, lang, context, dest) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${EL.voice[lang]}/with-timestamps?output_format=mp3_44100_64`;
  const body = {
    text, model_id: EL.model, voice_settings: EL.settings,
    // neighbouring sentences keep the intonation flowing from one clip to the next
    previous_text: context.prev || undefined, next_text: context.next || undefined,
    language_code: EL.model.includes('multilingual_v2') ? undefined : lang,
  };
  let res;
  for (let tryNo = 0; tryNo < 4; tryNo++) {
    res = await fetch(url, { method: 'POST', headers: { 'xi-api-key': KEY, 'content-type': 'application/json' }, body: JSON.stringify(body) });
    if (res.status !== 429 && res.status < 500) break;
    await new Promise((r) => setTimeout(r, 1500 * (tryNo + 1)));
  }
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
  const j = await res.json();
  writeFileSync(dest, Buffer.from(j.audio_base64, 'base64'));
  const al = j.alignment; // characters[i] ↔ character_start/end_times_seconds[i], over `text`
  const dur = probe(dest);
  return {
    dur,
    wordTimes(words) {
      // walk the words through the spoken string; each word spans its first to last character
      let pos = 0;
      return words.map((w) => {
        const at = text.indexOf(w, pos);
        if (at < 0 || !w) return null;
        pos = at + w.length;
        return [al.character_start_times_seconds[at], al.character_end_times_seconds[at + w.length - 1]];
      }).map((t, i, all) => t || all[i - 1] || [0, 0]);
    },
  };
}

/* ---------- macOS `say`: offline stand-in ---------- */
function sayClip(text, lang, dest) {
  const tmp = join(tmpdir(), `voice-${process.pid}.aiff`);
  execFileSync('say', ['-v', SAY.voice[lang], '-r', String(SAY.rate[lang]), '-o', tmp, text]);
  // trim the silence at both ends, mono 64 kb/s
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', tmp, '-af',
    'silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse',
    '-ac', '1', '-ar', '44100', '-b:a', '64k', dest]);
  rmSync(tmp, { force: true });
  const dur = probe(dest);
  // the pauses the voice left (ffmpeg reports them on stderr)
  const err = execFileSync('sh', ['-c', `ffmpeg -i "${dest}" -af silencedetect=n=-38dB:d=0.09 -f null - 2>&1`], { encoding: 'utf8' });
  const st = [...err.matchAll(/silence_start: ([\d.]+)/g)].map((m) => +m[1]);
  const en = [...err.matchAll(/silence_end: ([\d.]+)/g)].map((m) => +m[1]);
  const silences = st.map((s, i) => [s, en[i] ?? dur]).filter(([s, e]) => s > 0.05 && e < dur - 0.02);
  return { dur, wordTimes: (words) => spreadWords(words, dur, silences) };
}

// Spread the words over the clip by their length, then pin punctuation to the pauses the voice left.
function spreadWords(words, dur, silences) {
  const n = words.length;
  if (!n) return [];
  const weight = words.map((w) => Math.max(1, w.replace(/[^\p{L}\p{N}]/gu, '').length) + 1.2);
  const pauseAfter = words.map((w) => (/[.?!;:»”’]$/.test(w) ? 2 : /[,–—-]$/.test(w) ? 1 : 0));

  // expected time of each punctuated boundary if speech were spread evenly
  const W = weight.reduce((a, b) => a + b, 0);
  let acc = 0;
  const bounds = [];
  for (let i = 0; i < n - 1; i++) { acc += weight[i]; if (pauseAfter[i]) bounds.push({ i, est: (acc / W) * dur }); }
  // match silences to boundaries in order, each to the nearest remaining boundary
  const anchors = [{ i: -1, t: 0 }];
  let from = 0;
  for (const [s, e] of silences) {
    let best = -1, bd = Infinity;
    for (let k = from; k < bounds.length; k++) { const d = Math.abs(bounds[k].est - (s + e) / 2); if (d < bd) { bd = d; best = k; } }
    if (best < 0 || bd > Math.max(0.8, dur * 0.2)) continue;
    anchors.push({ i: bounds[best].i, t: s, next: e });
    from = best + 1;
  }
  anchors.push({ i: n - 1, t: dur });

  // words between two anchors share the stretch of speech between them
  const out = new Array(n);
  for (let a = 0; a < anchors.length - 1; a++) {
    const A = anchors[a], B = anchors[a + 1];
    const t0 = A.next ?? A.t, t1 = B.t;
    const ids = []; for (let i = A.i + 1; i <= B.i; i++) ids.push(i);
    const sw = ids.reduce((s, i) => s + weight[i], 0) || 1;
    let t = t0;
    for (const i of ids) { const d = ((t1 - t0) * weight[i]) / sw; out[i] = [t, t + d]; t += d; }
  }
  return out;
}

function probe(f) {
  return +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], { encoding: 'utf8' }).trim();
}
