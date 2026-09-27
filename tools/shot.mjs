// Screenshots of chosen scene moments in a dedicated Chrome window.
// Usage: node tools/shot.mjs <outDir> <url> scene:t [scene:t ...] [--size=1440x900]
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const args = process.argv.slice(2);
const size = (args.find((a) => a.startsWith('--size=')) || '--size=1440x900').slice(7).split('x').map(Number);
const [outDir, url, ...spots] = args.filter((a) => !a.startsWith('--'));
mkdirSync(outDir, { recursive: true });
// port 0: Chrome picks a free port and writes it to DevToolsActivePort (no clashes between parallel runs)
const PROFILE = mkdtempSync(join(tmpdir(), 'chrome-'));
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--remote-debugging-port=0', `--user-data-dir=${PROFILE}`,
  '--no-first-run', '--no-default-browser-check', `--window-size=${size[0]},${size[1] + 90}`, '--new-window', 'about:blank',
], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let tab;
for (let i = 0; i < 50 && !tab; i++) {
  await sleep(200);
  try { const port = readFileSync(join(PROFILE, 'DevToolsActivePort'), 'utf8').split('\n')[0]; tab = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page'); } catch { /* starting */ }
}
const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let id = 0;
const pending = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const evaluate = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;

await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: size[0], height: size[1], deviceScaleFactor: 1, mobile: size[0] < 700 });
await send('Page.navigate', { url });
await sleep(2200);
let n = 0;
for (const spot of spots) {
  // js=<expression>@<ms> runs code in the page and shoots <ms> later (e.g. mid page-turn)
  if (spot.startsWith('js=')) {
    const [expr, ms] = spot.slice(3).split('@');
    await evaluate(expr);
    await sleep(+ms || 300);
    const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 82 });
    const file = join(outDir, `js-${++n}.jpg`);
    writeFileSync(file, Buffer.from(shot.result.data, 'base64'));
    console.log(file);
    continue;
  }
  const [sc, t] = spot.split(':');
  await evaluate(`__theatre.go('${sc}', ${t})`);
  await sleep(900);
  const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 82 });
  const file = join(outDir, `${sc}-${t}.jpg`);
  writeFileSync(file, Buffer.from(shot.result.data, 'base64'));
  console.log(file);
}
const errs = await evaluate('window.__errs');
if (errs && errs.length) console.log('ERRORS:', errs);
chrome.kill();
process.exit(0);
