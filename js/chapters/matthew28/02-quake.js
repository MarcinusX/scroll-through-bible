// Mt 28,2–4 — "And behold": the whole paper theatre shakes. The ground cracks, stones tumble from the rock, the birds
// fly up, the guards stagger and the two women cling to each other. The sky opens in a shaft of light and the angel of
// the Lord comes down; he walks to the tomb, rolls the great stone away — the cord snaps, the seals fall — and with one
// light leap sits on top of it. His appearance is like lightning (the sky darkens round him, bolts flash out of his
// light); his clothing is white as snow (snow whirls down and the sky turns gold). The guards shake with fear and fall
// flat, stiff, like dead men, their spears and helmets on the grass.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, flock, mix } from '../kit.js';
import { cloud } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  MAGD, MARYJ, ANGEL, ROSE, STORMY, GOLD, tombGarden, soldier, angelPerson, SHUT, OPEN, SR, STONE_Y, DX, DYD, GUARD, WOMEN_AT,
  crack, pebble, shakeLines, snowField, boltCrown, sealBit, headAt, sparkle, rays, bird, dust, PI,
} from './lib.js';

const AX = 850, AY = 716;            // where the angel lands
const SEAT = { x: OPEN - 6, y: STONE_Y - SR + 10 };
export const FALL = [1, -1, 1];      // the guards fall backwards / forwards, away from each other

export default {
  id: 'mt28-quake',
  beats: [
    { v: 2, text: 'A oto powstało wielkie trzęsienie ziemi.' },
    { v: 2, cont: true, text: 'Albowiem anioł Pański zstąpił z nieba,' },
    { v: 2, cont: true, text: 'podszedł, odsunął kamień i usiadł na nim.' },
    { v: 3, text: 'Postać jego jaśniała jak błyskawica,' },
    { v: 3, cont: true, text: 'a szaty jego były białe jak śnieg.' },
    { v: 4 },
  ],
  cam: { x: [-40, 260], y: [-140, 40], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    sky(S, ROSE);
    const dark = sky(S, STORMY, { name: 'storm', rise: 0 }).layer;
    const gold = sky(S, GOLD, { name: 'gold', rise: 0 }).layer;
    dark.fade(0); gold.fade(0);
    const hangL = S.layer({ par: 0.04, sh: 4, pad: 40 });
    const clL = hanging(hangL, cloud(c, 260), { x: 700, y: 150, len: 800 });
    const clR = hanging(hangL, cloud(c, 230), { x: 960, y: 170, len: 800 });
    const birds = flock(S, hangL, 6, (cc) => bird(cc, { color: C.bird }), { y: 260, speed: 90, scale: 0.5 });

    /* the shaft of light from heaven */
    const shaftL = S.layer({ par: 0.1, sh: 0, flat: true, rise: 0 });
    const shaft = shaftL.add(`<g opacity="0"><path d="${c.poly([[-70, -900], [70, -900], [210, 700], [-210, 700]])}" fill="#fff6d8" opacity=".55"/><path d="${c.poly([[-24, -900], [24, -900], [90, 700], [-90, 700]])}" fill="#fffaf0" opacity=".6"/></g>`);

    const G = tombGarden(S, { pad: 40 });
    /* cracks and stones */
    const cracks = [[430, 770, 300, -4], [880, 752, 200, 6], [1180, 780, 260, -8], [180, 830, 240, 3]].map(([x, y, len, r], i) => ({ x, y, r, i, el: G.ground.add(`<g>${crack(c, len, 12)}</g>`) }));
    const peb = [[880, 430], [1010, 400], [1210, 420], [1300, 470], [760, 520], [1120, 410]].map(([x, y], i) => ({ x, y, i, el: G.ground.add(`<g>${pebble(c, 10 + (i % 3) * 5)}</g>`) }));
    const puffs = [[860, 700], [1250, 700], [620, 740]].map(([x, y], i) => ({ x, y, i, el: G.ground.add(`<g>${dust(c, 40)}</g>`) }));
    const sealBits = [0, 1].map(() => G.ground.add(`<g>${sealBit(c, 13)}</g>`));

    /* the guard */
    const L = G.P;
    const guards = GUARD.map((g) => ({ ...g, seed: c.rr(0, 9), p: S.puppet(L.add(soldier(c, g.i, { spear: 30 }))), sh: L.add(`<g>${shakeLines(c, 26)}</g>`) }));

    /* the angel: his light, his lightning, standing (coming down), seated on the stone */
    const aura = L.add(`<g opacity="0"><circle r="230" fill="url(#halo-glow)"/><g opacity=".24">${rays(c, { n: 22, r0: 60, r1: 320, spread: 0.035, color: '#fff3cf' })}</g></g>`);
    const bolts = L.add(`<g opacity="0">${boltCrown(c, 7, 260)}</g>`);
    const angel = S.puppet(L.add(angelPerson(c, ANGEL, 'stand')));
    const seated = S.puppet(L.add(angelPerson(c, ANGEL, 'sit')));
    const white = L.add(`<g opacity="0"><ellipse cx="0" cy="-60" rx="80" ry="110" fill="url(#halo-glow)"/></g>`);

    /* the two women, clinging to each other */
    const W = [MAGD, MARYJ].map((o, i) => ({ i, seed: c.rr(0, 9), x: WOMEN_AT[i][0], y: WOMEN_AT[i][1], p: S.puppet(G.front.add(person(c, o))), k: S.puppet(G.front.add(person(c, { ...o, pose: 'kneel' }))) }));
    const fear = W.map(() => G.front.add(`<g>${shakeLines(c, 22)}</g>`));

    /* snow, and the flash */
    const snowL = S.layer({ par: 0.55, sh: 1, pad: 700, rise: 0 });
    snowL.add(snowField(c, { x0: -300, x1: 1900, y0: -600, y1: 900, n: 90 }));
    snowL.fade(0);
    const flashL = S.layer({ par: 0, sh: 0, flat: true, rise: 0 });
    flashL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#fffaf0"/>`);
    flashL.fade(0);
    const glints = [0, 1, 2, 3].map(() => S.layer({ par: 0.55, sh: 2 }).add(`<g>${sparkle(c, 14)}</g>`));

    return (t, time) => {
      /* v2a: the earthquake — every sheet shakes (whole sheets, on the compositor) */
      const q = es(t, 0.02, 0.18) * (1 - es(t, 0.8, 1.35)) + bump(t, 2.3, 2.5) * 0.25;
      const amp = [5, 9, 16, 16, 16, 24];
      G.layers.forEach((Ly, k) => {
        const ph = t * 140 + (time ? time * 46 : 0) + k * 1.7;
        Ly.shift(Math.sin(ph) * amp[k] * q, Math.cos(ph * 1.3) * amp[k] * 0.45 * q);
      });
      hangL.shift(Math.sin(t * 90 + (time ? time * 30 : 0)) * 20 * q, 0);
      swing(clL, 700 - es(t, 1.0, 1.4) * 260, 150, time, 1 + q * 6, 0.8, 1);
      swing(clR, 960 + es(t, 1.0, 1.4) * 280, 170, time, 1 + q * 6, 0.8, 2);
      birds(time, es(t, 0.15, 0.4) * (1 - es(t, 1.2, 1.6)));
      cracks.forEach((k) => pose(k.el, { x: k.x, y: k.y, sx: es(t, 0.12 + k.i * 0.12, 0.5 + k.i * 0.12, ease.out), r: k.r, o: seg(t, 0.1 + k.i * 0.12, 0.14 + k.i * 0.12) }));
      peb.forEach((p) => {
        const u = es(t, 0.15 + p.i * 0.07, 0.6 + p.i * 0.07, ease.in);
        pose(p.el, { x: p.x + u * (p.i % 2 ? 40 : -30), y: lerp(p.y, 700 + (p.i % 3) * 12, u), r: u * 200 * (p.i % 2 ? 1 : -1), o: u > 0 ? 1 : 0 });
      });
      puffs.forEach((p) => { const b = bump(t, 0.3 + p.i * 0.1, 1.0 + p.i * 0.1); pose(p.el, { x: p.x, y: p.y, s: 0.5 + b, o: b * 0.8 }); });

      /* v2b: the sky opens; the angel of the Lord comes down in the light */
      const open = es(t, 1.0, 1.3) * (1 - es(t, 2.8, 3.1));
      pose(shaft, { x: AX, y: 0, sx: 0.3 + open * 0.7, o: open });
      const down = es(t, 1.08, 1.75, ease.out);
      /* v2c: he comes to the stone, rolls it away, and sits on it */
      const walk = es(t, 2.02, 2.18);
      const roll = es(t, 2.15, 2.52, ease.io);
      const leap = es(t, 2.55, 2.68, ease.out);
      const sit = seg(t, 2.66, 2.72);
      const sx = lerp(SHUT, OPEN, roll);
      pose(G.stone, { x: sx, y: STONE_Y, r: ((sx - SHUT) / SR) * 57.3 });
      const snap = es(t, 2.2, 2.26);
      pose(G.cord, { x: DX + roll * 30, y: DYD + roll * 10, o: 1 - snap });
      sealBits.forEach((el, i) => {
        const u = es(t, 2.22, 2.6, ease.in);
        pose(el, { x: DX + (i ? 40 : -30) + u * (i ? 30 : -24), y: lerp(DYD - SR + 10, DYD - 4, u), r: u * (i ? 160 : -140), o: snap });
      });
      pose(G.doorGlow, { x: DX, y: DYD, o: es(t, 2.3, 2.6) * 0.35 });
      const push = es(t, 2.1, 2.2) * (1 - es(t, 2.5, 2.56));
      const axN = lerp(lerp(AX, SHUT - SR - 34, walk) + (sx - SHUT), SEAT.x, leap);
      const ayN = lerp(lerp(-260, AY, down), SEAT.y - 20, leap) - bump(t, 2.55, 2.7) * 40;
      angel.set({ x: axN, y: ayN, s: 1.02, o: seg(t, 1.05, 1.15) * (1 - sit), armF: 30 + (1 - down) * 60 + push * 60, armB: 20 + (1 - down) * 110 + push * 50, lean: push * 12, walk: walk > 0 && walk < 1 ? axN * 0.05 : undefined, blink: blinkAt(time, 2) });
      const [ahx, ahy] = headAt(SEAT.x, SEAT.y, 1.02, true, 62);
      seated.set({ x: SEAT.x, y: SEAT.y, s: 1.02, flip: true, o: sit, armF: 20 + es(t, 3.1, 3.3) * 40 * (1 - es(t, 4.9, 5.2)), armB: 12 + es(t, 3.1, 3.3) * 60 * (1 - es(t, 4.9, 5.2)), head: -4, blink: blinkAt(time, 2) });

      /* v3a: his appearance like lightning */
      const ltn = es(t, 3.02, 3.25) * (1 - es(t, 3.9, 4.2));
      dark.fade(ltn * 0.85);
      const fl = Math.max(bump(t, 3.1, 3.22), bump(t, 3.35, 3.45) * 0.8, bump(t, 3.62, 3.7) * 0.6, bump(t, 1.1, 1.25) * 0.5);
      flashL.fade(fl * 0.55);
      const ax = down < 1 && sit < 1 ? axN : SEAT.x, ay = sit < 1 ? ayN - 110 : ahy + 40;
      pose(aura, { x: ax, y: ay, s: 0.5 + open * 0.3 + ltn * 0.5 + es(t, 4.0, 4.4) * 0.2, r: t * 6, o: Math.max(open, sit) * (0.7 + ltn * 0.3) * (1 - es(t, 5.0, 5.4) * 0.3) });
      const bk = (t > 3.05 && t < 4.1 ? (Math.floor(t * 9) % 2 ? 1 : 0.35) : 0) * ltn;
      pose(bolts, { x: ahx, y: ahy + 10, s: 0.8 + ltn * 0.4, r: Math.floor(t * 9) * 7, o: bk });

      /* v3b: his clothing white as snow */
      const snow = es(t, 4.02, 4.3) * (1 - es(t, 5.6, 6.0));
      gold.fade(es(t, 3.9, 4.4));
      snowL.fade(snow);
      snowL.shift((time ? Math.sin(time * 0.5) * 30 : 0), lerp(-500, 560, seg(t, 4.0, 6.0)));
      pose(white, { x: SEAT.x - 4, y: SEAT.y - 10, s: 1 + es(t, 4.1, 4.5) * 0.6, o: es(t, 4.1, 4.5) * 0.9 });
      glints.forEach((el, i) => { const b = bump(t, 4.2 + i * 0.12, 4.9 + i * 0.12); pose(el, { x: SEAT.x + [-60, 40, -30, 60][i], y: SEAT.y + [-160, -120, -40, -20][i], s: b, r: time * 40, o: b }); });

      /* v4: the guards tremble and become like dead men */
      guards.forEach((g, k) => {
        const reel = es(t, 0.1, 0.3) * (1 - es(t, 1.2, 1.5));
        const cower = es(t, 1.3, 1.6) * (1 - es(t, 5.3, 5.4));
        const trem = es(t, 5.02, 5.15) * (1 - es(t, 5.4, 5.5));
        const fall = es(t, 5.4, 5.62, ease.in);
        const jit = (Math.sin(t * 160 + k * 2 + (time ? time * 40 : 0))) * (reel * 5 + trem * 4 + cower * 1.2);
        const dir = FALL[k];                     // which way each one falls
        g.p.set({ x: g.x + jit, y: g.y - fall * 34, s: 0.98, flip: g.x > DX || t < 1.15, r: fall * dir * 84, armF: 30 + reel * 30 + cower * 40 - fall * 20, armB: 8 + reel * 60 + cower * 110 * (1 - fall), head: cower * 10 - fall * 4, lean: -reel * 10 * dir + cower * 6, blink: fall > 0.5 ? 1 : cower > 0.3 ? 0 : blinkAt(time, g.seed) });
        const [hx, hy] = headAt(g.x, g.y, 0.98, g.x > DX);
        pose(g.sh, { x: hx, y: hy, s: 1 + trem * 0.3, o: Math.max(reel, trem) * (1 - fall) });
      });

      /* the women cling to each other, then sink to their knees */
      const kneel = seg(t, 1.35, 1.42);
      W.forEach((w, i) => {
        const cling = es(t, 0.15, 0.4);
        const x = w.x - (i === 0 ? 1 : -1) * cling * 18 + Math.sin(t * 150 + i) * 3 * es(t, 0.1, 0.3) * (1 - es(t, 1, 1.3));
        w.p.set({ x, y: w.y, s: 1.02, flip: i === 0 && cling > 0.5 && kneel < 1, o: 1 - kneel, armF: 30 + cling * 50, armB: 10 + cling * 40, lean: -cling * 6, head: -es(t, 1.0, 1.3) * 14, blink: blinkAt(time, w.seed) });
        w.k.set({ x, y: w.y, s: 1.02, o: kneel, armF: 60 + es(t, 5.0, 5.3) * 30, armB: 110 - es(t, 3.9, 4.3) * 40, head: -10 + es(t, 5.0, 5.4) * 16, lean: -6, blink: blinkAt(time, w.seed) });
        const [hx, hy] = headAt(x, w.y, 1.02, false, kneel ? 46 : 0);
        pose(fear[i], { x: hx, y: hy, o: es(t, 0.1, 0.3) * (1 - es(t, 1.0, 1.3)) + bump(t, 3.05, 3.9) * 0.9 });
      });

      /* the camera: wide for the quake, up to the sky, on to the stone, close on the angel, wide for the guard */
      const up = es(t, 0.95, 1.2) * (1 - es(t, 1.7, 2.05));
      const close = es(t, 2.85, 3.3) * (1 - es(t, 4.95, 5.3));
      S.cam.x = lerp(lerp(40, 160, es(t, 1.9, 2.4)), 250, close) - es(t, 5.0, 5.4) * 70;
      S.cam.y = 20 - up * 150 - close * 60;
      S.cam.z = 1.02 + close * 0.14 - es(t, 5.0, 5.4) * 0.02;
    };
  },
};
