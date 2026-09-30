// Łk 5,31–32 — Jesus rises from the table and turns to the Pharisees at the gate. Over the table a painted flat comes
// down on its strings: a physician with his bag of balms walks past a man who is well (busy with his hoe, waving him
// on) and kneels by the one lying sick, and lifts his head. Then the flat flies up, and Jesus turns back to the table
// and opens His arms to the tax collectors and sinners: He came to call them to turn round — a tax collector pushes
// his fat purse away across the table, a woman lifts her face, and a warm light kindles at their hearts.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  levisFeast, FP, FT, SEATS, lookOf, TAXMEN, SINNERS, matWithMan, physicianKit, purse, heartGlow, voiceRings, headAt, kf, moving,
  es, ease, bump, seg, fade, tr, PI,
} from './lib.js';

const camFor = (x) => (x - 800) / FP;
const FX = 845, FY = 96, FW = 580, FH = 300;          // the painted flat: centre x, top y, size
const DOC = { robe: C.skyVeil, mantle: C.teal2, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen, beard: 'full', beardColor: C.greyHair, skin: C.skin2, belt: C.leather };
const WELL = { robe: C.wheatRobe, mantle: null, hair: C.hair, hairStyle: 'short', beard: 'short', skin: C.skin4, belt: C.rope };

function flat(c) {
  const s = sheet();
  s.p(c.cut(c.rect(-FW / 2 - 12, -12, FW + 24, FH + 24), 0.6, 10), C.wood2);
  s.p(c.cut(c.rect(-FW / 2, 0, FW, FH), 0.5, 10), mix(C.skyBlue, C.cream, 0.4));
  s.p(c.cut([[-FW / 2, FH * 0.66], [-FW / 4, FH * 0.6], [FW / 6, FH * 0.64], [FW / 2, FH * 0.58], [FW / 2, FH], [-FW / 2, FH]], 0.6, 10), mix(C.sand, C.hillNear, 0.35));
  s.p(c.cut([[-FW / 2, FH * 0.66], [-FW / 3, FH * 0.5], [-FW / 5, FH * 0.62]], 0.4, 8) + c.cut([[FW / 5, FH * 0.63], [FW / 3, FH * 0.46], [FW / 2, FH * 0.58]], 0.4, 8), C.hillMid);
  // a little house on the right where the sick man lies
  s.p(c.cut(c.rect(FW / 2 - 150, FH * 0.3, 130, FH * 0.44), 0.4, 6), C.plaster);
  s.p(c.cut(c.rect(FW / 2 - 156, FH * 0.3 - 8, 142, 10), 0.3, 6), C.roof);
  s.p(c.cut([[FW / 2 - 110, FH * 0.74], [FW / 2 - 110, FH * 0.5], [FW / 2 - 80, FH * 0.5], [FW / 2 - 80, FH * 0.74]], 0.3, 4), C.soilDark);
  const str = `<path d="M${-FW * 0.4} -1600V-12M${FW * 0.4} -1600V-12" stroke="rgba(74,54,34,.55)" stroke-width="1.4" fill="none"/>`;
  return str + s.out();
}

export default {
  id: 'lk5-physician',
  beats: [
    { v: 31, text: 'Lecz Jezus im odpowiedział:' },
    { v: 31, cont: true, text: '«Nie potrzebują lekarza zdrowi, ale ci, którzy się źle mają.' },
    { v: 32 },
  ],
  cam: { x: [camFor(640), camFor(960)], y: [0, 130], z: [1.0, 1.2] },
  build(S) {
    const c = S.c;
    const F = levisFeast(S);
    // T1 and S0 come alive for v32 (puppets over their still places)
    const t1 = F.places.find((p) => p.who === 'T1'), s0 = F.places.find((p) => p.who === 'S0');
    const t1p = S.puppet(F.L.add(person(c, { ...lookOf('T1'), pose: 'sit' })));
    const s0p = S.puppet(F.L.add(person(c, { ...lookOf('S0'), pose: 'sit' })));
    const purseEl = F.tableL.add(`<g>${purse(c, 1.2)}</g>`);
    const hearts = [0, 1].map(() => F.fx.add(`<g>${heartGlow(c, 11)}</g>`));
    const voice = voiceRings(F.fx, c, { n: 3, color: C.sun, r: 36, w: 6, both: false });

    /* the painted flat and the figures on it (moved together) */
    const flatL = S.layer({ par: FP, sh: 6, rise: 0 });
    const board = flatL.add(`<g>${flat(c)}</g>`);
    const kitM = `<g transform="translate(0 4) scale(.5)">${physicianKit(c)}</g>`;
    const well = S.puppet(flatL.add(person(c, { ...WELL, holdF: `<g transform="rotate(30)">${sheet().p(c.ribbon([[0, -10], [0, 120]], 4), C.wood3).p(c.cut([[-4, 116], [22, 118], [20, 128], [-4, 126]], 0.3, 3), C.stone2).out()}</g>` })));
    const sick = flatL.add(`<g>${matWithMan(c, { w: 150, eyes: 'closed' })}</g>`);
    const doc = S.puppet(flatL.add(person(c, { ...DOC, holdB: kitM })));
    const docK = S.puppet(flatL.add(person(c, { ...DOC, pose: 'kneel', holdB: kitM })));

    return (t, time) => {
      const T = time;
      F.idle(T, 1);
      F.seatAll(1);
      F.leviSit.set({ x: 773, y: FT.SEAT, s: 1.0, o: 1, armF: 40, armB: 14, head: 4, blink: blinkAt(T, 4) });
      F.leviStand.set({ o: 0 });
      F.PH.forEach((ph) => { ph.p.set({ x: ph.x, y: FT.FLOOR - 6 + ph.i * 3, s: 1, armF: 20 + (ph.i === 1 ? 20 : 0), armB: 10, head: ph.i === 1 ? 6 : 0, blink: blinkAt(T, ph.seed) }); fade(ph.angry, 1 - es(t, 1.2, 1.6) * 0.5); });

      /* v31a — He rises and turns to the Pharisees */
      const up = es(t, 0.08, 0.14);
      const toGate = es(t, 0.15, 0.35) * (1 - es(t, 2.02, 2.2));
      const open = es(t, 2.15, 2.4);
      F.jSit.set({ x: 845, y: FT.SEAT, s: 1.02, o: 1 - up, armF: 30, armB: 14, blink: blinkAt(T) });
      F.jStand.set({ x: 845, y: FT.FLOOR - 70, s: 1.02, flip: toGate > 0.5 || t < 2.1, o: up, armF: 16 + toGate * 60 + open * 70, armB: 10 + toGate * 30 + open * 90, head: -toGate * 4 + open * 6, blink: blinkAt(T) });
      const [jhx, jhy] = headAt(845, FT.FLOOR - 70, 1.02, true);
      voice(jhx + (t < 2.1 ? -16 : 16), jhy, toGate * (1 - es(t, 1.9, 2.0)) + open * (1 - es(t, 2.9, 3)), T, { dir: t < 2.1 ? -1 : 1, spread: 2 });

      /* v31b — the painted flat: the physician goes past the well man to the sick one */
      const fl = es(t, 0.85, 1.25, ease.out) * (1 - es(t, 2.0, 2.3, ease.in));
      const oy = lerp(-700, FY, fl) + (T ? Math.sin(T * 0.7) * 2 : 0);
      pose(board, { x: FX, y: oy, o: fl > 0.01 ? 1 : 0 });
      const G = oy + FH * 0.84;
      const at = (lx) => FX + lx;
      well.set({ x: at(-150), y: G, s: 0.52, flip: false, o: fl > 0.01 ? 1 : 0, armF: 60 + (T ? Math.sin(T * 3) * 10 : 0) * (1 - bump(t, 1.35, 1.6)), armB: 20 + bump(t, 1.35, 1.65) * 120, head: -bump(t, 1.35, 1.6) * 6, blink: blinkAt(T, 5) });
      pose(sick, { x: at(180), y: G - 14, s: 0.6, o: fl > 0.01 ? 1 : 0 });
      const dk = [[1.15, -260], [1.7, 110]];
      const dx = kf(t, dk, (u) => u);
      const kneel = es(t, 1.72, 1.78);
      doc.set({ x: at(dx), y: G + 4, s: 0.55, flip: false, o: (fl > 0.01 ? 1 : 0) * (1 - kneel), walk: moving(t, dk) ? dx * 0.08 : undefined, armF: 14, armB: 20, blink: blinkAt(T, 6) });
      docK.set({ x: at(120), y: G + 4, s: 0.55, flip: false, o: (fl > 0.01 ? 1 : 0) * kneel, armF: 50 + es(t, 1.8, 1.95) * 30, armB: 30, lean: 12, head: 14, blink: blinkAt(T, 6) });

      /* v32 — to call sinners to repentance: the purse pushed away, faces lifted, warmth at their hearts */
      const turn = es(t, 2.3, 2.55);
      pose(t1.el, { x: t1.x, y: FT.SEAT, o: 0 });
      pose(s0.el, { x: s0.x, y: FT.SEAT, o: 0 });
      t1p.set({ x: t1.x, y: FT.SEAT, s: 1, flip: true, armF: 56 - turn * 20 + bump(t, 2.3, 2.6) * 50, armB: 16, head: 2 + turn * 10, blink: blinkAt(T, 7) });
      s0p.set({ x: s0.x, y: FT.SEAT, s: 1, flip: false, armF: 56 - turn * 30, armB: 16 + turn * 60, head: 8 - turn * 16, blink: blinkAt(T, 8) });
      const pp = es(t, 2.35, 2.6);
      pose(purseEl, { x: lerp(t1.x - 20, t1.x - 80, pp), y: FT.FLOOR - 70 + pp * 26, r: pp * -20, o: 1 });
      hearts.forEach((h, i) => { const k = es(t, 2.45 + i * 0.1, 2.7 + i * 0.1, ease.back); pose(h, { x: (i ? s0.x : t1.x) + (i ? 8 : -8), y: FT.SEAT - 110, s: k, o: k > 0.01 ? 1 : 0 }); });

      S.cam.x = kf(t, [[0, camFor(760)], [0.4, camFor(700)], [0.9, camFor(820)], [2.0, camFor(840)], [2.3, camFor(900)], [3, camFor(910)]]);
      S.cam.y = kf(t, [[0, 110], [0.9, 30], [2.0, 30], [2.3, 110], [3, 120]]);
      S.cam.z = kf(t, [[0, 1.1], [0.4, 1.14], [0.9, 1.02], [2.0, 1.02], [2.3, 1.12], [3, 1.16]]);
    };
  },
};
