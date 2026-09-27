// Shared scene helpers: sky gradients, theatre curtains, crowds, hanging ornaments.

import { sheet, shade, mix } from '../core/paper.js';
import { pose, attr, lerp, clamp } from '../core/anim.js';
import { C } from '../assets/palette.js';
import { person, crowdPerson, CAST, blinkAt } from '../assets/people.js';
import { hang } from '../assets/nature.js';

export { C, person, crowdPerson, CAST, blinkAt, pose, attr, lerp, clamp, sheet, shade, mix, hang };

/** Sky layer with an animatable 3-stop gradient. Returns { layer, set(top, mid, bottom) }. */
export function sky(S, [top, mid, bottom], o = {}) {
  const id = S.id(o.name || 'sky');
  // the gradient spans what is actually on screen (top of the box → horizon), not the whole 8000-unit sheet
  const gy0 = o.top ?? Math.min(0, S.view().y0), gy1 = o.bottom ?? 760;
  S.defs(`<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="${gy0.toFixed(0)}" x2="0" y2="${gy1}"><stop offset="0" stop-color="${top}"/><stop offset=".55" stop-color="${mid}"/><stop offset="1" stop-color="${bottom}"/></linearGradient>`);
  const L = S.layer({ par: 0, sky: true, ...o });
  L.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="url(#${id})"/><rect class="grain" x="-3000" y="-3000" width="8000" height="8000" opacity=".8"/>`);
  const stops = document.getElementById(id).querySelectorAll('stop');
  return {
    layer: L,
    set(a, b, c) { attr(stops[0], 'stop-color', a); attr(stops[1], 'stop-color', b); attr(stops[2], 'stop-color', c); },
    // blend between two palettes
    blend(p1, p2, t) { this.set(mix(p1[0], p2[0], t), mix(p1[1], p2[1], t), mix(p1[2], p2[2], t)); },
  };
}

/** Theatre curtains that open as `open` goes 0 → 1. */
export function curtains(S) {
  const c = S.c;
  const L = S.layer({ par: 0, sh: 10, rise: 0 });
  const half = (dir) => {
    const s = sheet();
    const x0 = dir < 0 ? -1400 : 770, x1 = dir < 0 ? 830 : 3000;
    s.p(c.cut([[x0, -1200], [x1, -1200], [x1, 1800], [x0, 1800]], 1, 40), C.curtain);
    let folds = '';
    for (let x = x0 + 40; x < x1; x += 70) folds += c.ribbon([[x, -1200], [x + c.rr(-6, 6), 1800]], c.rr(10, 22));
    s.x(folds, C.curtain2, 'opacity=".45"');
    s.p(c.cut([[dir < 0 ? x1 - 34 : x0, -1200], [dir < 0 ? x1 : x0 + 34, -1200], [dir < 0 ? x1 : x0 + 34, 1800], [dir < 0 ? x1 - 34 : x0, 1800]], 1, 30), shade(C.curtain, 0.18));
    return `<g data-k="curtain${dir}">${s.out()}</g>`;
  };
  L.add(half(-1) + half(1));
  // valance with scallops
  const v = sheet();
  const vy = S.view().y0 + 70;
  const pts = [[-1400, -1200], [3000, -1200], [3000, vy]];
  for (let x = 3000; x > -1400; x -= 80) pts.push(...c.arc(x - 40, vy, 40, 26, 0, Math.PI, 6));
  v.p(c.cut(pts, 0.6, 12), C.curtain2);
  let tassels = '';
  for (let x = -1360; x < 3000; x += 80) tassels += c.cut(c.circ(x, vy + 38, 5, 8), 0.2, 3);
  v.x(tassels, C.ochre);
  const val = L.add(`<g data-k="valance">${v.out()}</g>`);
  const left = S.$('curtain-1'), right = S.$('curtain1');
  return {
    layer: L,
    set(open, time = 0) {
      const e = open * open * (3 - 2 * open);
      pose(left, { x: -e * 1500 });
      pose(right, { x: e * 1500 });
      pose(val, { y: -e * 400 });
    },
  };
}

/**
 * A crowd of puppets. Each member: { p, x, y, s, flip, ph, from, delay }.
 * rows: [{ y, s, n, x0, x1 }]
 */
export function crowd(S, L, rows, extra = {}) {
  const c = S.c;
  const out = [];
  const all = [];
  rows.forEach((row) => {
    for (let i = 0; i < row.n; i++) {
      const x = lerp(row.x0, row.x1, (i + c.rr(0.15, 0.85)) / row.n);
      all.push({ x, y: row.y + c.rr(-4, 4), s: row.s * c.rr(0.9, 1.08), opts: crowdPerson(c, { pose: row.pose || 'stand', ...extra }) });
    }
  });
  all.sort((a, b) => a.y - b.y);
  all.forEach((m, i) => {
    const el = L.add(person(c, m.opts));
    out.push({ ...m, p: S.puppet(el), flip: m.x > 800, ph: c.rr(0, 6.28), delay: c.rr(0, 1), i, seed: c.rr(0, 9) });
  });
  return out;
}

/** hang an ornament from the top of the box; returns the <g class="hang"> */
export function hanging(L, inner, { x, y, len = 400, k }) {
  const el = L.add(`<g${k ? ` data-k="${k}"` : ''} transform="translate(${x} ${y})">${hang(inner, len)}</g>`);
  return el;
}
/** gentle pendulum for hanging ornaments */
export function swing(el, x, y, time, amp = 1.4, speed = 0.8, seed = 0) {
  pose(el, { x, y, r: Math.sin(time * speed + seed) * amp, oy: 0 });
}

/** a flock of birds crossing the sky; returns updater(time, o) */
export function flock(S, L, n, birdFn, { y = 200, spread = 120, speed = 60, x0 = -300, x1 = 1900, scale = 0.7 } = {}) {
  const c = S.c;
  const birds = [];
  for (let i = 0; i < n; i++) {
    const el = L.add(birdFn(c));
    birds.push({ el, wF: el.querySelector('.wingF'), wB: el.querySelector('.wingB'), off: c.rr(0, 1), dy: c.rr(-spread, spread) * 0.5, s: scale * c.rr(0.7, 1.1), ph: c.rr(0, 6) });
  }
  return (time, o = 1) => {
    birds.forEach((b) => {
      const span = x1 - x0;
      const x = x0 + (((time * speed) / span + b.off) % 1) * span;
      pose(b.el, { x, y: y + b.dy + Math.sin(time * 1.3 + b.ph) * 8, s: b.s, o });
      const f = Math.sin(time * 9 + b.ph) * 26;
      pose(b.wF, { x: -2, y: -5, r: f });
      pose(b.wB, { x: -2, y: -6, r: f * 0.8 });
    });
  };
}

/** flap a single bird's wings */
export function flap(el, time, amp = 28, speed = 10) {
  const f = Math.sin(time * speed) * amp;
  pose(el.querySelector('.wingF'), { x: -2, y: -5, r: f });
  pose(el.querySelector('.wingB'), { x: -2, y: -6, r: f * 0.8 });
}

export const wobble = (time, seed = 0, amt = 1) => Math.sin(time * 1.7 + seed) * amt;
