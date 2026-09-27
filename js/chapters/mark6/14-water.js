// Mk 6,48–52 — night, the wind against them, the disciples straining at the oars; in the fourth watch Jesus
// comes walking on the water as if to pass them by. "A ghost!" — "Cheer up! It is I." He steps in, the wind drops.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, waveStrip, stars, moon } from '../../assets/nature.js';
import { boat, rays, paperLabel } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { kf, moving, headAt, hand, speech, thought, GLYPH, heart, loaf, oar, labelTag } from './lib.js';

const PI = Math.PI;
const BX = 640, BY = 704;
const JY = 716;

function ghost(c) {
  const s = sheet();
  const pts = [...c.arc(0, -8, 14, 16, PI, 2 * PI, 10)];
  for (let x = 14; x > -14; x -= 7) pts.push(...c.arc(x - 3.5, 10, 3.5, 4, 0, PI, 3));
  s.p(c.cut(pts, 0.3, 3), '#f4f2ea');
  s.x(c.poly(c.ell(-5, -8, 2.2, 3.2, 8)) + c.poly(c.ell(5, -8, 2.2, 3.2, 8)) + c.poly(c.ell(0, 0, 3, 3.6, 8)), C.ink);
  return s.out();
}
function windLines(c, { x0 = -1400, x1 = 3000, y0 = -200, y1 = 1100, n = 70 } = {}) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const x = c.rr(x0, x1), y = c.rr(y0, y1), l = c.rr(60, 160);
    d += c.ribbon(c.qbez([x, y], [x + l / 2, y - c.rr(4, 10)], [x + l, y], 8), (u) => Math.sin(u * PI) * 4 + 0.5);
  }
  return `<path d="${d}" fill="#e8eef6" opacity=".7"/>`;
}

export default {
  id: 'm6-water',
  beats: [
    { v: 48, text: 'Widząc, jak się trudzili przy wiosłowaniu, bo wiatr był im przeciwny,' },
    { v: 48, cont: true, text: 'około czwartej straży nocnej przyszedł do nich, krocząc po jeziorze, i chciał ich minąć.' },
    { v: 49 },
    { v: 50, text: 'Widzieli Go bowiem wszyscy i zatrwożyli się.' },
    { v: 50, cont: true, text: 'Lecz On zaraz przemówił do nich: «Odwagi, Ja jestem, nie bójcie się!».' },
    { v: 51 },
    { v: 52 },
  ],
  cam: { x: [-40, 80], y: [-20, 60], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    sky(S, ['#141a3d', '#26306a', '#4b5791'], { name: 'night' });
    const dawn = sky(S, ['#6d6f9e', '#d7a3a0', '#f2c9a4'], { name: 'dawn' }).layer;
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -800, x1: 2400, y0: -400, y1: 430, n: 150 }));
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const moonEl = hanging(hangL, `<circle r="120" fill="url(#halo-glow)" opacity=".5"/>${moon(c, 40)}`, { x: 0, y: 0, len: 900 });
    const watch = hanging(hangL, `<g transform="scale(1.1)">${labelTag(tr('czwarta straż nocy', 'the fourth watch'), 20)}</g>`, { x: 0, y: 0, len: 700 });
    const clouds = [[420, 120, 360], [1100, 90, 420], [780, 170, 300]].map(([x, y, w], i) => ({ x, y, i, el: hanging(hangL, sheet().p(c.cut(c.blob(0, 0, w / 2, w * 0.13, 14, 0.2), 1.2, 8), i % 2 ? '#3d4670' : '#4a5380').out(), { x, y, len: 900 }) }));

    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 450, amps: [14, 7, 3], lens: [1100, 380, 140], color: '#3a4270' }).markup);
    const mtn = S.layer({ par: 0.12, sh: 2 });
    mtn.add(sheet().p(c.cut([[1150, 480], [1300, 380], [1350, 372], [1500, 470], [1700, 480], [1700, 700], [1150, 700]], 1.2, 10), '#434b78').out());
    const jFar = S.puppet(mtn.add(person(c, { ...CAST.jesus })));
    const water = S.layer({ par: 0.3, sh: 2 });
    water.add(band(c, { y: 480, amps: [3, 1.5], lens: [300, 90], color: '#4f6f8f', x0: -1400, x1: 3200, step: 10, j: 0.6 }).markup);
    const moonPath = water.add(`<g>${Array.from({ length: 12 }, (_, i) => `<path d="${c.cut([[-40, 0], [0, -2.4], [40, 0], [0, 1.8]], 0.2, 8)}" fill="#f5ecd6" transform="translate(${c.rr(-20, 20)} ${i * 22}) scale(${1 - i * 0.05} 1)"/>`).join('')}</g>`);
    const wBack = S.layer({ par: 0.5, sh: 4, pad: 260 });
    wBack.add(waveStrip(c, { y: 640, len: 190, amp: 26, color: C.waveStorm, x0: -1400, x1: 3000 }));

    /* ---------- the boat, the oars, the disciples; Jesus on the water ---------- */
    const boatL = S.layer({ par: 0.6, sh: 5 });
    const B = boat(c, {});
    const DIS = [{ o: CAST.andrew, x: -110 }, { o: CAST.john, x: -50 }, { o: CAST.peter, x: 20 }, { o: CAST.james, x: 80 }, { o: CAST.thomas, x: 140 }];
    const glow = boatL.add(`<g>${rays(c, { n: 16, r0: 30, r1: 520, spread: 0.05, color: '#fff3cf' })}<circle r="140" fill="url(#halo-glow)"/></g>`);
    const boatG = boatL.add(`<g><g>${B.back}</g><g data-k="oarB">${oar(c, 180)}</g>${DIS.map((d, i) => `<g data-k="w${i}">${person(c, d.o)}</g>`).join('')}<g data-k="jin">${person(c, { ...CAST.jesus })}</g><g>${B.front}</g><g data-k="oarF">${oar(c, 180)}</g></g>`);
    const dis = DIS.map((d, i) => ({ ...d, i, p: S.puppet(S.$('w' + i).firstElementChild), seed: c.rr(0, 6) }));
    const jIn = S.puppet(S.$('jin').firstElementChild);
    const oarB = S.$('oarB'), oarF = S.$('oarF');
    const jesus = S.puppet(boatL.add(person(c, { ...CAST.jesus })));
    const ripples = [0, 1, 2].map(() => boatL.add(`<path d="${c.ribbon(c.arc(0, 0, 30, 6, 0, PI * 2, 20), 2)}" fill="${C.foam}" opacity=".8"/>`));

    /* ---------- bubbles ---------- */
    const fx = S.layer({ par: 0.62, sh: 4 });
    const ghosts = [0, 1, 2].map((i) => fx.add(`<g>${speech(c, `<g transform="scale(1.1)">${ghost(c)}</g>`, { w: 50, h: 52, flip: false })}</g>`));
    const cries = [0, 1].map(() => fx.add(`<g>${speech(c, GLYPH.bang(c), { w: 38, h: 40 })}</g>`));
    const courage = fx.add(`<g>${speech(c, `<g transform="scale(.9)">${heart(c, 14)}</g>`, { w: 56, h: 50, flip: true })}</g>`);
    const puzzled = [0, 1, 2].map(() => fx.add(`<g>${thought(c, `<g transform="translate(-6 8)">${loaf(c, 12)}</g><g transform="translate(14 -2) scale(.7)">${GLYPH.q(c)}</g>`, { w: 60, h: 48 })}</g>`));
    const stoneHearts = [0, 1].map(() => fx.add(`<g>${heart(c, 11, C.rock2)}</g>`));

    const wFront = S.layer({ par: 0.8, sh: 6, pad: 300 });
    wFront.add(waveStrip(c, { y: 800, len: 260, amp: 36, color: C.waveStorm2, x0: -1400, x1: 3000 }));
    const windL = S.layer({ par: 0.85, sh: 1, flat: true, pad: 400 });
    windL.add(windLines(c));
    const tint = S.layer({ par: 0, sh: 1, flat: true });
    tint.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#141a40"/>`);

    return (t, time) => {
      const T = time;
      const calm = es(t, 5.05, 5.5);
      const wind = 1 - calm;
      const dawnK = es(t, 5.4, 6.8);
      dawn.fade(dawnK);
      starL.fade(1 - dawnK * 0.9);
      tint.fade(0.22 * (1 - dawnK) + 0.04);
      swing(moonEl, 1010 - es(t, 0.9, 1.5) * 120, 150 + es(t, 0.9, 1.5) * 90 + dawnK * 300, T, 0.8, 0.5);
      fade(moonPath, 1 - dawnK);
      pose(moonPath, { x: 900 + S.cam.x * 0.3, y: 492 });
      const wk = es(t, 1.05, 1.35, ease.back) * (1 - es(t, 1.9, 2.1));
      pose(watch, { x: 820, y: lerp(-400, 300, wk), r: Math.sin(T * 1.2) * 2.5, o: wk > 0.01 ? 1 : 0 });
      clouds.forEach((cl) => swing(cl.el, cl.x - ((T * 30 * wind) % 200) * 0 + Math.sin(T * 0.4 + cl.i) * 40 * wind, cl.y - calm * 300, T, 1.4 * wind + 0.2, 0.9, cl.i));

      /* waves and wind */
      const sp = 0.25 + wind;
      wBack.shift(-((T * 70 * sp) % 190) + 95, calm * 40 - Math.sin(T * 1.3) * 8 * wind);
      wFront.shift(-((T * 110 * sp) % 260) + 130, calm * 50 - Math.sin(T * 1.7 + 1) * 12 * wind);
      windL.shift(-((T * 700) % 800) + 400, 0);
      windL.fade(wind * 0.9);

      /* v48a — straining at the oars; he sees them from the mountain */
      const rock_ = wind * (Math.sin(T * 1.6) * 5 + Math.sin(T * 0.8) * 3);
      const heave = wind * Math.sin(T * 1.2) * 10;
      pose(boatG, { x: BX, y: BY + heave, s: 1.0, r: rock_ });
      const row = (1 - es(t, 5.1, 5.4));
      const stroke = Math.sin(T * 2.6) * row;
      pose(oarB, { x: -40, y: -60, r: 50 + stroke * 22 });
      pose(oarF, { x: 70, y: -54, r: 50 + stroke * 22 });
      jFar.set({ x: 1330, y: 378, s: 0.24, flip: true, o: 1 - es(t, 0.9, 1.1), armF: 40, blink: 0 });

      const see = es(t, 2.05, 2.25);
      const fear = es(t, 2.1, 2.3) * (1 - es(t, 4.1, 4.5));
      const awe = es(t, 6.05, 6.3);
      dis.forEach((d) => {
        const shake = fear * Math.sin(T * 22 + d.i * 2) * 4;
        d.p.set({
          x: d.x, y: 4, s: 0.95, flip: (see > 0.5 && d.i !== 2) || awe > 0.5 ? d.i % 2 === 0 : false,
          armF: 40 + stroke * 30 * (1 - fear) + fear * (d.i % 2 ? 100 : 60) + awe * (d.i % 2 ? 60 : 20), armB: 20 + stroke * 20 * (1 - fear) + fear * (d.i % 2 ? 60 : 150) + awe * (d.i % 2 ? 0 : 80),
          lean: -stroke * 8 * (1 - fear) + shake, head: -fear * 6 + shake * 0.6 + awe * (d.i % 2 ? 8 : -6), blink: blinkAt(T, d.seed),
        });
      });

      /* v48b — in the fourth watch he comes walking on the water, as if to pass them by */
      const jKeys = [[1.15, 1500], [2.0, 900], [2.2, 880], [4.9, 880], [5.1, BX + 60]];
      const jx = kf(t, jKeys, (u) => u);
      const inBoat = es(t, 5.08, 5.14);
      const speak = bump(t, 4.05, 5.0);
      const turned = t > 3.95;
      jesus.set({ x: jx, y: JY - bump(t, 4.95, 5.12) * 20, s: 1.0, flip: !turned || t > 4.9 ? true : true, o: es(t, 1.1, 1.2) * (1 - inBoat), walk: moving(t, jKeys) ? jx * 0.05 : undefined, armF: 20 + speak * 80, armB: 10 + speak * 130, head: speak * -4, blink: blinkAt(T) });
      ripples.forEach((r, i) => {
        const k = ((T * 0.6 + i / 3) % 1);
        pose(r, { x: jx, y: JY + 2, s: 0.4 + k * 1.2, sy: 0.9, o: (1 - k) * es(t, 1.1, 1.2) * (1 - inBoat) });
      });
      jIn.set({ x: 188, y: -8, s: 0.98, flip: true, o: inBoat, armF: 30 + bump(t, 5.2, 5.9) * 70, armB: bump(t, 5.2, 5.9) * 120, blink: blinkAt(T, 4) });
      pose(glow, { x: lerp(jx, BX + 188, inBoat), y: JY - 130, s: 0.3 + speak * 0.8 + bump(t, 5.1, 5.9) * 0.6, r: T * 5, o: (speak + bump(t, 5.1, 5.9)) * 0.32 });

      /* v49 — "a ghost!" and they cry out */
      ghosts.forEach((g, i) => {
        const d = dis[[1, 3, 4][i]];
        const k = es(t, 2.1 + i * 0.08, 2.3 + i * 0.08, ease.back) * (1 - es(t, 2.95, 3.1));
        const [hx, hy] = headAt(BX + d.x, BY + 4 + heave, 0.95, false);
        pose(g, { x: hx + 12, y: hy - 22, s: k, r: Math.sin(T * 3 + i) * 6, o: k > 0.01 ? 1 : 0 });
      });
      cries.forEach((cr, i) => {
        const d = dis[[0, 2][i]];
        const k = es(t, 2.4 + i * 0.1, 2.55 + i * 0.1, ease.back) * (1 - es(t, 3.9, 4.05));
        const [hx, hy] = headAt(BX + d.x, BY + 4 + heave, 0.95, false);
        pose(cr, { x: hx + 12, y: hy - 22, s: k * (1 + Math.sin(T * 12) * 0.05), o: k > 0.01 ? 1 : 0 });
      });
      /* v50b — "Cheer up! It is I! Don't be afraid." */
      const ck = es(t, 4.1, 4.3, ease.back) * (1 - es(t, 4.9, 5.0));
      pose(courage, { x: 870, y: JY - 220, s: ck, o: ck > 0.01 ? 1 : 0 });

      /* v52 — amazed; they had not understood about the loaves; their hearts hardened */
      puzzled.forEach((p, i) => {
        const d = dis[[0, 2, 4][i]];
        const k = es(t, 6.1 + i * 0.1, 6.3 + i * 0.1, ease.back);
        const [hx, hy] = headAt(BX + d.x, BY + 4, 0.95, d.i % 2 === 0);
        pose(p, { x: hx, y: hy - 16, s: k * 0.9, o: k > 0.01 ? 1 : 0 });
      });
      stoneHearts.forEach((h, i) => {
        const d = dis[[1, 3][i]];
        const k = es(t, 6.4 + i * 0.1, 6.6 + i * 0.1, ease.back);
        pose(h, { x: BX + d.x + 4, y: BY - 105, s: k, o: k > 0.01 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[0, 40], [1.0, 60], [2.0, 40], [4.9, 40], [5.4, 0]]);
      S.cam.z = kf(t, [[0, 1.04], [1.0, 1.02], [2.2, 1.1], [3.9, 1.12], [4.3, 1.06], [5.4, 1.08], [6.2, 1.14]]);
      S.cam.y = kf(t, [[0, 20], [2.2, 40], [6.2, 50]]);
    };
  },
};
