// Łk 15,8 — the parable flies in: a woman's one-room house at dusk — plastered walls, a small window on the
// evening sky, a niche, a low table, a wooden chest, a jar and a broom by the wall; on her brow the band of her
// coins. "Or what woman, having ten drachmas, if she loses one drachma…": she sits at the table counting ten silver
// coins in a row (a tag says 10) — one rolls off the edge, bounces on the floor and rolls away under the chest into
// the dark; the tag drops to 9 and the dusk comes down in the room. "…does not light a lamp": she gets up, lights
// the clay lamp, and its warm light pushes the dark back into the corners. "…sweep the house": she sets the lamp
// on the floor and sweeps, puffs of dust flying. "…and seek diligently until she finds it?": she kneels by the chest
// with the lamp held low — a glint under it! — she reaches in and holds up the coin, shining; 10 again.
import { C, person, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import {
  WOMAN, drachma, coinBand, lamp, broom, sparkle, question, hungWords, hangOff, glow, addToHead,
  headP, handP, kf, moving, es, ease, bump, seg, fade, tr, PI, DUSK,
} from './lib.js';

const GY = 712;
const TX = 760, TOP = 606;           // the table's middle and top
const CHEST = { x: 1040, w: 184, h: 94 };
const coinX = (i) => TX - 92 + i * 20;
const KNEEL_X = 906;
const SC = 1.14;

export default {
  id: 'lk15-coin',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 8, text: 'Albo jeśli jakaś kobieta, mając dziesięć drachm, zgubi jedną drachmę,' },
    { v: 8, cont: true, text: 'czyż nie zapala światła,' },
    { v: 8, cont: true, text: 'nie wymiata domu' },
    { v: 8, cont: true, text: 'i nie szuka starannie, aż ją znajdzie?' },
  ],
  cam: { x: [-20, 110], y: [0, 70], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    /* the room */
    const wallL = S.layer({ par: 0.2, sh: 2, rise: 0 });
    const w = sheet();
    w.p(c.cut([[-1400, -1200], [3000, -1200], [3000, 1800], [-1400, 1800]], 0.6, 20), mix(C.plaster, C.sand, 0.22));
    let pat = '';
    for (let i = 0; i < 30; i++) pat += c.cut(c.blob(c.rr(-900, 2500), c.rr(-200, 660), c.rr(22, 50), c.rr(9, 18), 10, 0.2), 0.5, 6);
    w.x(pat, C.plaster2, 'opacity=".5"');
    // the beams of the ceiling
    let beams = '';
    for (let x = -900; x < 2600; x += 190) beams += c.cut(c.rect(x, 90, 30, 34), 0.3, 5);
    w.p(c.cut([[-1400, 60], [3000, 60], [3000, 96], [-1400, 96]], 0.4, 14), C.wood2).p(beams, shade(C.wood2, -0.1));
    // window, niche, doorway
    w.p(c.cut(c.rect(1060, 270, 124, 110), 0.4, 6), C.wood2);
    w.p(c.cut(c.rect(420, 370, 124, 100), 0.4, 6), mix(C.plaster2, C.clay, 0.2));
    w.p(c.cut([[180, GY], [180, 470], ...c.arc(240, 470, 60, 50, PI, 2 * PI, 10), [300, GY]], 0.4, 6), C.wood);
    w.x(c.ribbon([[240, 460], [240, GY - 4]], 2) + c.ribbon([[190, 560], [290, 560]], 2), shade(C.wood, -0.25), 'opacity=".6"');
    // a shelf with jars, herbs hung from the beam, a striped rug on the wall, a jar and cloth in the niche
    w.p(c.cut(c.rect(600, 300, 210, 12), 0.3, 6), C.wood2).p(c.cut([[612, 312], [622, 312], [616, 336]], 0.2, 3) + c.cut([[788, 312], [798, 312], [794, 336]], 0.2, 3), C.wood2);
    [[630, 22, C.pot], [670, 30, mix(C.pot, C.ochre, 0.4)], [712, 18, C.tealRobe], [752, 26, mix(C.clay, C.wood3, 0.5)], [784, 16, C.pot]].forEach(([x, h, col]) => w.p(c.cut([[x - h * 0.4, 300], [x - h * 0.5, 300 - h * 0.6], [x - h * 0.25, 300 - h], [x + h * 0.25, 300 - h], [x + h * 0.5, 300 - h * 0.6], [x + h * 0.4, 300]], 0.3, 4), col));
    [[870, 22], [910, 30], [950, 20]].forEach(([x, l]) => { w.p(c.ribbon([[x, 124], [x, 124 + l]], 1.6), C.rope); w.p(c.cut(c.blob(x, 124 + l + 16, 10, 20, 9, 0.25), 0.5, 4), C.moss); });
    const rug = sheet();
    rug.p(c.cut(c.rect(250, 250, 120, 170), 0.4, 6), C.terracotta);
    let st2 = '';
    for (let y = 262; y < 410; y += 22) st2 += c.cut(c.rect(254, y, 112, 8), 0.2, 4);
    rug.p(st2, C.wheat).x(c.cut(c.rect(254, 330, 112, 10), 0.2, 4), C.teal2);
    w.raw(rug.out());
    w.p(c.cut([[462, 470], [456, 440], [470, 420], [490, 420], [504, 440], [498, 470]], 0.3, 4), C.pot).p(c.cut(c.rect(508, 452, 30, 18), 0.3, 4), C.skyVeil);
    wallL.add(w.out());
    const winSky = wallL.add(`<g><path d="${c.poly(c.rect(1069, 279, 106, 92))}" fill="${DUSK[1]}"/><path d="${c.poly(c.rect(1069, 279, 106, 36))}" fill="${DUSK[0]}"/><path d="${c.ribbon([[1122, 279], [1122, 371]], 5) + c.ribbon([[1069, 325], [1175, 325]], 5)}" fill="${C.wood2}"/></g>`);
    const floorL = S.layer({ par: 0.3, sh: 3 });
    floorL.add(sheet().p(c.cut([[-1400, GY - 12], [3000, GY - 12], [3000, 1800], [-1400, 1800]], 0.6, 16), mix(C.clay, C.sand2, 0.55)).x(c.cut(c.ell(800, GY + 40, 520, 30, 30), 0.8, 12), shade(C.sand2, 0.1), 'opacity=".5"').out());
    /* the lost coin (behind the chest when it rolls under) */
    const coinL = S.layer({ par: 0.34, sh: 3 });
    const lostCoin = coinL.add(`<g>${drachma(c, 8.5)}</g>`);
    /* furniture */
    const furn = S.layer({ par: 0.34, sh: 4 });
    const ch = sheet();
    ch.p(c.cut([[CHEST.x - CHEST.w / 2, GY - 14 - CHEST.h], [CHEST.x + CHEST.w / 2, GY - 14 - CHEST.h], [CHEST.x + CHEST.w / 2, GY - 14], [CHEST.x - CHEST.w / 2, GY - 14]], 0.5, 8), C.wood);
    ch.p(c.cut(c.rect(CHEST.x - CHEST.w / 2 + 4, GY - 14, 16, 14), 0.3, 4) + c.cut(c.rect(CHEST.x + CHEST.w / 2 - 20, GY - 14, 16, 14), 0.3, 4), C.wood2);
    ch.p(c.cut(c.rect(CHEST.x - CHEST.w / 2 - 4, GY - 24 - CHEST.h, CHEST.w + 8, 12), 0.3, 6), shade(C.wood, -0.15));
    ch.x(c.ribbon([[CHEST.x - CHEST.w / 2 + 10, GY - 50], [CHEST.x + CHEST.w / 2 - 10, GY - 50]], 3) + c.cut(c.rect(CHEST.x - 8, GY - 70, 16, 14), 0.2, 3), C.ochre);
    furn.add(ch.out());
    // the table
    furn.add(sheet().p(c.cut(c.rect(TX - 132, TOP, 264, 14), 0.4, 8), C.wood).p(c.cut(c.rect(TX - 116, TOP + 14, 14, GY - TOP - 14), 0.3, 5) + c.cut(c.rect(TX + 102, TOP + 14, 14, GY - TOP - 14), 0.3, 5), C.wood2).out());
    // a jar in the corner, the broom against the wall
    furn.add(`<g transform="translate(1196 ${GY - 10}) scale(1.2)">${sheet().p(c.cut([[-24, 0], [-30, -40], [-18, -70], [-12, -84], [12, -84], [18, -70], [30, -40], [24, 0]], 0.5, 6), C.pot).x(c.ribbon([[-26, -50], [26, -50]], 3), shade(C.pot, -0.2)).out()}</g>`);
    const broomWall = furn.add(`<g transform="translate(1266 ${GY - 110}) rotate(-8) scale(1.2)">${broom(c)}</g>`);
    /* the dark of the evening, then the lamp's light (behind her) */
    const darkL = S.layer({ par: 0.34, sh: 0, flat: true, rise: 0 });
    darkL.add(`<rect x="-1400" y="-1400" width="4400" height="3400" fill="${mix(C.night, C.indigo, 0.3)}"/>`);
    const lightL = S.layer({ par: 0.36, sh: 0, flat: true });
    const lightG = lightL.add(`<g opacity="0">${glow(400, 1)}</g>`);
    /* the ten coins on the table, the lamp */
    const onTable = S.layer({ par: 0.36, sh: 3 });
    const coins = Array.from({ length: 10 }, (_, i) => onTable.add(`<g transform="translate(${coinX(i)} ${TOP - 8})">${drachma(c, 8.5)}</g>`));
    const lampT = onTable.add(`<g>${lamp(c, { lit: false })}</g>`);
        /* the woman: sitting counting; standing with the lamp; sweeping; kneeling with the lamp */
    const act = S.layer({ par: 0.38, sh: 5 });
    const W = (o) => addToHead(person(c, { ...WOMAN, ...o }), coinBand(c, 9));
    const sit = S.puppet(act.add(W({ pose: 'sit' })));
    const stand = S.puppet(act.add(W({ holdF: `<g transform="translate(-4 2) scale(.8)">${lamp(c)}</g>` })));
    const standFl = stand.el.querySelector('.flame');
    const sweep = S.puppet(act.add(W({ holdF: `<g transform="rotate(-20) translate(0 -20)">${broom(c)}</g>` })));
    const kneel = S.puppet(act.add(W({ pose: 'kneel', holdF: `<g transform="translate(-4 2) scale(.8)">${lamp(c)}</g>` })));
    const kneelUp = S.puppet(act.add(W({ pose: 'kneel', holdF: `<g transform="translate(0 4)">${drachma(c, 8)}</g>`, holdB: `<g transform="translate(-4 2) scale(.8)">${lamp(c)}</g>` })));
    const lampFloor = act.add(`<g opacity="0">${lamp(c)}</g>`);
    /* dust, glint, question, the tag */
    const fx = S.layer({ par: 0.4, sh: 3 });
    const dust = Array.from({ length: 6 }, (_, i) => fx.add(`<g opacity="0"><path d="${c.cut(c.blob(0, 0, 14 + (i % 3) * 5, 8 + (i % 2) * 3, 9, 0.3), 0.8, 4)}" fill="${mix(C.sand2, C.stone, 0.4)}"/></g>`));
    const glint = fx.add(`<g opacity="0">${glow(60, 0.8)}${sparkle(c, 14)}</g>`);
    const shine = fx.add(`<g opacity="0">${sparkle(c, 18)}</g>`);
    const q = fx.add(`<g opacity="0">${question(c)}</g>`);
    const tagL = S.layer({ par: 0.2, sh: 6 });
    const tags = ['10', '9', '10'].map((n) => hangOff(tagL, hungWords(c, n, { size: 44, w: 96 })));

    return (t, time) => {
      const T = time;
      /* dusk comes, then the lamp is lit */
      const dusk = es(t, 0.3, 0.95);
      const lit = es(t, 1.3, 1.6);
      darkL.fade(dusk * 0.6 * (1 - lit * 0.4));
      fade(winSky, 1 - dusk * 0.5);

      /* v8a — she counts ten coins; one rolls off, under the chest */
      const count = Math.floor(es(t, 0.04, 0.36, (x) => x) * 10);
      coins.forEach((el, i) => pose(el, { x: coinX(i), y: TOP - 8 - (i === count - 1 && t < 0.4 ? 5 : 0), o: i === 9 ? 1 - seg(t, 0.44, 0.46) : 1 }));
      const r1 = es(t, 0.46, 0.56, (x) => x), r2 = es(t, 0.56, 0.8, ease.out);
      const cx = t < 0.56 ? lerp(coinX(9), TX + 150, r1) : lerp(TX + 150, CHEST.x + 10, r2);
      const cy = t < 0.56 ? lerp(TOP - 8, GY - 8, r1 * r1) : GY - 8 - Math.abs(Math.sin(r2 * PI * 3)) * 24 * (1 - r2);
      pose(lostCoin, { x: cx, y: cy, r: (r1 + r2) * 720, o: seg(t, 0.44, 0.46) * (1 - seg(t, 3.66, 3.7)) });
      const t10 = es(t, 0.1, 0.3, ease.back) * (1 - es(t, 0.56, 0.62));
      const t9 = es(t, 0.62, 0.76, ease.back) * (1 - es(t, 3.6, 3.66));
      const t10b = es(t, 3.66, 3.8, ease.back);
      swing(tags[0], 1000, lerp(-900, 190, t10), T, 1.4, 0.8, 1);
      swing(tags[1], 1000, lerp(-900, 190, t9), T, 1.4, 0.8, 2);
      swing(tags[2], 1000, lerp(-900, 190, t10b), T, 1.4, 0.8, 3);
      const look = es(t, 0.5, 0.66);
      const qk = bump(t, 0.62, 1.02);
      const SX = TX - 170;
      sit.set({ x: SX, y: GY, s: SC, o: 1 - seg(t, 1.06, 1.1), armF: 56 + Math.abs(Math.sin(es(t, 0.04, 0.36, (x) => x) * PI * 5)) * 16 * (t < 0.4 ? 1 : 0) - look * 20, armB: 10, head: 6 - look * 6, lean: look * -4, blink: blinkAt(T, 1) });
      const [qx, qy] = headP(SX, GY, SC, false, 'sit');
      pose(q, { x: qx + 34, y: qy - 50, s: 0.9 * qk, o: qk > 0.02 ? 1 : 0 });

      /* v8b — she lights the lamp */
      pose(lampT, { x: TX + 60, y: TOP, o: 1 - seg(t, 1.06, 1.1) });
      const SK = [[1.1, SX + 30], [1.3, TX + 20]];
      const sx = kf(t, SK);
      const standO = seg(t, 1.06, 1.1) * (1 - seg(t, 1.96, 2.0));
      const raise = es(t, 1.3, 1.55);
      stand.set({ x: sx, y: GY, s: SC, o: standO, walk: moving(t, SK) ? sx * 0.07 : undefined, armF: 40 + raise * 60, armB: 20 + bump(t, 1.2, 1.4) * 60, head: -raise * 8, blink: blinkAt(T, 1) });
      fade(standFl, es(t, 1.26, 1.32));

      /* v8c — she sets the lamp down and sweeps */
      pose(lampFloor, { x: 880, y: GY + 2, s: 1.1, o: seg(t, 1.98, 2.02) * (1 - seg(t, 2.96, 3.0)) });
      const WK = [[2.02, TX + 20], [2.12, 540], [2.9, 840]];
      const wx = kf(t, WK, (x) => x);
      const stroke = Math.sin(t * PI * 14);
      pose(broomWall, { x: 1266, y: GY - 110, r: -8, s: 1.2, o: 1 - seg(t, 1.98, 2.02) });
      sweep.set({ x: wx, y: GY, s: SC, o: seg(t, 1.98, 2.02) * (1 - seg(t, 2.96, 3.0)), walk: t > 2.12 && t < 2.9 ? wx * 0.04 : undefined, amt: 0.5, armF: 20 + stroke * 14, armB: 30 + stroke * 10, lean: 8, head: 10, blink: blinkAt(T, 1) });
      dust.forEach((d, i) => {
        const k = ((t - 2.15) * 3 + i / 6) % 1;
        const on = t > 2.15 && t < 2.92 ? 1 : 0;
        pose(d, { x: wx + 60 + k * 50, y: GY - 6 - k * 40, s: 0.6 + k * 0.8, o: on * (1 - k) * 0.8 });
      });

      /* v8d — she kneels with the lamp held low; a glint; she finds it */
      const kn = seg(t, 2.96, 3.0);
      const found = seg(t, 3.58, 3.62);
      const peer = es(t, 3.05, 3.3);
      kneel.set({ x: KNEEL_X, y: GY, s: SC, o: kn * (1 - found), armF: 50 + peer * 20, armB: 10 + es(t, 3.4, 3.55) * 60, lean: 10 + peer * 12, head: 14 + peer * 6, blink: blinkAt(T, 1) });
      const up = es(t, 3.62, 3.78);
      kneelUp.set({ x: KNEEL_X, y: GY, s: SC, o: found, armF: 60 + up * 70, armB: 60 - up * 20, head: -up * 14, blink: blinkAt(T, 1) });
      const gk = es(t, 3.3, 3.42) * (1 - found);
      pose(glint, { x: CHEST.x - 56, y: GY - 10, s: 0.6 + gk * 0.4 + (T ? Math.sin(T * 6) * 0.08 : 0), r: T * 20, o: gk });
      const [fx_, fy_] = handP(KNEEL_X, GY, SC, false, 60 + up * 70, 'kneel');
      pose(shine, { x: fx_ + 4, y: fy_ - 2, s: up, r: T * 30, o: up });

      /* the light follows the lamp */
      let lx = TX + 60, ly = TOP - 30;
      if (t >= 1.08 && t < 1.98) [lx, ly] = handP(sx, GY, SC, false, 40 + raise * 60);
      else if (t >= 1.98 && t < 2.98) [lx, ly] = [912, GY - 30];
      else if (t >= 2.98) [lx, ly] = handP(KNEEL_X, GY, SC, false, found ? 60 : 50 + peer * 20, 'kneel');
      pose(lightG, { x: lx, y: ly, s: 0.8 + lit * 0.3, o: lit });

      S.cam.x = kf(t, [[0, 0], [0.5, 30], [1.1, 20], [1.5, 30], [2.1, -20], [2.9, 40], [3.3, 90]]);
      S.cam.y = kf(t, [[0, 30], [1.5, 20], [2.9, 40], [3.3, 60]]);
      S.cam.z = kf(t, [[0, 1.04], [0.5, 1.08], [1.5, 1.04], [2.9, 1.06], [3.4, 1.14]]);
    };
  },
};
