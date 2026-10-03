// Łk 19,28–31 — the road up the Mount of Olives in the morning, Jerusalem glimpsed far off at the top of the climb.
// Jesus walks on ahead, the disciples following. Tags come down over the villages on the slopes — Bethany behind,
// Bethphage across the ravine — and over the mount itself. He stops, calls two of them, and points to the village
// opposite; a painted plate comes down to show His words: a young colt tied at a door, a sparkle over its bare back —
// no one has ever sat on it. "Untie it and bring it here": the rope drops from the ring. "If anyone asks you, 'Why are
// you untying it?', say this: 'The Lord needs it'": at the door of the plate the owner appears with his question, and
// the answer comes back. The two set off down the path to the village.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { olivetSet, OV, TWELVE, TWO, still, colt, hungPlate, tagOnString, say, question, sparkle, fig, OWNER, headAt, hand, kf, tr, es, ease, bump, seg, PI, mix, shade, sheet, STRING } from './lib.js';
import { house } from '../../assets/nature.js';

const GY = OV.GY, JX = 800;
const PLATE0 = [1010, 340], PR = 124;

export default {
  id: 'lk19-bethphage',
  beats: [
    { v: 28 },
    { v: 29 },
    { v: 30, text: 'mówiąc: «Idźcie do wsi, która jest naprzeciwko, a wchodząc do niej, znajdziecie oślę uwiązane, którego jeszcze nikt nie dosiadł.' },
    { v: 30, cont: true, text: 'Odwiążcie je i przyprowadźcie tutaj!' },
    { v: 31 },
  ],
  cam: { x: [-100, 200], y: [-60, 60], z: [1, 1.16] },
  build(S) {
    const O = olivetSet(S, { cityX: 1420, cityY: 430, cityS: 0.24, sunAt: [300, 150], slopeY: 540, villages: [{ x: 420, n: 6, sc: 0.55 }, { x: 1120, n: 7, sc: 0.6 }] });
    const c = S.c;
    // phone: the plate and the three tags inside the narrow screen
    const PLATE = S.portrait ? [850, 340] : PLATE0;
    const TX3 = S.portrait ? [580, 1040, 790] : [420, 1120, 690];
    /* tags over the villages and the mount */
    const tagL = S.layer({ par: 0.3, sh: 4 });
    const TAGS = [[tr('Betania', 'Bethany'), TX3[0], 430], [tr('Betfage', 'Bethphage'), TX3[1], 420], [tr('Góra Oliwna', 'the Mount of Olives'), TX3[2], 330]].map(([txt, x, y], i) => ({ i, x, y, el: tagL.add(`<g>${tagOnString(c, txt, { size: 18, len: 2400 })}</g>`) }));

    /* Jesus, the disciples (two of them are sent) */
    const A = O.act;
    const rest = A.sprite(still(c, [0, 2, 3, 6, 5, 8].map((k, i) => ({ x: -i * (S.portrait ? 40 : 50), y: (i % 2) * 10 - 6, s: 0.88, head: 2, armF: (i % 3) * 12, o: TWELVE[k].o }))), 560, GY + 6);
    const two = TWO.map((o, i) => ({ i, p: S.puppet(A.add(person(c, o))) }));
    const jesus = S.puppet(A.add(person(c, CAST.jesus)));

    /* the plate of His words: the colt tied at a door in the village */
    const pl = S.layer({ par: 0.3, sh: 5 });
    const plate = pl.add(`<g>${hungPlate(S, c, PR, plateInner(c), { face: mix(C.skyBlue, C.cream, 0.5) })}</g>`);
    const pp = S.layer({ par: 0.3, sh: 3 });
    const rope = pp.add(`<g><path d="${c.ribbon(c.qbez([0, 0], [20, 14], [44, 4], 8), 2.4)}" fill="${C.rope}"/></g>`);
    const ropeLoose = pp.add(`<g><path d="${c.ribbon(c.qbez([0, 0], [4, 20], [2, 34], 8), 2.4)}" fill="${C.rope}"/></g>`);
    const coltEl = pp.add(`<g><g transform="scale(-.36 .36)">${colt(c)}</g></g>`);
    const spk = pp.add(`<g>${sparkle(c, 9)}</g>`);
    const owner = pp.add(`<g>${fig(c, OWNER, { s: 0.36, flip: false, armF: 60, armB: 30, head: 4 })}</g>`);
    const disc = pp.add(`<g>${fig(c, TWO[0], { s: 0.36, flip: true, armF: 50, head: 2 })}</g>`);
    const fx = S.layer({ par: 0.3, sh: 6 });
    const ask = fx.add(`<g>${say(c, tr('Dlaczego odwiązujecie?', 'Why are you untying it?'), { size: 17, side: -1 })}</g>`);
    const need = fx.add(`<g>${say(c, tr('Pan go potrzebuje!', 'The Lord needs it!'), { size: 18, side: 1 })}</g>`);
    const go = O.fx.add(`<g>${say(c, tr(['Idźcie do wsi,', 'która jest naprzeciwko!'], ['Go into the village', 'on the other side!']), { size: 18, side: 1 })}</g>`);
    O.front();

    return (t, time) => {
      const T = time;
      O.update(T, { glow: 0.35 });
      /* v28 — He went on ahead, going up to Jerusalem */
      const JK = [[-0.5, 520], [0.9, JX]];
      const jx = kf(t, JK, ease.out);
      const jw = t < 0.9;
      const turn = es(t, 1.35, 1.45);
      const point = es(t, 2.05, 2.25) * (1 - es(t, 4.6, 4.8));
      jesus.set({ x: jx, y: GY, s: 1.02, flip: turn > 0.5 && point < 0.5, walk: jw ? jx * 0.05 : undefined, armF: 14 + es(t, 1.45, 1.6) * 40 * (1 - point) + point * 80, armB: bump(t, 3.05, 3.9) * 90, head: -point * 4, blink: blinkAt(T) });
      rest.set({ x: lerp(300, 560, es(t, -0.5, 1.1)), y: GY + 6 });
      /* v29 — near Bethphage and Bethany, at the Mount of Olives: He sends two of them */
      TAGS.forEach((g) => { const k = es(t, 1.02 + g.i * 0.1, 1.3 + g.i * 0.1, ease.back); pose(g.el, { x: g.x, y: lerp(-1300, g.y, k), r: T ? Math.sin(T * 0.8 + g.i) * 1.5 : 0, o: k > 0.001 && t < 2.1 ? 1 - es(t, 1.95, 2.1) : 0 }); });
      const leave = es(t, 4.55, 5.0);
      two.forEach((m) => {
        const come = es(t, 1.45 + m.i * 0.05, 1.8 + m.i * 0.05);
        const x = lerp(610 + m.i * 60 - 200, JX + 90 + m.i * 64, come) + leave * (300 + m.i * 40);
        const y = GY + 10 - m.i * 10 - leave * 50;
        m.p.set({ x, y, s: 0.92 - leave * 0.2, flip: come > 0.98 && leave < 0.02, walk: (come > 0 && come < 1) || (leave > 0 && leave < 1) ? x * 0.06 + m.i : undefined, head: 2, armF: 14, blink: blinkAt(T, m.i + 3) });
      });
      const [jhx, jhy] = headAt(jx, GY, 1.02, false);
      const gk = es(t, 2.05, 2.2, ease.back) * (1 - es(t, 2.4, 2.55));
      pose(go, { x: jhx + 14, y: jhy - 26, s: gk, o: gk > 0.02 ? 1 : 0 });
      /* v30 — the plate: a colt tied, never ridden; untie it and bring it */
      const pk = es(t, 2.35, 2.6, ease.back);
      const py = lerp(-1300, PLATE[1], pk);
      const on = pk > 0.001 ? 1 : 0;
      pose(plate, { x: PLATE[0], y: py, o: on * (1 - es(t, 4.9, 5.0) * 0) });
      const RING = [PLATE[0] - 36, py + 10];
      const untie = es(t, 3.1, 3.3);
      const led = es(t, 3.35, 3.9);
      const cx = PLATE[0] + 20 + led * 30;
      pose(coltEl, { x: cx, y: py + 78, o: on });
      pose(rope, { x: RING[0], y: RING[1], o: on * (1 - untie) });
      pose(ropeLoose, { x: RING[0], y: RING[1], o: on * untie, r: untie * -10 });
      const sk = bump(t, 2.6, 3.05);
      pose(spk, { x: cx + 6, y: py + 20, s: sk * 1.3, r: T * 30, o: sk > 0.02 ? 1 : 0 });
      /* v31 — "Why?" — "The Lord needs it" */
      const ow = es(t, 4.05, 4.2);
      pose(owner, { x: PLATE[0] - 70, y: py + 90, o: on * ow });
      pose(disc, { x: PLATE[0] + 80, y: py + 92, o: on * es(t, 3.3, 3.45) });
      const ak = es(t, 4.1, 4.25, ease.back) * (1 - es(t, 4.9, 5.0));
      pose(ask, { x: PLATE[0] - 70, y: py + 30, s: ak, o: ak > 0.02 ? 1 : 0 });
      const nk = es(t, 4.35, 4.5, ease.back) * (1 - es(t, 4.9, 5.0));
      pose(need, { x: PLATE[0] + 86, y: py + 34, s: nk, o: nk > 0.02 ? 1 : 0 });

      S.cam.x = kf(t, [[-0.5, -60], [0.9, 0], [1.4, -20], [2.3, 100], [4.6, 120], [5.0, 160]]);
      S.cam.y = kf(t, [[-0.5, 30], [1.0, 20], [1.4, -10], [2.3, -40]]);
      S.cam.z = kf(t, [[-0.5, 1.06], [1.0, 1.04], [2.3, 1.1]]);
      if (S.portrait) { S.cam.x = kf(t, [[-0.5, -80], [0.9, 0], [2.0, 0], [2.3, 110], [5.0, 150]]); S.cam.z = 1.0; }
      void question; void mix; void shade; void sheet; void STRING; void hand;
    };
  },
};
/** the plate's still picture: a village house with a door and an iron ring, the lane before it */
function plateInner(c) {
  const s = sheet();
  s.p(c.cut([[-130, 60], [130, 56], [130, 140], [-130, 140]], 0.4, 10), mix(C.sand, C.stone, 0.35));
  return s.out() + house(c, -110, 64, 110, 110, { stairs: false }) + `<path d="${c.cut(c.circ(-36, 10, 5, 10), 0.2, 2)}" fill="none" stroke="${C.soilDark}" stroke-width="2.4"/>`;
}
