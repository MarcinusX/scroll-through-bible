// Mt 2,7–8 — night, a private room of the palace. Herod has the Magi brought in secretly through the curtain and
// questions them closely: when did the star appear? A Magus unrolls his star chart and counts the moons. Herod
// points through the window to Bethlehem: go, search for the Child. "And bring me word, so that I too may come
// and worship Him" — he bows with a hand on his heart, but his shadow on the wall grips a sword.
import { C, person, blinkAt, pose, lerp, hanging, sky, sheet, shade, mix } from '../kit.js';
import { band, stars } from '../../assets/nature.js';
import { es, ease, bump, attr, fade } from '../../core/anim.js';
import {
  LOOK, NIGHT, dim, magus, herodPuppet, silhouette, starChart, bigStar, hillTown, placeTag, speech, infant, GLYPH, crown,
  hangAt, vpose, kf, moving, flicker, sparkle, INK, addToHead, tr, PI,
} from './lib.js';

const FL = 690;                 // the floor
const HX = 880;                 // Herod
const MX0 = [440, 540, 640];    // the Magi
const MXP = [525, 605, 685];    // phone: inside the frame
const LX = 750;                 // the lamp

function sword(c) {
  const s = sheet();
  s.p(c.cut([[-3, 10], [3, 10], [4, 96], [0, 110], [-4, 96]], 0.2, 4), INK);
  s.p(c.cut(c.rect(-14, 6, 28, 6), 0.2, 3) + c.cut(c.rect(-3, -14, 6, 22), 0.2, 3), INK);
  return s.out(false);
}

export default {
  id: 'mt2-secret',
  beats: [
    { v: 7, text: 'Wtedy Herod przywołał potajemnie Mędrców' },
    { v: 7, cont: true, text: 'i wypytał ich dokładnie o czas ukazania się gwiazdy.' },
    { v: 8, text: 'A kierując ich do Betlejem, rzekł: «Udajcie się tam i wypytujcie starannie o Dziecię,' },
    { v: 8, cont: true, text: 'a gdy Je znajdziecie, donieście mi, abym i ja mógł pójść i oddać Mu pokłon».' },
  ],
  cam: { x: [-60, 60], y: [0, 80], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    sky(S, NIGHT);
    /* through the window: the night, Bethlehem far away on its hill, the star */
    const outL = S.layer({ par: 0.06, sh: 2 });
    outL.add(`<g>${stars(c, { x0: 300, x1: 800, y0: 120, y1: 420, n: 26 })}</g>`);
    outL.add(band(c, { y: 440, amps: [16, 6, 2], lens: [700, 260, 100], color: dim(C.hillMid, 0.6) }).markup);
    outL.add(`<g transform="translate(560 438)">${hillTown(c, { w: 110, h: 26, col: dim(C.hillMid, 0.55), wall: dim(C.plaster, 0.5), wall2: dim(C.plaster2, 0.55), roof: dim(C.roof, 0.5), n: 5, lit: 0.6 })}</g>`);
    const starEl = hanging(outL, bigStar(c, 14), { x: 0, y: 0, len: 600 });

    /* the room: a dark wall with the window, heavy curtain over a doorway on the left */
    const wallL = S.layer({ par: 0.3, sh: 3 });
    const wcol = mix(C.plumRobe, C.night, 0.5);
    const W = sheet();
    const win = [[450, 430], [450, 260], ...c.arc(550, 260, 100, 80, PI, 2 * PI, 12), [650, 430]];
    W.p(c.cut([[-1200, -1200], [2800, -1200], [2800, FL - 40], [-1200, FL - 40]], 1, 30) + c.hole(win, 0.5, 6), wcol);
    let hang_ = '';
    for (let x = -1100; x < 2800; x += 64) hang_ += c.ribbon([[x, -200], [x + c.rr(-4, 4), FL - 40]], 14);
    W.x(hang_, shade(wcol, -0.12), 'opacity=".35"');
    W.p(c.cut([[436, 434], [664, 434], [670, 450], [430, 450]], 0.4, 6), mix(C.stone2, C.night, 0.4));
    W.p(c.cut([[-1200, 90], [2800, 90], [2800, 118], [-1200, 118]], 0.4, 20), mix(C.sun, C.night, 0.35));
    wallL.add(W.out());
    const floorL = S.layer({ par: 0.4, sh: 3 });
    floorL.add(sheet().p(c.cut([[-1200, FL - 44], [2800, FL - 44], [2800, 1700], [-1200, 1700]], 0.6, 20), mix(C.stone2, C.night, 0.45)).p(c.cut([[180, FL + 8], [1400, FL + 8], [1440, FL + 60], [140, FL + 60]], 0.6, 10), mix(C.curtain2, C.night, 0.35)).out());

    /* the shadow on the wall (cast by the lamp): Herod's shape, twice as large */
    const shL = S.layer({ par: 0.3, sh: 0, flat: true });
    const shadowLook = silhouette(LOOK.herod, INK);
    const shMark = addToHead(person(c, { ...shadowLook, holdF: `<g opacity="0" data-k="swd">${sword(c)}</g>` }), crown(c, INK)).split(`fill="${C.blush}"`).join(`fill="${INK}"`).split(`fill="${C.inkSoft}"`).join(`fill="${INK}"`);
    const shadow = S.puppet(shL.add(shMark));
    const swd = S.$('swd');
    shL.fade(0.3);

    /* the lamp on its stand */
    const lampL = S.layer({ par: 0.45, sh: 4 });
    lampL.add(`<g transform="translate(${LX} ${FL})">${sheet().p(c.cut([[-22, 0], [-8, -12], [-4, -150], [-12, -156], [12, -156], [4, -150], [8, -12], [22, 0]], 0.3, 5), C.sun).out()}</g>`);
    const lampEl = lampL.add(`<g transform="translate(${LX - 18} ${FL - 158}) scale(.6)"><circle class="glow" cx="34" cy="-30" r="260" fill="url(#warm-glow)"/>${sheet().p(c.cut([[-26, 0], [-30, -8], [-18, -16], [10, -16], [24, -12], [34, -16], [38, -12], [26, -2], [14, 2], [-18, 2]], 0.4, 5), C.pot).out()}<g class="flame" transform="translate(35 -16)"><path d="M0 0C-7 -6 -6 -16 0 -30C6 -16 7 -6 0 0Z" fill="${C.lampFlame}"/><path d="M0 -2C-3 -6 -3 -11 0 -17C3 -11 3 -6 0 -2Z" fill="#fff4d2"/></g></g>`);
    const lamp = { glow: lampEl.querySelector('.glow'), flame: lampEl.querySelector('.flame') };

    /* people */
    const P = S.layer({ par: 0.5, sh: 5 });
    const MX = S.portrait ? MXP : MX0;
    const magi = MX.map((x, i) => ({ i, x, p: S.puppet(P.add(magus(c, i, i === 1 ? { holdF: '' } : {}))), seed: c.rr(0, 9) }));
    const herod = S.puppet(P.add(herodPuppet(c, {})));

    /* the curtain over the doorway (parts to let them in, falls shut behind them) */
    const curL = S.layer({ par: 0.55, sh: 6 });
    const panel = (dir) => {
      const s = sheet();
      const x0 = dir < 0 ? 80 : 200, x1 = dir < 0 ? 200 : 320;
      s.p(c.cut([[x0, 60], [x1, 60], [x1 + dir * 4, FL + 10], [x0, FL + 10]], 0.6, 10), mix(C.curtain2, C.night, 0.25));
      let f = '';
      for (let x = x0 + 14; x < x1; x += 26) f += c.ribbon([[x, 60], [x + c.rr(-3, 3), FL + 10]], 6);
      s.x(f, shade(mix(C.curtain2, C.night, 0.25), -0.2), 'opacity=".5"');
      return `<g>${s.out()}</g>`;
    };
    curL.add(sheet().p(c.cut([[30, 30], [370, 30], [370, 70], [30, 70]], 0.4, 8), mix(C.sun, C.night, 0.3)).out());
    const curA = curL.add(panel(-1)), curB = curL.add(panel(1));

    /* the star chart and its moons, the words */
    const fx = S.layer({ par: 0.55, sh: 5 });
    const chart = fx.add(starChart(c, 190, 130));
    const moons = [0, 1, 2, 3, 4, 5].map((i) => fx.add(`<g><path d="${c.poly(c.circ(0, 0, 8.4, 12))}" fill="${C.sun}"/></g>`));
    const q = fx.add(`<g>${speech(c, `<g transform="scale(1.2)">${GLYPH.star(c)}</g>`, { w: 92, h: 62, flip: true })}</g>`);
    const tagB = hanging(fx, placeTag(c, tr('do Betlejem', 'to Bethlehem'), 19), { x: 0, y: 0, len: 600 });
    const seek = fx.add(`<g>${speech(c, `<g transform="translate(-14 6) scale(.68)">${infant(c)}</g><g transform="translate(34 0) scale(.9)">${GLYPH.q(c)}</g>`, { w: 108, h: 66, flip: true })}</g>`);
    const worship = fx.add(`<g>${speech(c, `<g transform="translate(0 4)">${sheet().p(c.cut([[0, 10], [-16, -4], [-14, -14], [-6, -16], [0, -8], [6, -16], [14, -14], [16, -4]], 0.4, 4), C.jesusMantle).out()}</g>`, { w: 70, h: 56, flip: true })}</g>`);

    return (t, time) => {
      const T = time;
      flicker(lamp, T);
      hangAt(starEl, 600, 250, T, 1, 1, 0.6, 0);

      /* v7a — the Magi are brought in secretly through the curtain */
      const part = bump(t, 0.05, 0.9);
      pose(curA, { x: -part * 110 });
      pose(curB, { x: part * 60 });
      const beckon = bump(t, 0.0, 0.85);
      magi.forEach((m) => {
        const k = es(t, 0.1 + m.i * 0.1, 0.6 + m.i * 0.1, ease.out);
        const x = lerp(200, m.x, k) + (m.i === 1 ? bump(t, 1.2, 2.0) * 40 : 0);
        const look = es(t, 2.1, 2.35) * (1 - es(t, 2.9, 3.1));
        const show = m.i === 1 ? es(t, 1.15, 1.35) * (1 - es(t, 1.95, 2.1)) : 0;
        m.p.set({ x, y: FL + 4 + m.i * 3, s: 0.92, walk: k > 0 && k < 1 ? x * 0.06 + m.i : undefined, o: k > 0.02 ? 1 : 0, armF: 20 + show * 60 + look * (m.i === 0 ? 100 : 0), armB: 10 + show * 50, head: -look * 16 + (1 - look) * bump(t, 3.1, 3.9) * 8, blink: blinkAt(T, m.seed) });
      });

      /* v7b — when did the star appear? the chart is unrolled, the moons are counted */
      const ck = es(t, 1.1, 1.35, ease.back) * (1 - es(t, 1.95, 2.1));
      vpose(chart, { x: 700, y: 400, s: ck * 0.92, r: -3, o: ck > 0.01 ? 1 : 0 });
      moons.forEach((m, i) => {
        const k = es(t, 1.35 + i * 0.07, 1.42 + i * 0.07, ease.back);
        vpose(m, { x: 700 + (-190 * 0.38 + i * 190 * 0.152) * 0.92 - 2, y: 400 + 130 * 0.3 * 0.92 - 2, s: k * ck * 0.92, o: k * ck > 0.01 ? 1 : 0 });
      });
      const qk = es(t, 1.02, 1.15, ease.back) * (1 - es(t, 1.4, 1.5));
      vpose(q, { x: HX - 40, y: FL - 205, s: qk, o: qk > 0.01 ? 1 : 0 });

      /* v8 — Herod points through the window to Bethlehem; then bows, hand on heart */
      const point = es(t, 2.05, 2.3) * (1 - es(t, 2.85, 3.05));
      const count = bump(t, 1.3, 1.95);
      const bow = es(t, 3.05, 3.3);
      herod.set({ x: HX, y: FL + 2, s: 1.02, flip: true, armF: 20 + beckon * 30 + count * 50 + point * 125 + bow * 30, armB: beckon * 100 + bow * 10, head: -beckon * 6 + count * 6 - point * 12 + bow * 16, lean: count * 5 + bow * 10, blink: blinkAt(T, 1) });
      const drawn = es(t, 3.25, 3.6);
      shadow.set({ x: HX + (S.portrait ? 170 : 250), y: FL - 44, s: 1.6, flip: true, armF: 20 + beckon * 30 + count * 50 + point * 125 + drawn * 70, armB: beckon * 100 + bow * 10, head: -beckon * 6 + count * 6 - point * 12 + bow * 10 - drawn * 18, lean: count * 5 + bow * 6 - drawn * 4 });
      fade(swd, drawn);
      const bk = es(t, 2.15, 2.4, ease.out) * (1 - es(t, 3.0, 3.15, ease.in));
      hangAt(tagB, 550, lerp(-400, 318, bk), T, bk > 0.001 ? 1 : 0, 1.2, 0.9, 3);
      const sk = es(t, 2.35, 2.5, ease.back) * (1 - es(t, 2.95, 3.05));
      vpose(seek, { x: HX - 50, y: FL - 210, s: sk, o: sk > 0.01 ? 1 : 0 });
      const wk = es(t, 3.2, 3.35, ease.back);
      vpose(worship, { x: HX - 60, y: FL - 190, s: wk, o: wk > 0.01 ? 1 : 0 });

      S.cam.x = lerp(-50, 0, es(t, 0.5, 1.0)) + es(t, 2.9, 3.3) * 50;
      S.cam.y = 40;
      S.cam.z = 1.04 + es(t, 2.9, 3.3) * 0.06;
    };
  },
};
