// Swipes through a chapter the way a phone reader does (swipe mode: one swipe, one sentence) and checks
// every landing: the reader is at the right stop, the sentence is fully written, the page never scrolled,
// no script errors. Saves a picture of every landing (and contact sheets), optional in-between frames,
// a real-time video, and report.json. Headless; Chromium gets real touch input through the DevTools
// protocol, WebKit (Safari's engine) gets touch events dispatched in the page.
// Needs Playwright:  npm i --no-save playwright && npx playwright install webkit chromium
// Usage: node tools/swipe.mjs <url> <outDir> [--engine=chromium|webkit] [--size=390x844] [--max=N]
//          [--mid=3] [--video] [--back=4] [--next]
//   --mid=N   N frames between each pair of landings (drawn by seeking, so they are exact)
//   --video   a real-time recording of the whole run (video.mp4)
//   --back=N  after the forward run, swipe back N times and check those landings too
//   --next    finally swipe on past the closing card and check that the next chapter opens on its first sentence
import { mkdirSync, writeFileSync, readdirSync, renameSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

let pw;
try { pw = await import('playwright'); } catch {
  console.error('needs Playwright: npm i --no-save playwright && npx playwright install webkit chromium');
  process.exit(1);
}
const args = process.argv.slice(2);
const opt = (k, d) => { const a = args.find((x) => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
const [url0, out] = args.filter((a) => !a.startsWith('--'));
const engine = opt('engine', 'chromium');
const [W, H] = opt('size', '390x844').split('x').map(Number);
const max = +opt('max', 1e9), mid = +opt('mid', 0), back = +opt('back', 0);
const video = args.includes('--video'), next = args.includes('--next');
mkdirSync(out, { recursive: true });
const url = url0 + (url0.includes('swipe=') ? '' : (url0.includes('?') ? '&' : '?') + 'swipe=1');

const browser = await pw[engine].launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: W, height: H }, deviceScaleFactor: 2, isMobile: engine !== 'webkit' || true, hasTouch: true,
  ...(video ? { recordVideo: { dir: join(out, 'video-raw'), size: { width: W, height: H } } } : {}),
});
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
const cdp = engine === 'chromium' ? await ctx.newCDPSession(page) : null;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function open(u) {
  await page.goto(u);
  await page.waitForFunction(() => window.__theatre && document.documentElement.classList.contains('ready'), null, { timeout: 30000 });
  await sleep(900);
}
async function settle() {
  await page.waitForFunction(() => !window.__theatre.moving, null, { timeout: 10000 });
  await sleep(250);
}
// a finger drag from y0 to y1 over ms milliseconds, in steps
async function drag(y0, y1, ms = 140, x = W * 0.5) {
  const n = 8;
  if (cdp) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y: y0 }] });
    for (let i = 1; i <= n; i++) { await sleep(ms / n); await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y0 + ((y1 - y0) * i) / n }] }); }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    return;
  }
  await page.evaluate(async ({ x, y0, y1, ms, n }) => {
    const el = document.elementFromPoint(x, y0) || document.body;
    const fire = (type, y) => {
      const t = { identifier: 1, target: el, clientX: x, clientY: y, pageX: x, pageY: y, screenX: x, screenY: y };
      const ev = new Event(type, { bubbles: true, cancelable: true });
      const list = type === 'touchend' ? [] : [t];
      Object.defineProperty(ev, 'touches', { value: list });
      Object.defineProperty(ev, 'changedTouches', { value: [t] });
      el.dispatchEvent(ev);
    };
    fire('touchstart', y0);
    for (let i = 1; i <= n; i++) { await new Promise((r) => setTimeout(r, ms / n)); fire('touchmove', y0 + ((y1 - y0) * i) / n); }
    fire('touchend', y1);
  }, { x, y0, y1, ms, n });
}
const swipeUp = () => drag(H * 0.72, H * 0.38);
const swipeDown = () => drag(H * 0.38, H * 0.72);

// where the reader stands: scene, scene time, the caption as shown
const state = () => page.evaluate(() => {
  const T = window.__theatre, g = T.g;
  let scene = null, t = null;
  for (const e of T.timeline) {
    if (g >= e.start - 1e-6 && g <= e.end + 1e-6) {
      scene = e.sc.id;
      for (let i = 0; i < e.beats.length; i++) { const b = e.beats[i]; if (g < b.start + b.len + 1e-6) { t = i + (g - b.start) / b.len; break; } }
      break;
    }
  }
  const words = [...document.querySelectorAll('#cap-text .w')];
  const cap = document.getElementById('caption');
  return {
    g, scene, t, scrollY: window.scrollY, url: location.search,
    capOn: !cap.classList.contains('off'), capRef: document.getElementById('cap-ref').textContent,
    capFull: words.length ? words.every((w) => parseFloat(w.style.opacity || '1') > 0.995) : null,
    capText: document.getElementById('cap-text').textContent.trim().slice(0, 90),
    end: document.getElementById('end').classList.contains('on'),
    errs: window.__errs.slice(),
  };
});
const close = (a, b) => Math.abs(a - b) < 0.003;

await open(url);
const stops = await page.evaluate(() => window.__theatre.stops);
const report = { url, engine, size: `${W}x${H}`, stops: stops.length, landings: [], problems: [] };
const problem = (msg) => { report.problems.push(msg); console.log('PROBLEM', msg); };

// the title card first (a chapter opened by its link starts there)
let s = await state();
if (!close(s.g, stops[0])) problem(`start: g ${s.g} is not the first stop ${stops[0]}`);
await page.screenshot({ path: join(out, '000-land.jpg'), quality: 80, type: 'jpeg' });
report.landings.push({ i: 0, ...s });
const count = Math.min(stops.length - 1, max);
for (let i = 1; i <= count; i++) {
  if (mid) {
    for (let k = 1; k <= mid; k++) {
      const p = stops[i - 1] + ((stops[i] - stops[i - 1]) * k) / (mid + 1);
      await page.evaluate((p) => window.__theatre.seek(p), p);
      await sleep(120);
      await page.screenshot({ path: join(out, `${String(i).padStart(3, '0')}-mid${k}.jpg`), quality: 70, type: 'jpeg' });
    }
    await page.evaluate((p) => window.__theatre.seek(p), stops[i - 1]);
    await sleep(80);
  }
  await swipeUp();
  await settle();
  s = await state();
  const name = `${String(i).padStart(3, '0')}-land.jpg`;
  await page.screenshot({ path: join(out, name), quality: 80, type: 'jpeg' });
  report.landings.push({ i, ...s });
  const last = i === stops.length - 1;
  if (!close(s.g, stops[i])) problem(`swipe ${i}: landed at g ${s.g.toFixed(3)} instead of stop ${stops[i].toFixed(3)} (${s.scene}:${s.t?.toFixed(2)})`);
  if (s.scrollY !== 0) problem(`swipe ${i}: the page scrolled (scrollY ${s.scrollY})`);
  if (!last && s.capOn && s.capFull === false) problem(`swipe ${i}: caption not fully written at ${s.scene}:${s.t?.toFixed(2)} (${s.capRef})`);
  if (!last && s.t != null && Math.abs((s.t % 1) - 0.75) > 0.01) problem(`swipe ${i}: landed at ${s.scene}:${s.t.toFixed(3)}, not at x.75`);
  if (last && !s.end) problem(`swipe ${i}: the last stop does not show the closing card`);
  if (!last && s.end) problem(`swipe ${i}: closing card shows already at ${s.scene}:${s.t?.toFixed(2)}`);
  process.stdout.write(`\r${i}/${count} ${s.scene}:${s.t?.toFixed(2)}        `);
}
console.log('');

if (back) {
  let i = report.landings[report.landings.length - 1].i;
  for (let k = 0; k < back && i > 0; k++) {
    await swipeDown();
    await settle();
    i--;
    s = await state();
    if (!close(s.g, stops[i])) problem(`back ${k + 1}: landed at g ${s.g.toFixed(3)} instead of stop ${stops[i].toFixed(3)}`);
    await page.screenshot({ path: join(out, `back-${String(i).padStart(3, '0')}.jpg`), quality: 75, type: 'jpeg' });
  }
  // and forward again to where we were
  for (let k = 0; k < back; k++) { await swipeUp(); await settle(); }
}

// a too-short drag springs back; a tap on the middle does nothing
{
  const before = (await state()).g;
  await drag(H * 0.6, H * 0.56, 300);
  await settle();
  const after = (await state()).g;
  if (!close(before, after)) problem(`a short slow drag moved the reader from ${before.toFixed(3)} to ${after.toFixed(3)}`);
}

if (next && count === stops.length - 1) {
  const from = (await state()).url;
  await swipeUp();
  try {
    await page.waitForURL((u) => u.search !== from, { timeout: 8000 });
    await page.waitForFunction(() => window.__theatre && document.documentElement.classList.contains('ready'), null, { timeout: 30000 });
    await sleep(2600); // the curtain parts and the first sentence glides in
    await settle();
    s = await state();
    const st = await page.evaluate(() => window.__theatre.stops);
    await page.screenshot({ path: join(out, 'next-chapter.jpg'), quality: 80, type: 'jpeg' });
    report.next = s;
    if (!close(s.g, st[1])) problem(`next chapter opened at g ${s.g.toFixed(3)}, not its first sentence ${st[1].toFixed(3)}`);
  } catch (e) { problem(`swiping past the closing card did not open the next chapter (${e.message.split('\n')[0]})`); }
}

report.errors = [...new Set([...errors, ...(s.errs || [])])];
if (report.errors.length) problem(`script errors: ${report.errors.join(' | ')}`);
writeFileSync(join(out, 'report.json'), JSON.stringify(report, null, 1));
await ctx.close();
await browser.close();

if (video) {
  const dir = join(out, 'video-raw'), f = readdirSync(dir).find((x) => x.endsWith('.webm'));
  if (f) {
    try { execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', join(dir, f), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '26', join(out, 'video.mp4')]); }
    catch { renameSync(join(dir, f), join(out, 'video.webm')); }
  }
}
// contact sheets: landings 4 x 2 per sheet (tall tiles), labelled with scene and time
execFileSync('python3', ['-c', `
import sys, json, glob, os
from PIL import Image, ImageDraw
O = sys.argv[1]; R = json.load(open(O + '/report.json'))
lab = {l['i']: f"{l['i']:03d} {l['scene']}:{(l['t'] or 0):.2f}" for l in R['landings']}
files = sorted(glob.glob(O + '/*-land.jpg'))
tw, th, cols, per = 300, 650, 4, 8
for k in range(0, len(files), per):
    chunk = files[k:k + per]; rows = (len(chunk) + cols - 1) // cols
    sheet = Image.new('RGB', (tw * cols, th * rows), 'white'); d = ImageDraw.Draw(sheet)
    for i, f in enumerate(chunk):
        sheet.paste(Image.open(f).resize((tw, th)), ((i % cols) * tw, (i // cols) * th))
        n = int(os.path.basename(f)[:3]); d.rectangle(((i % cols) * tw, (i // cols) * th, (i % cols) * tw + tw, (i // cols) * th + 16), fill='white')
        d.text(((i % cols) * tw + 4, (i // cols) * th + 2), lab.get(n, str(n)), fill='red')
    sheet.save(f'{O}/sheet-{k // per:02d}.jpg', quality=78)
`, out]);
console.log(`${report.landings.length} landings, ${report.problems.length} problems → ${out}/report.json`);
process.exit(report.problems.length ? 2 : 0);
