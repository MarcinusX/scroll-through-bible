// Mt 5,17–18 — on the mountain. The Law (the two stone tablets) and the Prophets (an open scroll) come down on
// their strings above Jesus. "Do not think I came to abolish them": two dark strips cross them out — and fall
// away. "I came not to abolish but to fulfil": a thread of light runs from His hand and the tablets and the
// scroll fill with gold from the bottom up, like cups. "Till heaven and earth pass away, not one iota, not one
// stroke": a great scroll of the Law, with heaven and earth hanging beside it; a wind blows, heaven and earth
// swing and grow faint, while under a lens the smallest letter, the yod, shines and does not move.
import { C, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { makeCutter } from '../../core/paper.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { mountSet, SKY, JX, JY, JS, teach, hand, tagWord, lawScroll, yod, medallion, paintedLand, STRING, DY, PI, tr } from './lib.js';
import { sun, moon, stars } from '../../assets/nature.js';

const TAB = [610, 250], PRO = [990, 256];

/** the two tablets of the Law, cut by a fixed pair of scissors so a gold copy lines up; origin: bottom centre */
function tablets(col, lines = true) {
  const c = makeCutter('mt5-tablets');
  const w = 74, h = 112;
  const s = sheet();
  const one = (x0) => c.cut([[x0, 0], [x0, -h + w / 2], ...c.arc(x0 + w / 2, -h + w / 2, w / 2, w / 2, PI, 2 * PI, 12), [x0 + w, 0]], 0.8, 6);
  s.p(one(-w - 3) + one(3), col);
  if (lines) {
    let ln = '';
    for (let k = 0; k < 2; k++) for (let i = 0; i < 5; i++) { const x0 = k ? 14 : -w + 11, y = -h + w * 0.46 + i * 13; ln += c.ribbon([[x0, y], [x0 + w - 24 - (i % 3) * 6, y]], 2.4); }
    s.x(ln, shade(col, -0.45), 'opacity=".75"');
  }
  return s.out();
}

export default {
  id: 'mt5-law',
  beats: [
    { v: 17, text: 'Nie sądźcie, że przyszedłem znieść Prawo albo Proroków.' },
    { v: 17, cont: true, text: 'Nie przyszedłem znieść, ale wypełnić.' },
    { v: 18 },
  ],
  cam: { x: [-20, 20], y: [-40, 30], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const set = mountSet(S, { skyCols: SKY.morning, sunXY: [1320, 120] });

    const fly = S.layer({ par: 0.3, sh: 6 });
    /* the Law: two tablets on a board; the Prophets: an open scroll */
    const tabEl = fly.add(`<g><path d="M-60 -2400V-112M60 -2400V-112" stroke="${STRING}" stroke-width="1.3" fill="none"/>${tablets(mix(C.stone, C.rock, 0.45))}</g>`);
    const tabGold = fly.add(`<g><circle cy="-56" r="120" fill="url(#halo-glow)"/>${tablets(C.sun, false).replace(/<path class="grain"[^>]*>/, '')}</g>`);
    const tabGoldLines = fly.add(`<g>${tablets('#f3cf7a')}</g>`);
    const proEl = fly.add(`<g><path d="M-70 -2400V-70M70 -2400V-70" stroke="${STRING}" stroke-width="1.3" fill="none"/>${lawScroll(c, 170, 120)}</g>`);
    const proGold = fly.add(`<g><circle r="120" fill="url(#halo-glow)"/><rect x="-85" y="-60" width="170" height="120" fill="${C.sun}" opacity=".45"/></g>`);
    const labT = fly.add(`<g>${tagWord(c, tr('Prawo', 'the Law'), { size: 20, len: 30 })}</g>`);
    const labP = fly.add(`<g>${tagWord(c, tr('Prorocy', 'the Prophets'), { size: 20, len: 30 })}</g>`);
    // the dark strips that would cross them out
    const X = [0, 1].map(() => ({ a: fly.add(`<g>${sheet().p(c.ribbon([[-90, -60], [90, 60]], 14, 2), mix(C.storm2, C.ink, 0.4)).out()}</g>`), b: fly.add(`<g>${sheet().p(c.ribbon([[-90, 60], [90, -60]], 14, 2), mix(C.storm2, C.ink, 0.4)).out()}</g>`) }));

    /* v18 — heaven and earth, the great scroll, the lens and the yod */
    const heaven = fly.add(`<g>${medallion(c, S.id('heaven'), 54, `<rect x="-80" y="-80" width="160" height="160" fill="${C.indigo}"/>${stars(c, { x0: -70, x1: 70, y0: -70, y1: 70, n: 26 })}<g transform="translate(-22 -14)">${sun(c, 20)}</g><g transform="translate(28 26)">${moon(c, 15)}</g>`, { rim: C.ochre })}</g>`);
    const earth = fly.add(`<g>${medallion(c, S.id('earth'), 54, paintedLand(c, { w: 160, h: 160, skyCol: C.skyBlue, far: C.hillMid, near: C.hillNear, horizon: -4 }), { rim: C.ochre })}</g>`);
    const big = fly.add(`<g><path d="M-130 -2400V-112M130 -2400V-112" stroke="${STRING}" stroke-width="1.3" fill="none"/>${lawScroll(c, 330, 190)}</g>`);
    const wind = fly.add(`<g>${(() => { let d = ''; for (let i = 0; i < 9; i++) { const y = -140 + i * 34, x = c.rr(-300, 100); d += c.ribbon(c.qbez([x, y], [x + 120, y - 16], [x + 260, y + 4], 10), (u) => Math.sin(u * PI) * 3 + 0.4); } return `<path d="${d}" fill="#fffaf0" opacity=".8"/>`; })()}</g>`);
    const lens = fly.add(`<g>${sheet().p(c.cut(c.circ(0, 0, 58, 36), 0.4, 5), C.wood2).p(c.ribbon([[40, 40], [96, 96]], 16), C.wood).out()}<circle r="50" fill="#f8f2e2"/><circle r="50" fill="url(#halo-glow)" opacity=".5"/></g>`);
    const yodEl = fly.add(`<g><circle r="40" fill="url(#warm-glow)"/>${yod(c, 42, C.ink)}</g>`);
    const tittle = fly.add(`<g>${sheet().p(c.cut([[-3, -10], [4, -12], [3, 10], [-2, 12]], 0.2, 3), C.ink).out()}</g>`);
    const yodTag = fly.add(`<g>${tagWord(c, tr('jota', 'one iota'), { size: 16, len: 10 })}</g>`);

    const { jesus, four } = set.circle();
    const thread = set.L.add(`<g><path d="${c.ribbon([[0, 0], [1, 0]], 3)}" fill="${C.halo}"/></g>`);
    const thread2 = set.L.add(`<g><path d="${c.ribbon([[0, 0], [1, 0]], 3)}" fill="${C.halo}"/></g>`);
    set.front();

    return (t, time) => {
      const T = time;
      set.update(T);

      /* v17a — the Law and the Prophets come down; the dark strips cross them out — and fall away */
      const dk = es(t, -0.1, 0.3, ease.out) * (1 - es(t, 2.0, 2.25));
      const ty = lerp(-420, TAB[1], dk) - es(t, 2.0, 2.25) * 200, py = lerp(-420, PRO[1], dk) - es(t, 2.0, 2.25) * 200;
      const sw = (i) => Math.sin(T * 0.8 + i) * 1.2;
      const on = dk > 0.01 ? 1 : 0;
      pose(tabEl, { x: TAB[0], y: ty + 56, r: sw(0), o: on });
      pose(proEl, { x: PRO[0], y: py, r: sw(1), o: on });
      pose(labT, { x: TAB[0], y: ty + 92, r: sw(0), o: on });
      pose(labP, { x: PRO[0], y: py + 88, r: sw(1), o: on });
      const xk = es(t, 0.3, 0.44, ease.back), xfall = es(t, 0.56, 0.78, ease.in);
      X.forEach((x, i) => {
        const cx = i ? PRO[0] : TAB[0], cy = (i ? py : ty) + (i ? 0 : 0);
        pose(x.a, { x: cx - xfall * 20, y: cy + xfall * 420, s: xk, r: -xfall * 30, o: xk > 0.01 ? 1 - xfall : 0 });
        pose(x.b, { x: cx + xfall * 20, y: cy + xfall * 460, s: xk, r: xfall * 30, o: xk > 0.01 ? 1 - xfall : 0 });
      });

      /* v17b — not to abolish but to fulfil: they fill with gold */
      const th = es(t, 1.06, 1.24), fill = es(t, 1.2, 1.62);
      const [hx, hy] = hand(JX, JY, JS, false, 28 + th * 70, 0, DY.sit);
      const thO = th * (1 - es(t, 1.7, 1.95));
      [[thread, TAB[0], ty + 56], [thread2, PRO[0], py + 60]].forEach(([el, x2, y2]) => {
        const dx = x2 - hx, dy = y2 - hy, L = Math.hypot(dx, dy);
        pose(el, { x: hx, y: hy, r: (Math.atan2(dy, dx) * 180) / PI, sx: L * th, o: thO });
      });
      pose(tabGold, { x: TAB[0], y: ty + 56, sy: Math.max(0.001, fill), r: sw(0), o: fill > 0.005 ? 0.75 : 0 });
      pose(tabGoldLines, { x: TAB[0], y: ty + 56, r: sw(0), o: es(t, 1.5, 1.7) * 0.8 });
      pose(proGold, { x: PRO[0], y: py + 60, sy: Math.max(0.001, fill), oy: 60, r: sw(1), o: fill > 0.005 ? 1 : 0 });

      /* v18 — till heaven and earth pass away, not one iota */
      const bk = es(t, 2.08, 2.36, ease.out);
      const by = lerp(-500, 300, bk) + Math.sin(T * 0.8) * 2;
      pose(big, { x: 800, y: by, o: bk > 0.01 ? 1 : 0 });
      const hk = es(t, 2.12, 2.4, ease.out);
      const gust = bump(t, 2.36, 2.8);
      const fade_ = es(t, 2.4, 2.7);
      pose(heaven, { x: 556, y: lerp(-400, 300, hk), r: Math.sin(T * 0.8) * 1.5 + gust * 16 * Math.sin(T * 5 + 1), o: hk > 0.01 ? 1 - fade_ * 0.55 : 0 });
      pose(earth, { x: 1044, y: lerp(-400, 300, hk), r: Math.sin(T * 0.7 + 1) * 1.5 + gust * 16 * Math.sin(T * 5), o: hk > 0.01 ? 1 - fade_ * 0.55 : 0 });
      pose(wind, { x: lerp(300, 1100, es(t, 2.36, 2.8, (x) => x)), y: 300, o: gust });
      const lk = es(t, 2.34, 2.5);
      const lx = lerp(1000, 812, lk), ly = lerp(420, by - 4, lk);
      pose(lens, { x: lx, y: ly, o: lk > 0.01 ? 1 : 0 });
      const yk = es(t, 2.48, 2.62, ease.back);
      pose(yodEl, { x: lx - 8, y: ly - 4, s: yk, o: yk > 0.01 ? 1 : 0 });
      pose(tittle, { x: lx + 22, y: ly - 18, s: yk, r: 20, o: yk > 0.01 ? 1 : 0 });
      pose(yodTag, { x: lx, y: ly + 76, s: yk, o: yk > 0.01 ? 1 : 0 });

      /* Jesus: "do not think" (hand up), "to fulfil" (hand reaching to them), "truly I tell you" */
      const no = bump(t, 0.38, 1.0);
      teach(jesus, T, { armB: no * 110 + bump(t, 2.1, 2.9) * 90, armF: th * 70 * (1 - es(t, 1.8, 2.0)) + no * 20, head: -6 - th * 6, blink: blinkAt(T, 1) });
      four.forEach((f) => f.p.set({ x: f.x, y: f.y, s: f.s, flip: f.flip, lean: f.dir * 2, head: -10 - es(t, 1.2, 1.5) * 4, armF: 20 + bump(t, 1.3, 1.9) * 30, blink: blinkAt(T, f.seed) }));

      S.cam.y = -24 - es(t, 2.0, 2.4) * 6;
      S.cam.z = 1.02;
    };
  },
};
