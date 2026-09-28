// Tiny animation toolkit used by scenes. Scene time `t` is measured in beats:
// t = 2.5 means "halfway through the third sentence".

import { clamp, mix } from './paper.js';

export { clamp, mix };
export const lerp = (a, b, t) => a + (b - a) * t;
/** 0→1 ramp while t goes from a to b (clamped). */
export const seg = (t, a, b) => clamp((t - a) / (b - a));
export const ease = {
  in: (x) => x * x * x,
  out: (x) => 1 - Math.pow(1 - x, 3),
  io: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
  sine: (x) => -(Math.cos(Math.PI * x) - 1) / 2,
  back: (x) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); },
  pop: (x) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.pow(2, -9 * x) * Math.cos(x * 8)),
};
/** eased ramp: es(t, a, b) = ease.io(seg(t,a,b)) */
export const es = (t, a, b, fn = ease.io) => fn(seg(t, a, b));
/** bump: 0 → 1 → 0 across [a, b] */
export const bump = (t, a, b) => Math.sin(seg(t, a, b) * Math.PI);

const cache = new WeakMap();
/**
 * hooks.write(el) is told about every real DOM change, so the engine can find the pieces that move.
 * hooks.carry(el, attr, v) sees writes to an element the engine moves on the compositor (el.__carried);
 * when it returns true the change is applied there and the element itself is left untouched.
 * While hooks.journal is an array, every write is recorded in it so rollback() can undo them all.
 */
export const hooks = { write: null, carry: null, journal: null };
function write(el, attr, v) {
  let c = cache.get(el);
  if (!c) cache.set(el, (c = {}));
  if (c[attr] === v) return;
  if (hooks.journal) hooks.journal.push([el, attr, c[attr], el.getAttribute(attr)]);
  c[attr] = v;
  if (el.__carried && hooks.carry(el, attr, v)) return;
  el.setAttribute(attr, v);
  if (hooks.write) hooks.write(el);
}
/** undo every write recorded in a journal (hooks.journal), newest first */
export function rollback(journal) {
  for (let i = journal.length - 1; i >= 0; i--) {
    const [el, attr, was, attrWas] = journal[i];
    const c = cache.get(el);
    if (was === undefined) delete c[attr]; else c[attr] = was;
    if (attrWas === null) el.removeAttribute(attr); else el.setAttribute(attr, attrWas);
  }
}
const r2 = (n) => Math.round(n * 100) / 100;

/**
 * Place an SVG element: {x, y, s, sx, sy, r, o, ox, oy}
 * (ox, oy) is the local pivot for rotation/scale.
 */
export function pose(el, { x = 0, y = 0, s = 1, sx, sy, r = 0, o, ox = 0, oy = 0 } = {}) {
  if (!el) return;
  const SX = (sx ?? 1) * s, SY = (sy ?? 1) * s;
  let tr = `translate(${r2(x)} ${r2(y)})`;
  if (r) tr += ` rotate(${r2(r)})`;
  if (SX !== 1 || SY !== 1) tr += ` scale(${r2(SX)} ${r2(SY)})`;
  if (ox || oy) tr += ` translate(${r2(-ox)} ${r2(-oy)})`;
  write(el, 'transform', tr);
  if (o !== undefined) write(el, 'opacity', r2(clamp(o)));
}
export function fade(el, o) { if (el) write(el, 'opacity', r2(clamp(o))); }
export function attr(el, name, v) { if (el) write(el, name, typeof v === 'number' ? r2(v) : v); }
export function show(el, on) { if (el) write(el, 'visibility', on ? 'visible' : 'hidden'); }
