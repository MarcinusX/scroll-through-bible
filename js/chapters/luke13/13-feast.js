// Łk 13,28–30 — a painted flat of the banquet of the Kingdom: on a hill in golden light a long table is laid; at its
// middle Abraham, Isaac and Jacob, and beside them the prophets — Moses, Isaiah, Elijah. "There will be weeping and
// gnashing of teeth, when you see them in the kingdom of God and yourselves thrown out": darkness closes round the
// lit hill, and out in it, in front, those left outside hide their faces and weep. "They will come from the east and
// the west, from the north and the south": a compass hangs over the hill and people stream in on four roads — from
// both sides, over the crest behind, and up the path from the front — and sit down at the table. "Some are last who
// will be first, and some are first who will be last": in front of the table a line of guests waits at a lit opening,
// the rich man at its head, a lame beggar at its tail — then the light moves to the other end, they all turn about,
// and the beggar steps first into the light, while the rich man is last.
import { C, person, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { band, olive, grass, flowers } from '../../assets/nature.js';
import { makeCutter } from '../../core/paper.js';
import { L12, ISAIAH, MOSES, L9, knot, still, folk, hungWord, loaf, cup, stick, headAt, kf, onString, es, ease, bump, seg, tr, PI, FONT } from './lib.js';

const TY = 590, CX = 800;
const RICH = { robe: C.plumRobe, mantle: C.sun, mantleArm: true, hairStyle: 'wrap', veil: C.cream, veil2: C.sun, beard: 'full', hair: C.hair3, skin: C.skin2, belt: C.sun };
const POOR = { robe: mix(C.stone2, C.rock2, 0.3), hairStyle: 'wild', hair: C.greyHair, beard: 'wild', beardColor: C.greyHair, skin: C.skin3, belt: C.rope };
const OUT = [
  { robe: C.dustyBlue, mantle: C.clayMantle, hairStyle: 'wrap', veil: C.linen2, beard: 'full', hair: C.hair3, skin: C.skin2, belt: C.leather },
  { robe: C.mauve, hairStyle: 'veil', veil: C.stone, veil2: C.stone2, hair: C.hair, skin: C.skin },
  { robe: C.ochreRobe, mantle: C.tealRobe, hairStyle: 'short', beard: 'short', hair: C.hair2, skin: C.skin3 },
];
// the line in front of the table: slots from its head (0, right, at the lit opening) to its tail (4, left)
const QY = 742;
const SLOT = [1000, 900, 800, 700, 600];

function compass(c) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, 54, 30), 0.4, 5), C.haloRim).p(c.cut(c.circ(0, 0, 49, 30), 0.4, 5), C.cream);
  s.p(c.cut(c.star(0, 0, 38, 8, 4, -PI / 2), 0.3, 4), C.ochre);
  s.p(c.cut(c.star(0, 0, 24, 6, 4, -PI / 4), 0.3, 4), shade(C.ochre, -0.2));
  const L = (x, y, t) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="${FONT}" font-size="15" font-style="italic" fill="${C.ink}">${t}</text>`;
  return `<path d="M0 -1600V-54" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${s.out()}${L(0, -30, tr('Pn', 'N'))}${L(0, 42, tr('Pd', 'S'))}${L(34, 5, tr('W', 'E'))}${L(-34, 5, tr('Z', 'W'))}`;
}

export default {
  id: 'lk13-feast',
  enter: 'fly',
  beats: [
    { v: 28 },
    { v: 29 },
    { v: 30 },
  ],
  cam: { x: [-20, 20], y: [0, 60], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    sky(S, ['#ecd3a0', '#f5e2b8', '#faefd6']);
    const glowL = S.layer({ par: 0.06, sh: 0, flat: true });
    glowL.add(`<g transform="translate(${CX} 380)"><circle r="520" fill="url(#halo-glow)" opacity=".75"/></g>`);
    S.layer({ par: 0.12, sh: 2 }).add(band(c, { y: 440, amps: [16, 7, 3], lens: [1000, 360, 120], color: mix(C.hillFar, C.halo, 0.35) }).markup);
    /* the hill, four roads */
    const G = S.layer({ par: 0.3, sh: 3 });
    const gfn = c.wave(500, [10, 4], [800, 220]);
    const gs = sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.hillNear, C.halo, 0.3));
    const road = mix(C.sand, C.cream, 0.4);
    gs.p(c.ribbon([[-900, 680], [0, 640], [360, 600], [560, 580]], (u) => 50 - u * 20, 2) + c.ribbon([[2500, 684], [1600, 642], [1240, 600], [1040, 580]], (u) => 50 - u * 20, 2), road);
    gs.p(c.ribbon([[640, 498], [700, 520], [760, 540]], (u) => 14 + u * 10, 1) + c.ribbon([[800, 1000], [806, 800], [796, 660], [800, 600]], (u) => 70 - u * 36, 2), road);
    G.add(gs.out() + olive(c, 250, 600, 0.9) + olive(c, 1380, 604, 0.85) + grass(c, { x0: -800, x1: 2400, y: 520, fn: gfn, n: 40, h: 12, color: C.moss }) + flowers(c, { x0: 300, x1: 1300, y: 600, n: 20 }));
    /* people coming: sprites that walk the roads */
    const walkL = S.layer({ par: 0.3, sh: 4 });
    const streams = [
      { k: 'w', flip: false, from: [-100, 706], to: [560, 706], s: 0.9 },
      { k: 'e', flip: true, from: [1700, 710], to: [1040, 710], s: 0.9 },
      { k: 'n', flip: false, from: [520, 470], to: [640, 520], s: 0.6 },
      { k: 's', flip: false, from: [800, 1100], to: [800, 780], s: 0.95 },
    ].map((st, i) => ({ ...st, i }));
    const mkStream = (st, L) => { st.sp = L.sprite(knot('lk13-feast-' + st.k, 3, { s: st.s, spread: 36, rows: 1, flip: st.flip }), st.to[0], st.to[1]); };
    streams.filter((st) => st.k === 'n').forEach((st) => mkStream(st, walkL));
    /* the table with the patriarchs and prophets; the guests who sit down with them */
    const tableL = S.layer({ par: 0.32, sh: 4 });
    const seat = (side, seed) => still(makeCutter(seed), Array.from({ length: 3 }, (_, i) => ({ x: side * (250 + i * 72), y: 0, s: 0.86, flip: side > 0, head: -4, armF: 40 + (i % 2) * 30, o: { ...folk(makeCutter(`${seed}${i}`), null), pose: 'sit' } })));
    const seatedL = tableL.sprite(seat(-1, 'lk13-fs-l'), CX, TY - 6);
    const seatedR = tableL.sprite(seat(1, 'lk13-fs-r'), CX, TY - 6);
    const PAT = [[L12.isaac, CX - 84, false], [L12.abraham, CX, false], [L12.jacob, CX + 84, true], [MOSES, CX - 168, false], [ISAIAH, CX + 168, true]]
      .map(([o, x, flip], i) => ({ i, x, flip, p: S.puppet(tableL.add(person(c, { ...o, pose: 'sit' }))) }));
    const tab = sheet();
    tab.p(c.cut([[-470, -52], [470, -52], [462, -34], [-462, -34]], 0.4, 8), C.linen);
    tab.p(c.cut([[-462, -34], [462, -34], [450, 14], [-450, 14]], 0.5, 8), mix(C.wood3, C.sun, 0.2));
    tab.x(c.ribbon([[-450, -28], [450, -28]], 3), C.ochre, 'opacity=".6"');
    let food = '';
    [-380, -250, -120, 120, 250, 380].forEach((x, i) => { food += `<g transform="translate(${x} -54)">${i % 2 ? loaf(c, 16) : `<g transform="scale(.7)">${cup(c)}</g>`}</g>`; });
    tableL.add(`<g transform="translate(${CX} ${TY + 10})">${tab.out()}${food}</g>`);
    const walkF = S.layer({ par: 0.32, sh: 4 });
    streams.filter((st) => st.k !== 'n').forEach((st) => mkStream(st, walkF));
    /* the darkness outside, the ones thrown out */
    const dark = S.layer({ par: 0.34, sh: 1, flat: true });
    dark.add(`<path d="${c.cut([[-3000, -3000], [5000, -3000], [5000, 5000], [-3000, 5000]], 0, 400) + c.hole(c.blob(CX, 470, 560, 250, 30, 0.04), 1.5, 10)}" fill="#1b1a33"/>`);
    dark.fade(0);
    const outL = S.layer({ par: 0.5, sh: 5 });
    const outs = OUT.map((o, i) => ({ i, p: S.puppet(outL.add(person(c, { ...o, pose: 'kneel' }))), x: [480, 1110, 1200][i], y: 780 + (i % 2) * 10 }));
    const tears = Array.from({ length: 6 }, (_, i) => ({ i, el: outL.add(`<g opacity="0"><path d="${c.cut([[0, -6], [3, 1], [0, 4], [-3, 1]], 0.1, 2)}" fill="${C.skyVeil}"/></g>`) }));
    /* the line that turns about */
    const line = S.layer({ par: 0.5, sh: 0, flat: true });
    const lineP = S.layer({ par: 0.5, sh: 5 });
    const Q = [RICH, OUT[0], OUT[1], OUT[2], POOR].map((o, i) => ({ i, p: S.puppet(lineP.add(person(c, { ...(i > 0 && i < 4 ? folk(makeCutter('lk13-q' + i), null) : o), holdF: i === 4 ? `<g transform="rotate(-10)">${stick(c, 96)}</g>` : '' }))) }));
    const lightR = line.add(`<g opacity="0"><ellipse rx="90" ry="150" fill="url(#halo-glow)"/></g>`);
    const lightL = line.add(`<g opacity="0"><ellipse rx="90" ry="150" fill="url(#halo-glow)"/></g>`);
    /* labels */
    const fx = S.layer({ par: 0.3, sh: 6 });
    const names = fx.add(`<g>${hungWord(c, tr('Abraham · Izaak · Jakub · prorocy', 'Abraham · Isaac · Jacob · the prophets'), { size: 20 })}</g>`);
    const comp = fx.add(`<g>${compass(c)}</g>`);

    return (t, time) => {
      const T = time;
      /* v28 — the patriarchs and prophets at the table; those outside, in the dark, weeping */
      PAT.forEach((p) => {
        const welcome = p.i === 1 ? es(t, 2.5, 2.7) : 0;
        p.p.set({ x: p.x, y: TY - 6, s: 0.92, flip: p.flip || welcome > 0.5, armF: 30 + (p.i % 2) * 20 + welcome * 50, armB: 10 + (p.i === 1 ? bump(t, 1.2, 1.9) * 80 : 0), head: -4 + welcome * 10, blink: blinkAt(T, p.i) });
      });
      const nk = es(t, 0.05, 0.3, ease.out) * (1 - es(t, 1.0, 1.2, ease.in));
      pose(names, { x: CX, y: lerp(-900, 260, nk) });
      const dk = es(t, 0.3, 0.6) * (1 - es(t, 1.0, 1.3));
      dark.fade(dk * 0.9);
      outs.forEach((o) => {
        const k = es(t, 0.25 + o.i * 0.05, 0.45 + o.i * 0.05);
        o.p.set({ x: o.x, y: o.y, s: 1.06, flip: o.x > 800, armF: 40 + k * 92, armB: 20 + k * 10, head: 10 + k * 22, lean: k * 10, o: 1 - es(t, 1.05, 1.25), blink: 0 });
      });
      tears.forEach((tr_, i) => {
        const o = outs[i % 3];
        const k = ((T ? T * 1.2 : t * 3) + i / 6) % 1;
        const [hx, hy] = headAt(o.x, o.y, 1.06, o.x > 800, 46);
        pose(tr_.el, { x: hx + (o.x > 800 ? -10 : 10), y: hy + 12 + k * 30, o: t > 0.5 && t < 1.05 ? Math.sin(k * PI) : 0 });
      });

      /* v29 — from east and west, north and south, they come and sit down */
      const ck = es(t, 1.05, 1.3, ease.out) * (1 - es(t, 2.0, 2.2, ease.in));
      pose(comp, { x: CX, y: lerp(-900, 250, ck) + (T ? Math.sin(T * 0.8) * 2 : 0), r: T ? Math.sin(T * 0.5) * 3 : 0 });
      streams.forEach((st) => {
        const k = es(t, 1.05 + st.i * 0.03, 1.96);
        st.sp.set({ x: lerp(st.from[0], st.to[0], k), y: lerp(st.from[1], st.to[1], k) - (k > 0 && k < 1 ? Math.abs(Math.sin(k * 30)) * 3 : 0), o: k > 0.001 ? 1 - es(t, 1.9, 1.98) : 0 });
      });
      const sit = es(t, 1.45, 1.6);
      seatedL.set({ x: CX, y: TY - 6, o: sit });
      seatedR.set({ x: CX, y: TY - 6, o: sit });

      /* v30 — the last first and the first last: the light moves to the other end of the line, they turn about */
      const inQ = es(t, 2.0, 2.15);
      const turn = es(t, 2.3, 2.36);
      const go = es(t, 2.4, 2.66);
      pose(lightR, { x: 1110, y: QY - 110, o: inQ * (1 - es(t, 2.2, 2.34)) });
      pose(lightL, { x: 470, y: QY - 110, o: es(t, 2.22, 2.36) });
      Q.forEach((q) => {
        const x = SLOT[q.i] - (q.i === 4 ? go * 110 : go * 16);
        q.p.set({ x, y: QY, s: 1.0, flip: turn > 0.5, walk: (go > 0.02 && go < 0.98 && q.i === 4) || (inQ > 0.02 && inQ < 0.98) ? x * 0.05 : undefined, armF: 20, armB: 10 + (q.i === 4 ? es(t, 2.6, 2.72) * 140 : 0), head: q.i === 0 ? -4 + es(t, 2.4, 2.6) * 20 : -4, o: inQ, blink: blinkAt(T, q.i + 3) });
      });
      S.cam.x = 0;
      S.cam.y = kf(t, [[0, 30], [1.0, 30], [2.0, 50], [3, 50]]);
      S.cam.z = kf(t, [[0, 1.04], [1.0, 1.04], [2.0, 1.08]]);
    };
  },
};
