// Records a short tour of the chapter as a GIF (for the README).
// Usage: node tools/record.mjs <url> <out.gif>   (needs ffmpeg)
import { spawn, execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const [url = 'http://localhost:5178/?lang=en', out = 'docs/demo.gif'] = process.argv.slice(2);
const W = 1280, H = 800, FPS = 12;
// [scene, from t, to t, frames] — a hard cut between segments
const TOUR = [
  ['lake', -0.02, 2.75, 44],
  ['lake', 3.0, 3.85, 14],
  ['sower', 0.25, 2.95, 40],
  ['sower', 7.35, 8.95, 24],
  ['lamp', 0.45, 1.95, 22],
  ['mustard', 3.1, 4.9, 24],
  ['storm', 2.9, 4.95, 28],
  ['storm', 6.9, 8.95, 30],
];
const frames = mkdtempSync(join(tmpdir(), 'rec-'));
const PORT = 9500 + Math.floor(Math.random() * 300);
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'rec-prof-'))}`,
  '--no-first-run', '--no-default-browser-check', `--window-size=${W},${H + 90}`, '--new-window', 'about:blank',
], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let tab;
for (let i = 0; i < 50 && !tab; i++) {
  await sleep(200);
  try { tab = (await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()).find((t) => t.type === 'page'); } catch { /* starting */ }
}
const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let id = 0;
const pending = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const evaluate = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;

await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url });
await sleep(2500);
let n = 0;
for (const [sc, a, b, count] of TOUR) {
  await evaluate(`__theatre.go('${sc}', ${a})`);
  await sleep(600); // let the set settle after the cut
  for (let i = 0; i < count; i++) {
    const t = a + ((b - a) * i) / (count - 1);
    await evaluate(`(__theatre.go('${sc}', ${t}), __theatre.step(), 1)`);
    await sleep(60);
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(join(frames, `f${String(n++).padStart(4, '0')}.png`), Buffer.from(shot.result.data, 'base64'));
  }
}
chrome.kill();
console.log(n, 'frames');
const pal = join(frames, 'palette.png');
const scale = 'scale=640:-1:flags=lanczos';
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', join(frames, 'f%04d.png'), '-vf', `${scale},palettegen=max_colors=112:stats_mode=diff`, pal]);
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', join(frames, 'f%04d.png'), '-i', pal, '-lavfi', `${scale}[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle`, '-loop', '0', out]);
console.log('wrote', out);
process.exit(0);
