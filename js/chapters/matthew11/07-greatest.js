// Mt 11,11 — a painted flat: a row of stone plinths rises out of the meadow, and on them the great ones of Israel,
// each a child of a mother: Abraham, Moses with the tablets, David with his harp, Elijah — and in the middle, highest
// of all, John. "None greater born of women." Then the clouds above open on the golden gate of the Kingdom, and on
// its threshold, higher still, stands a small child in the light — "the least in the Kingdom of Heaven". John looks
// up, bows, and lifts his hand towards the child.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { cloud } from '../../assets/nature.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { hillsSet, JOHN_B, ABRAHAM, MOSES, DAVID, L9, plinth, nameTag, lawTablets, harp, kingdomGate, gateDoor, kid, sparkle, headAt, HEAVEN, tr, PI } from './lib.js';

const GND = 800;
const P = [
  { k: 'abraham', x: 450, top: 650, o: ABRAHAM, name: ['Abraham', 'Abraham'] },
  { k: 'moses', x: 600, top: 606, o: MOSES, name: ['Mojżesz', 'Moses'], hold: 'tablets' },
  { k: 'david', x: 1000, top: 606, o: DAVID, name: ['Dawid', 'David'], hold: 'harp', flip: true },
  { k: 'elijah', x: 1150, top: 650, o: L9.elijah, name: ['Eliasz', 'Elijah'], flip: true },
];
const JX = 800, JT = 530;          // John's plinth
const GX = 800, GT = 300;          // the gate's threshold (the child stands here)

export default {
  id: 'mt11-greatest',
  enter: 'fly',
  beats: [
    { v: 11, text: 'Zaprawdę, powiadam wam: Między narodzonymi z niewiast nie powstał większy od Jana Chrzciciela.' },
    { v: 11, cont: true, text: 'Lecz najmniejszy w królestwie niebieskim większy jest niż on.' },
  ],
  cam: { x: [-20, 20], y: [-260, 40], z: [0.96, 1.2] },
  build(S) {
    const H = hillsSet(S, { skyCols: ['#cfdcd8', '#f1e6cc', '#f7e6c6'], sky2: HEAVEN, lake: false, gy: 740, midY: 560, villages: false, clouds: false });
    const c = H.c;

    /* the heavens opening: a golden glow and the gate on its cloud */
    const heavenL = S.layer({ par: 0.25, sh: 5, rise: 0 });
    const shine = heavenL.add(`<g><circle r="420" fill="url(#warm-glow)"/><circle r="220" fill="url(#halo-glow)"/></g>`);
    const G = kingdomGate(c, 190, 250);
    const gate = heavenL.add(`<g>${G.light}${G.frame}</g>`);
    const doorL = heavenL.add(`<g>${gateDoor(c, 95, 196)}</g>`);
    const doorR = heavenL.add(`<g><g transform="scale(-1 1)">${gateDoor(c, 95, 196)}</g></g>`);
    const cloudBed = heavenL.add(`<g>${cloud(c, 380, C.cream, mix(C.halo, C.cream, 0.4))}</g>`);
    const child = S.puppet(heavenL.add(kid(c, 1, { robe: C.linen })));
    const sparks = [0, 1, 2, 3, 4].map((i) => heavenL.add(`<g>${sparkle(c, 14, i % 2 ? C.star : C.halo)}</g>`));
    const parting = [0, 1].map((i) => heavenL.add(`<g>${cloud(c, 420, C.cream, '#eadcc0')}</g>`));

    /* the plinths and the great ones */
    const L = S.layer({ par: 0.45, sh: 4 });
    const act = S.layer({ par: 0.45, sh: 5 });
    const tags = S.layer({ par: 0.45, sh: 3 });
    const tabl = `<g transform="translate(0 34) rotate(180) scale(.5)">${lawTablets(c, { w: 40, h: 56 })}</g>`;
    const harpM = `<g transform="translate(4 30) rotate(160) scale(.55)">${harp(c)}</g>`;
    const ones = P.map((p, i) => ({
      ...p, i,
      pl: L.add(`<g>${plinth(c, 130, GND - p.top + 60, mix(C.stone, C.sand, 0.2 + i * 0.05))}</g>`),
      pp: S.puppet(act.add(person(c, { ...p.o, holdF: p.hold === 'tablets' ? tabl : p.hold === 'harp' ? harpM : '' }))),
      tag: tags.add(`<g>${nameTag(c, tr(p.name[0], p.name[1]), { size: 16 })}</g>`),
    }));
    const jPl = L.add(`<g>${plinth(c, 150, GND - JT + 60, mix(C.stone, C.halo, 0.25))}</g>`);
    const jGlow = act.add(`<circle r="150" fill="url(#halo-glow)" opacity="0"/>`);
    const john = S.puppet(act.add(person(c, JOHN_B)));
    const jTag = tags.add(`<g>${nameTag(c, tr('Jan Chrzciciel', 'John the Baptist'), { size: 16 })}</g>`);

    return (t, time) => {
      const T = time;
      H.update(T);
      H.sk2.fade(es(t, 1.0, 1.35));

      /* v11a — the plinths rise, John's the highest */
      const riseAt = (a) => es(t, a, a + 0.3, ease.out);
      ones.forEach((o) => {
        const k = riseAt(0.05 + o.i * 0.07);
        const top = lerp(GND + 40, o.top, k);
        pose(o.pl, { x: o.x, y: top });
        o.pp.set({ x: o.x, y: top, s: 0.82, flip: !!o.flip, armF: o.hold ? 60 : 20, armB: 10 + bump(t, 1.35, 1.9) * 40, head: -es(t, 1.2, 1.4) * 12 * (1 - es(t, 1.5, 1.7)), blink: blinkAt(T, o.i + 2), o: k > 0.02 ? 1 : 0 });
        pose(o.tag, { x: o.x, y: top + 8, o: k > 0.5 ? 1 : 0 });
      });
      const kj = riseAt(0.35);
      const jtop = lerp(GND + 40, JT, kj);
      pose(jPl, { x: JX, y: jtop });
      const up = es(t, 1.25, 1.45);
      const bow = es(t, 1.45, 1.65);
      john.set({ x: JX, y: jtop, s: 0.9, flip: false, armF: 20 + up * 50 + bow * 40, armB: 20 + up * 120 * (1 - bow) + bow * 40, head: -up * 22 * (1 - bow) + bow * 10, lean: bow * 8, blink: blinkAt(T, 1), o: kj > 0.02 ? 1 : 0 });
      pose(jTag, { x: JX, y: jtop + 8, o: kj > 0.5 ? 1 : 0 });
      pose(jGlow, { x: JX, y: jtop - 100, s: 1, o: es(t, 0.55, 0.75) * 0.8 * (1 - es(t, 1.4, 1.7) * 0.5) });

      /* v11b — the clouds part: the gate, and the least in the Kingdom on its threshold */
      const open = es(t, 1.02, 1.3);
      parting.forEach((p, i) => pose(p, { x: GX + (i ? 1 : -1) * (120 + open * 520), y: GT - 60 + (i ? 20 : 0), s: 1.1, o: 1 - seg(open, 0.7, 1) }));
      pose(shine, { x: GX, y: GT - 100, s: 0.7 + open * 0.4, o: open });
      pose(gate, { x: GX, y: GT, s: 0.9, o: open > 0.02 ? 1 : 0 });
      const doors = es(t, 1.2, 1.4);
      pose(doorL, { x: GX - 86, y: GT, sx: 0.9 * (1 - doors * 0.8), sy: 0.9, o: open > 0.02 ? 1 : 0 });
      pose(doorR, { x: GX + 86, y: GT, sx: 0.9 * (1 - doors * 0.8), sy: 0.9, o: open > 0.02 ? 1 : 0 });
      pose(cloudBed, { x: GX, y: GT + 16, s: 1, o: open > 0.02 ? 1 : 0 });
      const ck = es(t, 1.3, 1.45);
      child.set({ x: GX, y: GT - 2, s: 0.66, armF: 30 + ck * 40, armB: 20 + ck * 120, head: -6, blink: blinkAt(T, 4), o: ck });
      sparks.forEach((sp, i) => {
        const k = bump(t, 1.35 + i * 0.05, 1.95);
        const a = (i / 5) * PI * 2 + (T ? T * 0.3 : 0);
        pose(sp, { x: GX + Math.cos(a) * 70, y: GT - 70 + Math.sin(a) * 50, s: k, r: T * 40, o: k });
      });

      S.cam.y = lerp(30, -150, es(t, 1.0, 1.35));
      S.cam.z = lerp(1.06, 1.0, es(t, 1.0, 1.35));
    };
  },
};
