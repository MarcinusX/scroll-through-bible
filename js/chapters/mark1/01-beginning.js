// Mk 1,1–3 — the beginning: a road through the wilderness, the sun rising at its far end,
// Isaiah's scroll unrolling on its strings, the messenger clearing the way, the crooked path made straight.
import { C, person, CAST, blinkAt, pose, lerp, sky, curtains, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, rock, sun, cloud } from '../../assets/nature.js';
import { rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { JOHN_B, hang2, scrollParts, voiceRings, acacia, scrub, headAt, sparkle } from './lib.js';

const PI = Math.PI;
const HY = 470;                                   // horizon: where the road vanishes
const ry = (u) => HY + 700 * Math.pow(u, 1.8);    // road: depth u (0 far … 1 near) → y
const rw = (u) => 4 + 380 * Math.pow(u, 1.5);     // … → width
const bendX = (u) => 800 + (30 + 300 * Math.pow(u, 1.4)) * Math.sin(2.6 * PI * u);
const sAt = (y) => Math.max(0.07, (y - 450) / 272); // how big a person is, standing at y

function roadMarkup(c, xf, color, edge) {
  const L = [], R = [];
  for (let i = 0; i <= 60; i++) {
    const u = i / 60, x = xf(u), y = ry(u), w = rw(u) / 2;
    // the edge runs across the direction of travel (approximately) — fine for a gently bending road
    L.push([x - w, y]); R.push([x + w, y]);
  }
  const s = sheet();
  s.p(c.cut([...L, ...R.reverse()], 0.8, 10), color);
  let d = '';
  for (let i = 0; i < 26; i++) {
    const u = c.rr(0.08, 1), x = xf(u) + c.rr(-0.4, 0.4) * rw(u), y = ry(u);
    d += c.cut(c.ell(x, y, 2 + u * 7, 1 + u * 3, 8), 0.2, 3);
  }
  s.x(d, edge, 'opacity=".6"');
  return s.out();
}

export default {
  id: 'm1-beginning',
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2, text: 'Jak jest napisane u proroka Izajasza:' },
    { v: 2, cont: true, text: 'Oto Ja posyłam wysłańca mego przed Tobą;' },
    { v: 2, cont: true, text: 'on przygotuje drogę Twoją.' },
    { v: 3, text: 'Głos wołającego na pustyni:' },
    { v: 3, cont: true, text: 'Przygotujcie drogę Panu, Dla Niego prostujcie ścieżki!' },
  ],
  cam: { x: [-30, 30], y: [-40, 40], z: [1, 1.22] },
  build(S) {
    const c = S.c;
    const PRE = ['#a996bd', '#e2b9ae', '#f3d3b5'];
    const DAWN = ['#c9dcd8', '#f4ddbd', '#f8e6c8'];
    const sk = sky(S, PRE);

    /* ---------- sun, clouds on strings ---------- */
    const hangL = S.layer({ par: 0.03, sh: 5 });
    const glow = hangL.add(`<circle r="260" fill="url(#warm-glow)"/>`);
    const burst = hangL.add(`<g>${rays(c, { n: 20, r0: 70, r1: 900, spread: 0.05, color: '#fff1cc' })}</g>`);
    const sunEl = hanging(hangL, sun(c, 64), { x: 800, y: 420, len: 900 });
    const cl1 = hanging(hangL, cloud(c, 200, '#f6e3d2', '#e8cdb8'), { x: 470, y: 200, len: 700 });
    const cl2 = hanging(hangL, cloud(c, 150, '#f6e3d2', '#e8cdb8'), { x: 1150, y: 150, len: 700 });

    /* ---------- far mountains, the hills that are brought low ---------- */
    const far = S.layer({ par: 0.07, sh: 2 });
    far.add(band(c, { y: 448, amps: [16, 7, 3], lens: [900, 330, 120], color: mix(C.duskViolet, C.dune, 0.45) }).markup);
    const hillsL = S.layer({ par: 0.14, sh: 3, pad: 220 });
    const hs = sheet();
    hs.p(c.cut([[-900, 520], [-900, 380], [-300, 300], [120, 250], [330, 300], [520, 380], [700, 520]], 1.4, 12), mix(C.dune, C.clay, 0.25));
    hs.p(c.cut([[880, 520], [1040, 360], [1240, 270], [1420, 240], [1800, 330], [2500, 390], [2500, 520]], 1.4, 12), mix(C.dune, C.clay, 0.35));
    hs.x(c.cut([[120, 250], [200, 300], [150, 330], [60, 300], [0, 280]], 0.6, 6) + c.cut([[1420, 240], [1500, 290], [1430, 310], [1350, 270]], 0.6, 6), C.sand, 'opacity=".55"');
    hillsL.add(hs.out());

    /* ---------- desert floor & the two roads ---------- */
    const ground = S.layer({ par: 0.3, sh: 3 });
    const gs = sheet();
    gs.p(c.ridge(c.wave(HY - 2, [2, 1], [400, 120]), -900, 2500, 1700, 14, 0.6), C.sand);
    gs.p(c.ridge(c.wave(560, [14, 6], [700, 220]), -900, 2500, 1700, 14, 1), mix(C.sand, C.sand2, 0.5));
    gs.p(c.ridge(c.wave(700, [18, 8], [800, 260]), -900, 2500, 1700, 14, 1), C.sand2);
    let peb = '';
    for (let i = 0; i < 60; i++) { const y = c.rr(480, 1000), x = c.rr(-300, 1900); peb += c.cut(c.blob(x, y, 2 + (y - 470) * 0.012, 1 + (y - 470) * 0.006, 7, 0.2), 0.3, 3); }
    gs.x(peb, C.rock2, 'opacity=".55"');
    ground.add(gs.out());
    ground.add(rock(c, 360, 520, 90, 40, C.rock2) + rock(c, 1260, 530, 110, 46, C.rock) + scrub(c, 520, 500, 30) + scrub(c, 1080, 505, 34) + scrub(c, 250, 600, 50));
    ground.add(acacia(c, 1330, 560, 1.1));

    const roadBent = S.layer({ par: 0.3, sh: 2 });
    roadBent.add(roadMarkup(c, bendX, mix(C.sand, C.cream, 0.45), C.dune));
    const roadStraight = S.layer({ par: 0.3, sh: 2 });
    roadStraight.add(roadMarkup(c, () => 800, mix(C.sand, C.cream, 0.55), C.dune));
    roadStraight.fade(0);

    /* ---------- stones & a thorn on the crooked road, the people ---------- */
    const act = S.layer({ par: 0.3, sh: 4 });
    const OBST = [
      { u: 0.3, w: 34, h: 20, dx: 180, col: C.rock },
      { u: 0.4, w: 44, h: 26, dx: -210, col: C.rock2 },
      { u: 0.49, w: 58, h: 30, dx: 230, col: C.rock },
    ].map((o, i) => {
      const x = bendX(o.u), y = ry(o.u);
      o.el = act.add(`<g>${rock(c, 0, 0, o.w, o.h, o.col)}</g>`);
      o.x = x; o.y = y; o.i = i;
      return o;
    });
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const broom = sheet().p(c.ribbon([[0, -6], [2, 92]], 4), C.wood).p(c.cut([[2, 84], [-16, 128], [-4, 132], [6, 130], [18, 134], [22, 128], [8, 84]], 0.6, 5), C.olive).out();
    const msgS = S.puppet(act.add(person(c, { ...JOHN_B, holdB: `<g data-k="broom">${broom}</g>` })));
    const broomEl = S.$('broom');
    const voice = voiceRings(act, c, { n: 3, color: C.clay, r: 42, w: 6, both: false });
    const dust = [0, 1, 2, 3, 4, 5].map((i) => act.add(`<g opacity="0">${sparkle(c, 16 + (i % 3) * 5)}</g>`));
    const puffs = OBST.map(() => act.add(`<g opacity="0"><path d="${c.cut(c.blob(0, 0, 30, 12, 10, 0.3), 0.8, 5)}" fill="${C.cream}"/><path d="${c.cut(c.blob(-22, -6, 16, 9, 9, 0.3), 0.6, 4)}" fill="${C.cream}"/></g>`));

    /* ---------- Isaiah's scroll ---------- */
    const scrollL = S.layer({ par: 0.08, sh: 6 });
    const sp = scrollParts(c, { w: 330, h: 160, title: tr('Izajasz', 'Isaiah'), lines: 5 });
    const scrollEl = scrollL.add(hang2(`<g data-k="sheet">${sp.sheet}</g><g data-k="rodB">${sp.rod}</g><g>${sp.rod}</g><g data-k="mark"><path d="${c.ribbon([[-40, 0], [40, 0]], 5)}" fill="${C.sun}" opacity=".7"/></g>`, 150, 600));
    const sheetEl = S.$('sheet'), rodB = S.$('rodB'), mark = S.$('mark');

    /* ---------- foreground ---------- */
    const fg = S.layer({ par: 0.85, sh: 7 });
    fg.add(rock(c, 170, 960, 260, 110, C.rock2) + rock(c, 1450, 950, 240, 120, C.rock) + scrub(c, 320, 940, 70, C.olive) + scrub(c, 1290, 945, 60, C.moss));

    const cur = curtains(S);

    return (t, time) => {
      cur.set(es(t, 0.05, 0.85), time);

      /* the day begins */
      const rise = es(t, 0.6, 1.7);
      sk.blend(PRE, DAWN, rise);
      const sunY = lerp(560, 402, rise);
      swing(sunEl, 800, sunY, time, 0.8, 0.5);
      const light = es(t, 1.2, 1.8) + es(t, 6.1, 6.6);
      pose(glow, { x: 800, y: sunY, s: 0.6 + rise * 0.7 + es(t, 6.1, 6.6) * 0.5, o: rise * 0.9 });
      pose(burst, { x: 800, y: sunY, s: 0.5 + light * 0.35, r: t * 6, o: Math.min(1, light) * 0.3 + bump(t, 6.1, 6.9) * 0.3 });
      swing(cl1, 470 + Math.sin(time * 0.1) * 20, 200, time, 1.2, 0.6, 1);
      swing(cl2, 1150 + Math.sin(time * 0.12 + 2) * 20, 150, time, 1.2, 0.7, 2);

      /* the crooked way is made straight, the hills are brought low */
      const straight = es(t, 6.05, 6.5);
      roadStraight.fade(straight);
      roadBent.fade(1 - es(t, 6.2, 6.6));
      hillsL.shift(0, es(t, 6.1, 6.7) * 190);
      dust.forEach((d, i) => {
        const u = 0.18 + i * 0.13, k = bump(t, 6.05 + i * 0.06, 6.55 + i * 0.06);
        pose(d, { x: lerp(bendX(u), 800, straight) + (i % 2 ? 1 : -1) * rw(u) * 0.35, y: ry(u) - 10, s: k * (0.6 + u), r: time * 30 + i * 40, o: k });
      });

      /* Jesus far away at the end of the road, then coming along it */
      const come = es(t, 6.35, 6.95);
      const ju = lerp(0.07, 0.26, come) + es(t, 0.9, 1.6) * 0.012;
      const jy = ry(ju), jx = lerp(bendX(ju), 800, straight);
      jesus.set({
        x: jx, y: jy, s: 0.2 + come * 0.16, o: es(t, 0.8, 1.2),
        walk: (t > 0.8 && t < 1.6) || (come > 0 && come < 1) ? t * 30 : undefined,
        armF: bump(t, 1.5, 2.2) * 50, blink: blinkAt(time, 2),
      });

      /* the scroll comes down and unrolls */
      const down = es(t, 1.85, 2.3, ease.out), unroll = es(t, 2.2, 2.55), up = es(t, 5.75, 6.1);
      const roll = unroll * (1 - up);
      pose(scrollEl, { x: 800, y: lerp(-420, 120, down) - es(t, 5.95, 6.4, ease.in) * 560, r: Math.sin(time * 0.6) * 0.6 });
      pose(sheetEl, { sy: 0.03 + roll * 0.97 });
      pose(rodB, { y: roll * 160 });
      // a golden marker reads along the lines, beat by beat
      const lineY = [0, 0, 62, 86, 110, 134, 150];
      const bi = Math.max(2, Math.min(6, Math.floor(t)));
      pose(mark, { x: -90 + seg(t, bi + 0.05, bi + 0.6) * 150, y: lineY[bi] + 4, o: roll > 0.95 ? 0.9 : 0 });

      /* the messenger: sent ahead, clearing the way, then a voice in the wilderness */
      const arrive = es(t, 3.0, 3.55);
      const mu = 0.55, my = ry(mu);
      let mx = lerp(300, bendX(mu) - 20, arrive);
      const sweep = seg(t, 4.05, 4.85);
      const sweeping = sweep > 0 && sweep < 1;
      mx += sweep * 40;
      const cry = es(t, 5.05, 5.35) * (1 - es(t, 6.0, 6.2));
      const point = es(t, 6.2, 6.5);
      msgS.set({
        x: mx, y: my, s: sAt(my), o: seg(t, 2.95, 3.05), flip: false,
        walk: arrive > 0 && arrive < 1 ? mx * 0.05 : undefined,
        armF: 15 + bump(t, 3.5, 4.1) * 85 + cry * 55 + point * 75,
        armB: 10 + (sweeping ? 40 + Math.sin(sweep * PI * 6) * 30 : 0) + cry * 110,
        lean: sweeping ? 10 + Math.sin(sweep * PI * 6) * 4 : 0,
        head: -cry * 14 - bump(t, 3.55, 4.0) * 4, blink: blinkAt(time, 1),
      });
      fade(broomEl, 1 - es(t, 4.9, 5.05));
      const [hx, hy] = headAt(mx, my, sAt(my));
      voice(hx + 22 * sAt(my), hy + 4, cry * seg(t, 5.1, 5.3), time, { spread: 3.2, s0: 0.6, dir: 1 });

      /* stones and a thorn roll off the road as he sweeps */
      OBST.forEach((o) => {
        const k = es(t, 4.15 + o.i * 0.22, 4.5 + o.i * 0.22);
        pose(o.el, { x: o.x + k * o.dx, y: o.y - o.h * 0.45 - Math.sin(k * PI) * 18, r: k * (o.dx > 0 ? 300 : -300), ox: 0, oy: -o.h * 0.45 });
        const pk = bump(t, 4.15 + o.i * 0.22, 4.7 + o.i * 0.22);
        pose(puffs[o.i], { x: o.x + k * o.dx * 0.6, y: o.y - 6, s: 0.4 + pk, o: pk * 0.7 });
      });

      /* camera: lean in towards the far end of the road at the beginning, back for the prophecy */
      S.cam.z = 1 + es(t, 0.7, 1.6) * 0.2 - es(t, 1.8, 2.4) * 0.2 + es(t, 6.3, 7) * 0.08;
      S.cam.y = es(t, 0.7, 1.6) * 10 - es(t, 1.8, 2.4) * 30 + es(t, 6.3, 7) * 20;
    };
  },
};
