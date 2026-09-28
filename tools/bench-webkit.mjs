// Scroll benchmark in WebKit — the engine of Safari on every iPhone and iPad — at phone resolution.
// It scrolls each chapter at a steady pace and reports frame times; with --vs it runs a second build
// in turn with the first (A, B, A, B …), so background load on the machine hits both alike.
// Needs Playwright:  npm i --no-save playwright && npx playwright install webkit
// Usage: node tools/bench-webkit.mjs [--url=http://localhost:5178/] [--vs=http://localhost:5179/]
//          [--dev=iphone|ipad] [--secs=14] [--rounds=2] [--reduced] mark:4 john:6 …
let webkit;
try { ({ webkit } = await import('playwright')); } catch {
  console.error('needs Playwright: npm i --no-save playwright && npx playwright install webkit');
  process.exit(1);
}

const args = process.argv.slice(2);
const opt = (k, d) => { const a = args.find((x) => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
const url = opt('url', 'http://localhost:5178/'), vs = opt('vs', '');
const secs = +opt('secs', 14), rounds = +opt('rounds', vs ? 2 : 1);
const spots = args.filter((a) => !a.startsWith('--'));
if (!spots.length) spots.push('mark:4');
const DEV = {
  iphone: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
  ipad: { viewport: { width: 820, height: 1180 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
}[opt('dev', 'iphone')];
const builds = vs ? [['A', url], ['B', vs]] : [['', url]];

// a visible window: headless WebKit doesn't composite the way Safari does
const browser = await webkit.launch({ headless: false });
const frames = Object.fromEntries(builds.map(([k]) => [k, []]));
const slow = Object.fromEntries(builds.map(([k]) => [k, {}]));
for (let r = 0; r < rounds; r++) for (const spot of spots) for (const [k, base] of builds) {
  const ctx = await browser.newContext({ ...DEV, reducedMotion: args.includes('--reduced') ? 'reduce' : 'no-preference' });
  const page = await ctx.newPage();
  const [book, ch] = spot.split(':');
  const u = new URL(base);
  u.searchParams.set('book', book); u.searchParams.set('ch', ch);
  await page.goto(u.href);
  await page.waitForFunction(() => !!window.__theatre, null, { timeout: 30000 });
  await page.waitForTimeout(1200);
  const r1 = await page.evaluate(async (secs) => {
    const th = window.__theatre, total = document.documentElement.scrollHeight - innerHeight, out = [];
    const sceneAt = (g) => (th.timeline.find((e) => g < e.end + 0.45) || th.timeline[th.timeline.length - 1]).sc.id;
    let y = 0, last = performance.now();
    const t0 = last;
    await new Promise((res) => {
      const f = (now) => {
        out.push([now - last, sceneAt(th.g)]); last = now;
        y += 40; // ~2400 px/s: a brisk, steady flick
        if (y > total || now - t0 > secs * 1000) return res();
        scrollTo(0, y);
        requestAnimationFrame(f);
      };
      requestAnimationFrame(f);
    });
    return { out: out.slice(3), errs: window.__errs };
  }, secs);
  for (const [d, sc] of r1.out) { frames[k].push(d); (slow[k][sc] ||= []).push(d); }
  if (r1.errs?.length) console.log(`${k} ${spot} page errors:`, r1.errs.join(' | '));
  await ctx.close();
}
for (const [k, base] of builds) {
  const d = frames[k].sort((a, b) => a - b), q = (p) => d[Math.min(d.length - 1, Math.floor(d.length * p))].toFixed(0);
  const worst = Object.entries(slow[k]).map(([sc, v]) => [sc, v.reduce((a, b) => a + b, 0) / v.length]).sort((a, b) => b[1] - a[1]).slice(0, 4);
  console.log(`${k ? k + ' ' : ''}${base}`);
  console.log(`  ${d.length} frames · median ${q(0.5)} ms · p95 ${q(0.95)} ms · worst ${q(1)} ms · over 25 ms ${((d.filter((x) => x > 25).length / d.length) * 100).toFixed(1)}% · mean ${(1000 / (d.reduce((a, b) => a + b, 0) / d.length)).toFixed(1)} fps`);
  console.log(`  slowest scenes (mean frame): ${worst.map(([sc, m]) => `${sc} ${m.toFixed(0)} ms`).join(', ')}`);
}
await browser.close();
