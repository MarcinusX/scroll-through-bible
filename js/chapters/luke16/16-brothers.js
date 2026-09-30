// Łk 16,27–31 — the world beyond death, the chasm between. "He said: I beg you then, father, send him to my father's
// house": the rich man on his knees stretches out his hands, and a round picture comes down over the chasm: his
// father's house, lit for a feast. "For I have five brothers — that he may warn them, so that they also will not come
// to this place of torment": in the picture the five brothers sit at the table in purple like his; a little figure in
// white starts along a dotted golden way from Abraham's side towards the house. "But Abraham said: They have Moses and
// the Prophets; let them listen to them": the way fades; the tablets of the Law and the scroll of the Prophets hang on
// either side of the picture, shining. "No, father Abraham, but if someone goes to them from the dead, they will
// repent": the picture changes — a man in white at their door, and the five on their knees before him. "He said to
// him: If they do not listen to Moses and the Prophets, neither will they be convinced if someone should rise from the
// dead": the picture changes back — the man in white still stands at the door, and the five have turned their backs on
// him and lifted their cups again; and far off, on the right, a last small picture comes down: a tomb in a garden at
// dawn, its stone rolled away.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { afterSet, AF, RICH_DEAD, LAZ_BLEST, ABRAHAM, BROTHERS, roundel, figure, lawTablets, say, label, glow, tombIcon, headAt, kf, tr, es, ease, bump, seg, PI, STRING, FONT } from './lib.js';

const HY = AF.HY;
const VX = 820, VY = 250, VR = 112;        // the vision of the father's house
const EX = 990, EY = 400, ER = 64;        // the empty tomb at dawn

/** the father's house, inside (vision coords): 'feast' | 'kneel' | 'turned' */
function house(S, c, mode) {
  const R = VR;
  let m = `<rect x="${-R}" y="${-R}" width="${2 * R}" height="${2 * R}" fill="${mix(C.plaster, C.dusk, 0.3)}"/>`;
  m += `<circle cx="-20" cy="-30" r="120" fill="url(#warm-glow)" opacity=".7"/>`;
  m += sheet().p(c.cut([[-R, 50], [R, 48], [R, R], [-R, R]], 0.4, 8), mix(C.stone, C.sand2, 0.35)).out();
  // purple hangings, a lamp
  m += sheet().p(c.cut([[-96, -80], [-60, -80], [-64, 20], [-92, 20]], 0.5, 5) + c.cut([[-10, -84], [26, -84], [22, 16], [-6, 16]], 0.5, 5), mix(C.plumRobe, C.curtain2, 0.35)).out();
  // the door on the right
  const lit = mode !== 'feast';
  m += sheet().p(c.cut([[60, 52], [60, -40], ...c.arc(82, -40, 22, 18, PI, 2 * PI, 8), [104, -40], [104, 52]], 0.3, 5), lit ? '#fff3cf' : mix(C.soilRich, C.plumRobe, 0.3)).out();
  if (lit) {
    m += `<circle cx="82" cy="0" r="46" fill="url(#halo-glow)"/>`;
    m += figure(c, { ...LAZ_BLEST }, { x: 82, y: 52, s: 0.38, flip: true, armF: mode === 'kneel' ? 70 : 40, armB: 20, head: 4 });
  }
  // the table and the five
  if (mode !== 'kneel') m += sheet().p(c.cut([[-92, 28], [30, 28], [28, 36], [-90, 36]], 0.3, 5), C.wood).p(c.cut([[-94, 24], [32, 24], [34, 40], [-96, 42]], 0.4, 5), C.linen).out();
  BROTHERS.forEach((o, i) => {
    const x = -84 + i * 26;
    if (mode === 'kneel') m += figure(c, { ...o, pose: 'kneel' }, { x: -60 + i * 24, y: 58 + (i % 2) * 4, s: 0.3, armF: 60, armB: 90, head: 10 });
    else m += figure(c, { ...o, pose: 'sit' }, { x, y: 50, s: 0.3, flip: mode === 'turned' ? true : i % 2 === 1, armF: mode === 'turned' ? 110 : 40 + (i % 3) * 20, armB: 10, head: mode === 'turned' ? -4 : 0 });
  });
  return m;
}
/** the tomb in the garden at dawn (vision coords) */
function dawnTomb(S, c) {
  const R = ER;
  let m = `<rect x="${-R}" y="${-R}" width="${2 * R}" height="${2 * R}" fill="${mix(C.dawn, C.skyBlue, 0.3)}"/><circle cx="30" cy="10" r="60" fill="url(#warm-glow)"/>`;
  m += sheet().p(c.cut([[-R, 30], [R, 24], [R, R], [-R, R]], 0.4, 6), mix(C.hillNear, C.sand, 0.3)).out();
  m += `<g transform="translate(-4 34) scale(1.3)">${tombIcon(c, { open: true })}</g>`;
  return m;
}

export default {
  id: 'lk16-brothers',
  parable: true,
  beats: [
    { v: 27 },
    { v: 28 },
    { v: 29 },
    { v: 30 },
    { v: 31 },
  ],
  cam: { x: [-30, 40], y: [-30, 60], z: [1, 1.06] },
  build(S) {
    const A = afterSet(S);
    const c = A.c;
    const abr = S.puppet(A.abr.add(person(c, { ...ABRAHAM, pose: 'sit' })));
    const laz = S.puppet(A.abr.add(person(c, { ...LAZ_BLEST, pose: 'sit' })));
    const rich = S.puppet(A.act.add(person(c, { ...RICH_DEAD, pose: 'kneel' })));
    /* the vision and its three states */
    const frame = (inner, id, r) => `<path d="M0 -1600V${-r - 7}" stroke="${STRING}" stroke-width="1.2" fill="none"/>${roundel(c, inner, { r, id: S.id(id) })}`;
    const V = ['feast', 'kneel', 'turned'].map((m) => A.fly.add(`<g opacity="0">${frame(house(S, c, m), 'v' + m, VR)}</g>`));
    const five = A.fly.add(`<g opacity="0">${label(c, tr('pięciu braci', 'five brothers'), { size: 17 })}</g>`);
    const law = A.fly.add(`<g opacity="0"><path d="M0 -1600V-100" stroke="${STRING}" stroke-width="1.2" fill="none"/><circle cy="-50" r="70" fill="url(#halo-glow)"/><g transform="scale(.8)">${lawTablets(c)}</g><g transform="translate(0 24)">${label(c, tr('Mojżesz', 'Moses'), { size: 16 })}</g></g>`);
    const prophets = A.fly.add(`<g opacity="0"><path d="M0 -1600V-30" stroke="${STRING}" stroke-width="1.2" fill="none"/><circle r="64" fill="url(#halo-glow)"/>${sheet().p(c.cut(c.rect(-34, -22, 68, 44), 0.3, 5), C.parchment).p(c.cut(c.ell(-36, 0, 7, 24, 10), 0.2, 3) + c.cut(c.ell(36, 0, 7, 24, 10), 0.2, 3), C.wood2).x(c.ribbon([[-24, -10], [24, -10]], 1.6) + c.ribbon([[-24, -2], [20, -2]], 1.6) + c.ribbon([[-24, 6], [24, 6]], 1.6), C.ink, 'opacity=".5"').out()}<g transform="translate(0 50)">${label(c, tr('Prorocy', 'the prophets'), { size: 16 })}</g></g>`);
    const tomb = A.fly.add(`<g opacity="0">${frame(dawnTomb(S, c), 'tomb', ER)}</g>`);
    /* the dotted way of the would-be messenger */
    const dots = Array.from({ length: 9 }, (_, i) => ({ i, el: A.W.add(`<g opacity="0"><circle r="4" fill="${C.sun}"/></g>`) }));
    const walker = A.W.add(`<g opacity="0">${figure(c, LAZ_BLEST, { s: 0.3, armF: 20, armB: 10 })}</g>`);
    /* the words */
    const ask = A.W.add(`<g opacity="0">${say(c, [tr('Poślij go do domu', 'Send him to'), tr('mojego ojca!', 'my father’s house!')], { size: 18, side: -1 })}</g>`);
    const ab = null && A.W.add(`<g opacity="0">${say(c, [tr('Mają Mojżesza i Proroków,', 'They have Moses and the prophets.'), tr('niechże ich słuchają!', 'Let them listen to them.')], { size: 17, side: 1 })}</g>`);
    const ask2 = A.W.add(`<g opacity="0">${say(c, [tr('Gdyby kto z umarłych', 'If one goes to them'), tr('poszedł do nich…', 'from the dead…')], { size: 18, side: -1 })}</g>`);

    const pop = (el, k, x, y) => pose(el, { x, y, s: Math.max(0.001, k), o: k > 0.01 ? 1 : 0 });

    return (t, time) => {
      const T = time;
      A.update(t, T, { fl: 1, heatX: AF.RX + 20 });
      const abSpeak = es(t, 2.05, 2.2) * (1 - es(t, 2.95, 3.05)) + es(t, 4.05, 4.2);
      abr.set({ x: AF.AX, y: A.hfn(AF.AX) + 4, s: 0.9, armF: 60, armB: 40 + abSpeak * 110, head: 2, blink: blinkAt(T, 1) });
      laz.set({ x: AF.AX + 52, y: A.hfn(AF.AX + 52) + 8, s: 0.8, armF: 20, armB: 10, head: -4, lean: -8, blink: blinkAt(T, 3) });
      const plead = es(t, 0.05, 0.2) * (1 - es(t, 1.9, 2.05)) + es(t, 3.05, 3.2) * (1 - es(t, 3.95, 4.05));
      const bow = es(t, 4.2, 4.5);
      rich.set({ x: AF.RX + 10, y: HY + 2, s: 1.0, flip: true, armF: 60 + plead * 70 - bow * 30, armB: 80 + plead * 60 - bow * 60, head: -8 + bow * 26, lean: bow * 8, blink: bow > 0.5 ? 0.9 : blinkAt(T, 2) });
      const [rhx, rhy] = headAt(AF.RX + 10, HY + 2, 1.0, true, 'kneel');
      pop(ask, es(t, 0.15, 0.28, ease.back) * (1 - es(t, 0.95, 1.05)), rhx - 16, rhy - 26);
      pop(ask2, es(t, 3.12, 3.25, ease.back) * (1 - es(t, 3.95, 4.05)), rhx - 16, rhy - 26);
      const [ahx, ahy] = headAt(AF.AX, A.hfn(AF.AX) + 4, 0.9, false, 'sit');
      void ahx; void ahy; void ab;
      /* the vision: comes down (v27); kneeling (v30); turned away, and moved aside for the last picture (v31) */
      const dk = es(t, 0.2, 0.5, ease.out);
      const side = 0;
      const vx = VX, vy = lerp(-500, VY, dk), vs = 0.86;
      const k1 = es(t, 3.3, 3.45), k2 = es(t, 4.1, 4.25);
      const sw = T ? Math.sin(T * 0.7) * 0.6 : 0;
      pose(V[0], { x: vx, y: vy, s: vs, r: sw, o: dk > 0.004 ? 1 - k1 : 0 });
      pose(V[1], { x: vx, y: vy, s: vs, r: sw, o: k1 * (1 - k2) });
      pose(V[2], { x: vx, y: vy, s: vs, r: sw, o: k2 });
      const fk = es(t, 1.1, 1.25) * (1 - es(t, 1.95, 2.05));
      pose(five, { x: vx, y: vy + VR * vs + 24, o: fk });
      /* v28 — the messenger's way */
      const way = es(t, 1.2, 1.7) * (1 - es(t, 2.05, 2.25));
      const p0 = [AF.AX + 110, A.hfn(AF.AX + 110) - 6], p1 = [VX - 50, VY + VR * 0.86 - 10];
      dots.forEach((d) => { const u = (d.i + 1) / 10; const x = lerp(p0[0], p1[0], u), y = lerp(p0[1], p1[1], u) - Math.sin(u * PI) * 60; pose(d.el, { x, y, o: way > u ? 1 - es(t, 2.05, 2.25) : 0 }); });
      const wu = es(t, 1.3, 1.8);
      pose(walker, { x: lerp(p0[0], p1[0], wu * 0.5), y: lerp(p0[1], p1[1], wu * 0.5) - Math.sin(wu * 0.5 * PI) * 60, o: way > 0.05 ? way : 0 });
      /* v29 — Moses and the Prophets */
      const lk = es(t, 2.2, 2.5, ease.out);
      const lawX = VX - 160, proX = VX + 160;
      pose(law, { x: lawX, y: lerp(-500, VY + 30, lk), s: 1 - side * 0.2, o: lk > 0.004 ? 1 : 0 });
      pose(prophets, { x: proX, y: lerp(-500, VY, lk), s: 1 - side * 0.2, o: lk > 0.004 ? 1 : 0 });
      /* v31 — the tomb at dawn, its stone rolled away */
      const tk = es(t, 4.3, 4.6, ease.out);
      pose(tomb, { x: EX, y: lerp(-500, EY, tk), r: sw, o: tk > 0.004 ? 1 : 0 });

      S.cam.x = kf(t, [[-0.5, 20], [4.0, 20], [4.4, 0]]);
      S.cam.y = kf(t, [[-0.5, 30], [4.0, 20], [4.4, 0]]);
      S.cam.z = kf(t, [[-0.5, 1.02], [4.0, 1.02], [4.4, 1.0]]);
    };
  },
};
