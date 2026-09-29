// Mt 17,25b–26 — inside Peter's house (Mark 9's house of Capernaum). Peter comes in, about to speak — but Jesus
// speaks first: "What do you think, Simon?" A painted flat comes down from the flies: a king of the earth on his
// throne, a chest for his tolls; "from whom do they take tribute?" — strangers file in with coins and jars; "from
// their sons, or from strangers?" — two little princes stand by the throne. "From strangers," says Peter, pointing;
// "then the sons are free": the strangers pay into the chest, while the princes skip away, free, in a little light.
import { C, person, CAST, blinkAt, pose, lerp, swing, sheet, shade, mix } from '../kit.js';
import { es, ease, bump } from '../../core/anim.js';
import { capSet, TWELVE, KING, PRINCES, STRANGERS, throne, crown, coin, taxChest, archFlat, hang2, bubble, nameTag, spark, withFace, kf, tr } from './lib.js';

const X0 = 480, X1 = 1120, FLOOR = 650, CEIL = 300;
const FX = 800, FY = 478;          // the flat's bottom centre, at rest
const FW = 560, FH = 300;

export default {
  id: 'mt17-kings',
  beats: [
    { v: 25, cont: true, text: 'Gdy wszedł do domu, Jezus uprzedził go, mówiąc: «Szymonie, jak ci się zdaje?' },
    { v: 25, cont: true, text: 'Od kogo królowie ziemscy pobierają daniny lub podatki?' },
    { v: 25, cont: true, text: 'Od synów swoich czy od obcych?»' },
    { v: 26 },
  ],
  cam: { x: [-30, 30], y: [-40, 50], z: [1, 1.14] },
  build(S) {
    const set = capSet(S, { house: true, X0, X1, FLOOR, CEIL });
    const c = set.c, H = set.H;

    /* ---------- inside ---------- */
    const inL = S.layer({ par: 0.4, sh: 4 });
    const SEATS = [[900, 0.82], [966, 0.8], [1030, 0.78], [560, 0.78]];
    const OTHERS = [TWELVE[3], TWELVE[1], TWELVE[2], TWELVE[6]].map((d, i) => ({ ...d, i, x: SEATS[i][0], s: SEATS[i][1], seed: c.rr(0, 9), p: S.puppet(inL.add(person(c, { ...d.o, pose: 'kneel' }))) }));
    const jesus = S.puppet(inL.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const peter = S.puppet(inL.add(person(c, CAST.peter)));
    const pSit = S.puppet(inL.add(person(c, { ...CAST.peter, pose: 'kneel' })));
    const sonsLight = inL.add(`<g opacity="0"><circle r="120" fill="url(#halo-glow)"/></g>`);
    const frontL = S.layer({ par: 0.4, sh: 5 });
    frontL.add(H.front + H.stairs);
    /* ---------- the painted flat: a king of the earth ---------- */
    const flatL = S.layer({ par: 0.3, sh: 5 });
    const talkL = S.layer({ par: 0.42, sh: 5 });
    const jAsk = talkL.add(`<g opacity="0">${bubble(c, [tr('Szymonie,', 'Simon,'), tr('jak ci się zdaje?', 'what do you think?')], { size: 19, tail: -1 })}</g>`);
    const pSays = talkL.add(`<g opacity="0">${bubble(c, tr('Od obcych.', 'From strangers.'), { size: 19, tail: 1 })}</g>`);
    const jFree = talkL.add(`<g opacity="0">${bubble(c, [tr('A zatem synowie', 'Then the sons'), tr('są wolni.', 'are free.')], { size: 19, tail: -1 })}</g>`);
    const pOpen = talkL.add(`<g opacity="0">${bubble(c, '…', { size: 20, w: 46, tail: 1 })}</g>`);

    const board = flatL.add(`<g>${hang2(archFlat(c, { w: FW, h: FH, bg: mix(C.parchment, C.lavender, 0.18) }).back, FW * 0.36, 700)}</g>`);
    const floorStrip = flatL.add(`<g>${sheet().p(c.cut([[-FW / 2 + 4, -40], [FW / 2 - 4, -40], [FW / 2 - 4, -2], [-FW / 2 + 4, -2]], 0.4, 8), mix(C.sand2, C.stone2, 0.3)).x(c.ribbon([[-FW / 2 + 10, -34], [FW / 2 - 10, -34]], 2), C.haloRim, 'opacity=".6"').out()}</g>`);
    const thr = flatL.add(`<g transform="scale(.36)">${throne(c)}</g>`);
    const king = S.puppet(flatL.add(person(c, { ...KING, pose: 'sit' })));
    const kCrown = flatL.add(`<g>${crown(c)}</g>`);
    const chest = flatL.add(`<g>${taxChest(c, 64)}</g>`);
    const princes = PRINCES.map((o, i) => ({ i, p: S.puppet(flatL.add(person(c, o))), cr: flatL.add(`<g transform="scale(.7)">${crown(c, C.haloRim)}</g>`) }));
    const strangers = STRANGERS.map((o, i) => ({ i, p: S.puppet(flatL.add(person(c, o))), gift: flatL.add(`<g>${i === 1 ? `<path d="${c.cut([[-9, 0], [-11, -18], [-6, -24], [6, -24], [11, -18], [9, 0]], 0.3, 4)}" fill="${C.pot}"/>` : coin(c, 7)}</g>`) }));
    const falling = [0, 1, 2].map((i) => flatL.add(`<g opacity="0">${coin(c, 6)}</g>`));
    const tagSons = flatL.add(`<g opacity="0">${nameTag(c, tr('synowie', 'sons'), { size: 15 })}</g>`);
    const tagStr = flatL.add(`<g opacity="0">${nameTag(c, tr('obcy', 'strangers'), { size: 15 })}</g>`);
    const freeSparks = [0, 1, 2, 3].map((i) => flatL.add(`<g opacity="0">${spark(c, 7)}</g>`));

    return (t, time) => {
      const T = time;
      set.update(T);

      /* Peter comes in; Jesus speaks first */
      const dx = (H.door[0] + H.door[1]) / 2;
      const inW = es(t, 0.02, 0.4);
      const sitP = es(t, 1.0, 1.06);
      const px = lerp(dx, 690, inW);
      const pointStr = es(t, 3.05, 3.25) * (1 - es(t, 3.6, 3.75));
      peter.set({ x: px, y: lerp(FLOOR - 6, 640, inW), s: lerp(0.8, 0.86, inW), o: 1 - sitP, walk: inW > 0 && inW < 1 ? inW * 40 : undefined, armF: 12 + bump(t, 0.35, 0.6) * 50, head: -2, blink: blinkAt(T, 2) });
      pSit.set({ x: 690, y: 640, s: 0.86, o: sitP, armF: 30 + pointStr * 80 + es(t, 3.6, 3.8) * 20, armB: 10 + bump(t, 1.2, 2.9) * 20, head: -10 + pointStr * 4, blink: blinkAt(T, 2) });
      pose(pOpen, { x: px + 20, y: 400, s: es(t, 0.35, 0.45, ease.back), o: bump(t, 0.33, 0.62) > 0.05 ? 1 : 0 });
      const ask = es(t, 0.45, 0.6);
      const toFlat = es(t, 1.05, 1.3) * (1 - es(t, 3.0, 3.1));
      jesus.set({ x: 800, y: 630, s: 0.96, flip: ask > 0.5 && t < 1.1 ? true : (t > 3.6 ? true : false), armF: 20 + ask * 50 * (1 - es(t, 0.95, 1.1)) + toFlat * 60 + es(t, 3.6, 3.85) * 40, armB: 10 + toFlat * 40 + bump(t, 2.05, 2.95) * 40, head: -2 + toFlat * -8, blink: blinkAt(T, 1) });
      pose(jAsk, { x: 890, y: 402, s: es(t, 0.5, 0.68, ease.back), o: bump(t, 0.48, 1.0) > 0.05 ? 1 : 0 });
      pose(pSays, { x: 610, y: 440, s: es(t, 3.08, 3.25, ease.back), o: t > 3.05 && t < 3.6 ? 1 : 0 });
      pose(jFree, { x: 900, y: 402, s: es(t, 3.6, 3.78, ease.back), o: t > 3.58 ? 1 : 0 });
      OTHERS.forEach((d) => d.p.set({ x: d.x, y: 640, s: d.s, flip: d.x > 800, armF: 30, head: -6 + toFlat * -8, blink: blinkAt(T, d.seed) }));

      /* the painted flat */
      const fl = es(t, 1.02, 1.35, ease.back);
      const fy = lerp(FY - 1300, FY, fl);
      const fo = fl > 0.001 ? 1 : 0;
      const sway = Math.sin(T * 0.7) * 1.5 * fl;
      pose(board, { x: FX + sway, y: fy, o: fo });
      pose(floorStrip, { x: FX + sway, y: fy, o: fo });
      pose(thr, { x: FX + sway, y: fy - 36, o: fo });
      king.set({ x: FX + sway, y: fy - 40, s: 0.46, o: fo, armF: 30 + bump(t, 1.3, 1.95) * 50 + es(t, 3.05, 3.3) * 40, armB: 20, head: -4, blink: blinkAt(T, 7) });
      pose(kCrown, { x: FX + sway + 1, y: fy - 40 - (167 - 62) * 0.46 - 9, s: 0.62, o: fo });
      const toll = es(t, 1.35, 1.9);
      pose(chest, { x: FX + 76 + sway, y: fy - 38, s: 0.8, o: fo });
      // strangers file in (v25c) and pay (v26)
      strangers.forEach((m) => {
        const x = FX + sway + lerp(170 + m.i * 50, 120 + m.i * 50, es(t, 1.35 + m.i * 0.1, 1.85 + m.i * 0.1));
        const pay = m.i === 0 ? es(t, 3.3, 3.6) : 0;
        m.p.set({ x, y: fy - 40, s: 0.44, flip: true, o: fo, walk: t > 1.35 && t < 1.95 + m.i * 0.1 ? x * 0.08 : undefined, armF: 60 - pay * 10, armB: 10, head: -4, blink: blinkAt(T, m.i + 3) });
        const [gx, gy] = [x - 28 * 0.44 * 2, fy - 40 - 90 * 0.44];
        pose(m.gift, { x: gx, y: gy, s: 0.9, o: fo * (m.i === 0 ? 1 - es(t, 3.55, 3.6) : 1) });
      });
      falling.forEach((el, i) => {
        const k = es(t, 3.45 + i * 0.1, 3.7 + i * 0.1);
        pose(el, { x: FX + 76 + sway + (i - 1) * 4, y: fy - 110 + k * 40, o: k > 0 && k < 1 ? 1 : 0 });
      });
      // the sons: they stand by the throne (v25d) and go free (v26)
      const free = es(t, 3.65, 3.98);
      princes.forEach((m) => {
        const on = es(t, 2.05 + m.i * 0.1, 2.3 + m.i * 0.1);
        const x = FX + sway - 92 - m.i * 48 - free * 60;
        m.p.set({ x, y: fy - 40 - bump(t, 3.7 + m.i * 0.06, 3.95 + m.i * 0.06) * 12, s: 0.42, flip: free > 0.02 && free < 0.98, o: fo * on, walk: free > 0.02 && free < 0.98 ? x * 0.1 : undefined, armF: 20 + free * 90, armB: free * 120, head: -4, blink: blinkAt(T, m.i + 5) });
        pose(m.cr, { x: x + 1, y: fy - 40 - 167 * 0.42 - 6, s: 0.7 * 0.42 / 0.42, o: fo * on });
      });
      freeSparks.forEach((el, i) => {
        const on = es(t, 3.7 + i * 0.05, 3.9 + i * 0.05, ease.back);
        pose(el, { x: FX + sway - 150 - free * 60 + (i - 1.5) * 34, y: fy - 150 - (i % 2) * 20, s: on, o: on });
      });
      pose(tagSons, { x: FX + sway - 116, y: fy - 36, o: es(t, 2.25, 2.4) * (1 - es(t, 3.6, 3.75)) });
      pose(tagStr, { x: FX + sway + 190, y: fy - 36, o: es(t, 2.35, 2.5) * (1 - es(t, 3.6, 3.75)) });
      pose(sonsLight, { x: 745, y: 580, s: 0.8 + free * 0.4, o: free * 0.7 });

      S.cam.z = 1.02 + es(t, 0, 0.5) * 0.06 - es(t, 1.0, 1.4) * 0.05 + es(t, 3.55, 3.9) * 0.02;
      S.cam.y = 10 + es(t, 0, 0.5) * 20 - es(t, 1.0, 1.4) * 40 + es(t, 3.55, 3.9) * 20;
      S.cam.x = kf(t, [[0, -20], [0.6, 0]]);
    };
  },
};
