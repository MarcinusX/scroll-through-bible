// Frame-time benchmark in a dedicated Chrome window (so nothing else steals the foreground).
// Usage: node tools/bench.mjs [url] [sceneId:t ...]
//   node tools/bench.mjs http://localhost:5178/ lake:3.6 sower:1.5 sower:8.7
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const url = process.argv[2] || 'http://localhost:5178/';
const spots = process.argv.slice(3).length ? process.argv.slice(3) : ['lake:0.5', 'lake:3.6'];
const PORT = 9333 + Math.floor(Math.random() * 400);
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'bench-'))}`,
  '--no-first-run', '--no-default-browser-check', '--window-size=1600,1000', '--new-window', 'about:blank',
], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let tab;
for (let i = 0; i < 50 && !tab; i++) {
  await sleep(200);
  try { tab = (await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()).find((t) => t.type === 'page'); } catch { /* not up yet */ }
}
const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let id = 0;
const pending = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const evaluate = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;

await send('Page.enable');
await send('Page.navigate', { url });
await sleep(2500);
const MEASURE = `(async (ms) => { const ts = []; await new Promise(res => { const st = performance.now(); const f = (n) => { ts.push(n); if (n - st < ms) requestAnimationFrame(f); else res(); }; requestAnimationFrame(f); }); const d = ts.slice(1).map((t, i) => t - ts[i]).sort((a,b)=>a-b); return { fps: +(1000 / d[d.length>>1]).toFixed(0), p95ms: +d[Math.floor(d.length*.95)].toFixed(1), worst: +d[d.length-1].toFixed(1), dpr: devicePixelRatio }; })`;
for (const spot of spots) {
  const [sc, t] = spot.split(':');
  await evaluate(`__theatre.go('${sc}', ${t})`);
  await sleep(700);
  const idle = await evaluate(`${MEASURE}(1500)`);
  console.log(`${spot.padEnd(14)} idle   `, JSON.stringify(idle));
}
// a continuous scroll through the whole thing
await evaluate('scrollTo(0,0)');
await sleep(500);
const scroll = await evaluate(`(async () => { const total = document.body.scrollHeight - innerHeight; const run = (async () => { for (let y = 0; y < total; y += 14) { scrollTo(0, y); await new Promise(r => requestAnimationFrame(r)); } })(); const m = await ${MEASURE}(8000); return { ...m, errs: window.__errs }; })()`);
console.log('scroll-through  ', JSON.stringify(scroll));
chrome.kill();
process.exit(0);
